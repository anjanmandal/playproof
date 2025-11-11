import { randomUUID } from "crypto";
import {
  RehabAssessmentInput,
  RehabAssessmentResult,
  RehabFormGrade,
  RtsGateSummary,
  RtsGateMetric,
  RtsTrustGrade,
} from "../types/rehab";
import { getOpenAIClient } from "../config/openaiClient";
import { env } from "../config/env";
import { prisma } from "../db/prisma";
import { ensureAthlete } from "./athleteService";
import { Prisma } from "../generated/prisma/client";
import { buildInputImageContent } from "../utils/openaiMedia";
import { createAutomationCaseEvent } from "./caseChannelService";

const REHAB_RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    cleared: { type: "boolean" },
    limb_symmetry_index: { type: "number" },
    concerns: { type: "array", items: { type: "string" } },
    recommended_exercises: { type: "array", items: { type: "string" }, minItems: 2, maxItems: 3 },
    parent_summary: { type: "string" },
    athlete_summary: { type: "string" },
    clinician_notes: { type: "string" },
  },
  required: [
    "cleared",
    "limb_symmetry_index",
    "concerns",
    "recommended_exercises",
    "parent_summary",
    "athlete_summary",
    "clinician_notes",
  ],
  additionalProperties: false,
} as const;

const LIVE_CAPTURE_RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    single_hop_injured_cm: { type: "number" },
    single_hop_healthy_cm: { type: "number" },
    triple_hop_injured_cm: { type: "number" },
    triple_hop_healthy_cm: { type: "number" },
    crossover_hop_injured_cm: { type: "number" },
    crossover_hop_healthy_cm: { type: "number" },
    y_balance_injured_pct: { type: "number" },
    y_balance_healthy_pct: { type: "number" },
    quad_injured_lbs: { type: "number" },
    quad_healthy_lbs: { type: "number" },
    hamstring_injured_lbs: { type: "number" },
    hamstring_healthy_lbs: { type: "number" },
    acl_rsi_score: { type: "number" },
    strength_bw_ratio: { type: "number" },
  },
  required: [
    "single_hop_injured_cm",
    "single_hop_healthy_cm",
    "triple_hop_injured_cm",
    "triple_hop_healthy_cm",
    "crossover_hop_injured_cm",
    "crossover_hop_healthy_cm",
  ],
  additionalProperties: false,
} as const;

const GRADE_CUES: Record<RehabFormGrade, { badge: string; detail: string }> = {
  A: {
    badge: "Form IQ A",
    detail: "Maintain soft landings, keep both knees tracking, and breathe through every rep.",
  },
  B: {
    badge: "Form IQ B",
    detail: "Control speed on each cut, cue hips-back, and lock the landing before loading.",
  },
  C: {
    badge: "Form IQ C",
    detail: "Pause the set, reset mechanics, and focus on knees-over-toes before adding load.",
  },
};

const determineFormGrade = (score: number): RehabFormGrade => {
  if (score >= 0.95) return "A";
  if (score >= 0.9) return "B";
  return "C";
};

type GateBuilder = {
  id: string;
  label: "Single-Hop LSI" | "Triple-Hop LSI" | "Crossover Hop LSI" | "Isometric Quad LSI" | "Isometric Ham LSI" | "Strength:BW" | "Y-Balance Composite" | "ACL-RSI Short";
  category: "hop" | "strength" | "balance" | "psych";
  units: string;
  scale: "percent" | "ratio";
  targetPivot: number;
  targetNonPivot: number;
  fallback: number;
  baseTrust?: RtsTrustGrade;
  presentNote: string;
  missingNote: string;
  compute: (input: RehabAssessmentInput | null) => number | null;
};

const computeRatio = (numerator?: number, denominator?: number) => {
  if (typeof numerator !== "number" || typeof denominator !== "number" || denominator === 0) return null;
  return Number((numerator / denominator).toFixed(4));
};

const RTS_GATE_BUILDERS: GateBuilder[] = [
  {
    id: "single_hop_lsi",
    label: "Single-Hop LSI",
    category: "hop",
    units: "% of contralateral",
    scale: "percent",
    targetPivot: 0.95,
    targetNonPivot: 0.9,
    fallback: 0.85,
    baseTrust: "B",
    presentNote: "Minor valgus detected on rep two; prompt decel drills.",
    missingNote: "Capture single-leg hop trial to compute LSI.",
    compute: (input) =>
      computeRatio(input?.limbSymmetry?.injured.hopDistance, input?.limbSymmetry?.healthy.hopDistance),
  },
  {
    id: "triple_hop_lsi",
    label: "Triple-Hop LSI",
    category: "hop",
    units: "% of contralateral",
    scale: "percent",
    targetPivot: 0.95,
    targetNonPivot: 0.9,
    fallback: 0.87,
    baseTrust: "A",
    presentNote: "Stable takeoff mechanics across reps.",
    missingNote: "Capture triple-hop to unlock LSI.",
    compute: (input) =>
      computeRatio(
        input?.limbSymmetry?.injured.tripleHopDistance,
        input?.limbSymmetry?.healthy.tripleHopDistance,
      ),
  },
  {
    id: "crossover_hop_lsi",
    label: "Crossover Hop LSI",
    category: "hop",
    units: "% of contralateral",
    scale: "percent",
    targetPivot: 0.95,
    targetNonPivot: 0.9,
    fallback: 0.84,
    baseTrust: "B",
    presentNote: "Lateral decel lag vs healthy limb.",
    missingNote: "Record crossover hop (camera guided) to populate this gate.",
    compute: (input) =>
      computeRatio(input?.crossoverHop?.injuredDistance, input?.crossoverHop?.healthyDistance),
  },
  {
    id: "iso_quad",
    label: "Isometric Quad LSI",
    category: "strength",
    units: "% of contralateral",
    scale: "percent",
    targetPivot: 0.9,
    targetNonPivot: 0.9,
    fallback: 0.9,
    baseTrust: "A",
    presentNote: "Force plate capture; consistent recruitment.",
    missingNote: "Add isometric quad reading.",
    compute: (input) =>
      computeRatio(input?.strength?.injured.quad, input?.strength?.healthy.quad),
  },
  {
    id: "iso_ham",
    label: "Isometric Ham LSI",
    category: "strength",
    units: "% of contralateral",
    scale: "percent",
    targetPivot: 0.9,
    targetNonPivot: 0.85,
    fallback: 0.88,
    baseTrust: "A",
    presentNote: "Nordic strap tension acceptable.",
    missingNote: "Record hamstring dynamometer or nordic sensor.",
    compute: (input) =>
      computeRatio(input?.strength?.injured.hamstring, input?.strength?.healthy.hamstring),
  },
  {
    id: "strength_bw",
    label: "Strength:BW",
    category: "strength",
    units: "x bodyweight",
    scale: "ratio",
    targetPivot: 2.4,
    targetNonPivot: 2.2,
    fallback: 2.2,
    baseTrust: "A",
    presentNote: "Isokinetic torque normalized for BW.",
    missingNote: "Provide strength-to-bodyweight score.",
    compute: (input) => (typeof input?.strengthToBw === "number" ? input.strengthToBw : null),
  },
  {
    id: "y_balance",
    label: "Y-Balance Composite",
    category: "balance",
    units: "% of baseline",
    scale: "percent",
    targetPivot: 0.92,
    targetNonPivot: 0.9,
    fallback: 0.9,
    baseTrust: "B",
    presentNote: "Posteromedial reach flagged on trial 1.",
    missingNote: "Enter Y-Balance composite for both limbs.",
    compute: (input) =>
      computeRatio(input?.yBalance?.injuredComposite, input?.yBalance?.healthyComposite),
  },
  {
    id: "acl_rsi",
    label: "ACL-RSI Short",
    category: "psych",
    units: "score / 100",
    scale: "percent",
    targetPivot: 0.75,
    targetNonPivot: 0.7,
    fallback: 0.72,
    baseTrust: "A",
    presentNote: "Self-report survey indicates improving confidence.",
    missingNote: "Have athlete complete ACL-RSI short survey.",
    compute: (input) =>
      typeof input?.psychological?.aclRsiScore === "number"
        ? Number((input.psychological.aclRsiScore / 100).toFixed(4))
        : null,
  },
];

const REHAB_SYSTEM_PROMPT = `
You are a return-to-play gatekeeper following evidence-based ACL protocols.
Use hop tests, limb symmetry, and strength metrics to decide clearance.
If LSI < 0.9 or mechanics show valgus collapse, return NOT CLEARED.
Provide friendly explanations for parents and athletes, and clinical notes for the medical team.
`;

const LIVE_CAPTURE_SYSTEM_PROMPT = `
You are an on-device biomechanics assistant. Analyze the provided hop video frames to estimate injured vs healthy distances, balance %, strength to BW, and psychological readiness proxies. Return realistic numbers even if confidence is moderate.
`;

type LiveCaptureInput = Pick<RehabAssessmentInput, "athleteId" | "surgicalSide" | "sessionDate" | "videos">;

const REHAB_USER_PROMPT = (input: RehabAssessmentInput) => {
  const lines = [
    `Athlete ID: ${input.athleteId}`,
    `Surgical side: ${input.surgicalSide}`,
    `Hop metrics (injured): ${JSON.stringify(input.limbSymmetry?.injured ?? {})}`,
    `Hop metrics (healthy): ${JSON.stringify(input.limbSymmetry?.healthy ?? {})}`,
    `Strength metrics (injured): ${JSON.stringify(input.strength?.injured ?? {})}`,
    `Strength metrics (healthy): ${JSON.stringify(input.strength?.healthy ?? {})}`,
    `Videos: ${input.videos.map((video) => `${video.testType}:${video.url}`).join(", ")}`,
  ];

  return `
Use the data to estimate limb symmetry index (injured / healthy).
Identify whether the athlete is cleared to return to team practice.
If not cleared, spell out top deficits and precautions.
`.trim() + "\n\n" + lines.join("\n");
};

const buildMockRehabAssessment = (input: RehabAssessmentInput): RehabAssessmentResult => {
  const injuredHop = input.limbSymmetry?.injured.hopDistance ?? 0;
  const healthyHop = input.limbSymmetry?.healthy.hopDistance ?? 1;
  const hopLSI = healthyHop ? injuredHop / healthyHop : 0;

  const injuredStrength = input.strength?.injured.quad ?? 0;
  const healthyStrength = input.strength?.healthy.quad ?? 1;
  const strengthLSI = healthyStrength ? injuredStrength / healthyStrength : 0;

  const compositeLSI = Math.round(((hopLSI + strengthLSI) / 2) * 100) / 100;
  const cleared = compositeLSI >= 0.9;

  const concerns = cleared
    ? ["Maintain neuromuscular control work during re-introduction."]
    : ["Limb symmetry index below 90%. Focus on power absorption and quad strength."];

  const recommendedExercises = cleared
    ? ["Continue single-leg decel drills", "Add return-to-sprint build-up progression"]
    : ["Nordic hamstring curls 3x/week", "Single-leg RDL with emphasis on hip hinge"];

  const formGrade = determineFormGrade(compositeLSI);
  const formCue = GRADE_CUES[formGrade].detail;

  return {
    rehabAssessmentId: randomUUID(),
    athleteId: input.athleteId,
    cleared,
    limbSymmetryScore: compositeLSI,
    concerns,
    recommendedExercises,
    parentSummary: cleared
      ? "Great news! Strength and hop power look balanced. Ease back into full play over the next week."
      : "Not quite ready yet—power and control are still uneven. Stick to the home exercises and we'll re-check soon.",
    athleteSummary: cleared
      ? "Cleared for controlled team drills. Keep focusing on soft landings and hip drive."
      : "Keep grinding those single-leg hops and quad work—goal is 90%+ power match before release.",
    clinicianNotes: cleared
      ? "Composite LSI >= 0.9. Monitor fatigue during first week back."
      : "Recommend continued closed-chain strength + neuromuscular training. Re-test hop & dynamometer in 10-14 days.",
    generatedAt: new Date().toISOString(),
    rawModelOutput: { source: "mock" },
    formGrade,
    formCue,
  };
};

export const evaluateRehabClearance = async (
  input: RehabAssessmentInput,
): Promise<RehabAssessmentResult> => {
  await ensureAthlete(input.athleteId, input.athleteId);

  const client = getOpenAIClient();

  if (!client || env.USE_OPENAI_MOCKS) {
    const mock = buildMockRehabAssessment(input);
    await persistRehabAssessment(input, mock);
    return mock;
  }

  try {
    const mediaContents = await Promise.all(
      input.videos.map((video) => buildInputImageContent(video.url)),
    );

    const response = await (client.responses as any).create({
      model: env.NODE_ENV === "production" ? "gpt-4.1" : "gpt-4.1-mini",
      input: [
        { role: "system", content: [{ type: "input_text", text: REHAB_SYSTEM_PROMPT.trim() }] },
        {
          role: "user",
          content: [
            { type: "input_text", text: REHAB_USER_PROMPT(input) },
            ...mediaContents.filter(Boolean),
          ],
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "RehabAssessment",
          schema: REHAB_RESPONSE_SCHEMA,
          strict: false,
        },
      },
    });

    const data =
      (response.output as any)?.[0]?.content?.find((item: any) => item?.parsed)?.parsed ??
      (response as any).parsed ??
      (response.output_text ? JSON.parse(response.output_text) : null);

    if (!data) {
      throw new Error("Unable to parse OpenAI rehab response");
    }

    const formGrade = determineFormGrade(data.limb_symmetry_index);
    const formCue = GRADE_CUES[formGrade].detail;
    const result: RehabAssessmentResult = {
      rehabAssessmentId: randomUUID(),
      athleteId: input.athleteId,
      cleared: data.cleared,
      limbSymmetryScore: data.limb_symmetry_index,
      concerns: data.concerns,
      recommendedExercises: data.recommended_exercises,
      parentSummary: data.parent_summary,
      athleteSummary: data.athlete_summary,
      clinicianNotes: data.clinician_notes,
      generatedAt: new Date().toISOString(),
      rawModelOutput: data,
      formGrade,
      formCue,
    };

    await persistRehabAssessment(input, result);

    return result;
  } catch (error) {
    console.error("OpenAI rehab clearance failed", error);
    const fallback = buildMockRehabAssessment(input);
    await persistRehabAssessment(input, fallback);
    return fallback;
  }
};

const persistRehabAssessment = async (
  input: RehabAssessmentInput,
  result: RehabAssessmentResult,
) => {
  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    await tx.rehabAssessment.create({
      data: {
        id: result.rehabAssessmentId,
        athleteId: input.athleteId,
        surgicalSide: input.surgicalSide,
        sessionDate: input.sessionDate ? new Date(input.sessionDate) : undefined,
        limbSymmetryScore: result.limbSymmetryScore,
        cleared: result.cleared,
        concerns: JSON.stringify(result.concerns),
        recommendedExercises: JSON.stringify(result.recommendedExercises),
        athleteSummary: result.athleteSummary,
        parentSummary: result.parentSummary,
        clinicianNotes: result.clinicianNotes,
        rawModelOutput: JSON.stringify(result.rawModelOutput ?? {}),
        inputSnapshot: input as unknown as Prisma.InputJsonValue,
        formGrade: result.formGrade,
        formCue: result.formCue,
        videos: {
          createMany: {
            data: input.videos.map((video) => ({
              id: video.id,
              url: video.url,
              testType: video.testType,
              capturedAt: video.capturedAt,
            })),
          },
        },
      },
    });
  });
  await recordRehabCaseEvent(input, result);
};

const recordRehabCaseEvent = async (input: RehabAssessmentInput, result: RehabAssessmentResult) => {
  try {
    const athlete = await prisma.athlete.findUnique({
      where: { id: input.athleteId },
      select: { team: true },
    });
    const summary = result.cleared
      ? `Cleared · LSI ${Math.round(result.limbSymmetryScore)}%`
      : `Locked · LSI ${Math.round(result.limbSymmetryScore)}%`;
    await createAutomationCaseEvent(
      input.athleteId,
      {
        eventType: "rehab",
        title: result.cleared ? "Rehab badge unlocked" : "Rehab gate locked",
        summary,
        trustGrade: result.formGrade,
        nextAction: result.cleared ? undefined : result.concerns?.[0],
        pinned: !result.cleared,
        metadata: {
          concerns: result.concerns?.slice?.(0, 3),
          recommendedExercises: result.recommendedExercises?.slice?.(0, 3),
          formCue: result.formCue,
        },
      },
      { team: athlete?.team ?? null, actor: { role: "Rehab AI" } },
    );
  } catch (error) {
    console.warn("Failed to create rehab case event", error);
  }
};

const clampNumber = (value: number, min: number, max: number) => {
  if (Number.isNaN(value)) return min;
  if (value < min) return min;
  if (value > max) return max;
  return value;
};

const fallbackLiveMetrics = () => ({
  single_hop_injured_cm: 140,
  single_hop_healthy_cm: 158,
  triple_hop_injured_cm: 420,
  triple_hop_healthy_cm: 458,
  crossover_hop_injured_cm: 330,
  crossover_hop_healthy_cm: 360,
  y_balance_injured_pct: 90,
  y_balance_healthy_pct: 95,
  quad_injured_lbs: 165,
  quad_healthy_lbs: 182,
  hamstring_injured_lbs: 120,
  hamstring_healthy_lbs: 135,
  acl_rsi_score: 78,
  strength_bw_ratio: 2.3,
});

const buildInputFromMetrics = (
  capture: LiveCaptureInput,
  metrics: ReturnType<typeof fallbackLiveMetrics>,
): RehabAssessmentInput => ({
  athleteId: capture.athleteId,
  surgicalSide: capture.surgicalSide,
  sessionDate: capture.sessionDate,
  videos: capture.videos,
  limbSymmetry: {
    injured: {
      hopDistance: metrics.single_hop_injured_cm,
      tripleHopDistance: metrics.triple_hop_injured_cm,
    },
    healthy: {
      hopDistance: metrics.single_hop_healthy_cm,
      tripleHopDistance: metrics.triple_hop_healthy_cm,
    },
  },
  strength: {
    injured: {
      quad: metrics.quad_injured_lbs,
      hamstring: metrics.hamstring_injured_lbs,
      units: "lbs",
    },
    healthy: {
      quad: metrics.quad_healthy_lbs,
      hamstring: metrics.hamstring_healthy_lbs,
      units: "lbs",
    },
  },
  crossoverHop: {
    injuredDistance: metrics.crossover_hop_injured_cm,
    healthyDistance: metrics.crossover_hop_healthy_cm,
  },
  yBalance: {
    injuredComposite: metrics.y_balance_injured_pct,
    healthyComposite: metrics.y_balance_healthy_pct,
  },
  psychological: {
    aclRsiScore: clampNumber(metrics.acl_rsi_score, 0, 100),
  },
  strengthToBw: clampNumber(metrics.strength_bw_ratio, 1.5, 3.5),
});

const inferLiveCaptureMetrics = async (capture: LiveCaptureInput): Promise<RehabAssessmentInput> => {
  const client = getOpenAIClient();
  if (!client || env.USE_OPENAI_MOCKS) {
    return buildInputFromMetrics(capture, fallbackLiveMetrics());
  }

  try {
    const mediaContents = await Promise.all(
      capture.videos.map((video) => buildInputImageContent(video.url)),
    );

    const response = await (client.responses as any).create({
      model: env.NODE_ENV === "production" ? "gpt-4.1" : "gpt-4.1-mini",
      input: [
        { role: "system", content: [{ type: "input_text", text: LIVE_CAPTURE_SYSTEM_PROMPT.trim() }] },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: `Athlete ${capture.athleteId} (${capture.surgicalSide}). Estimate hop/strength metrics from attached frames. Return JSON fields per schema.`,
            },
            ...mediaContents.filter(Boolean),
          ],
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "LiveCaptureMetrics",
          schema: LIVE_CAPTURE_RESPONSE_SCHEMA,
          strict: false,
        },
      },
    });

    const parsed =
      (response.output as any)?.[0]?.content?.find((item: any) => item?.parsed)?.parsed ??
      (response as any).parsed ??
      (response.output_text ? JSON.parse(response.output_text) : null);

    if (!parsed) {
      throw new Error("Unable to parse live capture response");
    }

    const metrics = { ...fallbackLiveMetrics(), ...parsed };
    return buildInputFromMetrics(capture, metrics);
  } catch (error) {
    console.error("Live capture inference failed", error);
    return buildInputFromMetrics(capture, fallbackLiveMetrics());
  }
};

export const processLiveCapture = async (capture: LiveCaptureInput) => {
  const inferred = await inferLiveCaptureMetrics(capture);
  const assessment = await evaluateRehabClearance(inferred);
  return { assessment, derivedInput: inferred };
};

export const listRehabAssessments = (athleteId: string, limit = 10) =>
  prisma.rehabAssessment.findMany({
    where: { athleteId },
    orderBy: { sessionDate: "desc" },
    take: limit,
    include: {
      videos: true,
    },
  });

export const getRehabAssessmentDetail = (assessmentId: string) =>
  prisma.rehabAssessment.findUnique({
    where: { id: assessmentId },
    include: {
      videos: true,
      athlete: true,
    },
  });

type GateRequest = {
  athleteId?: string;
  sport?: "pivot" | "non_pivot";
  sex?: "female" | "male";
  age?: number;
};

const formatPercent = (value: number) => Number(value.toFixed(4));

export const getRtsGateSummary = async ({
  athleteId,
  sport = "pivot",
  sex = "female",
  age = 20,
}: GateRequest): Promise<RtsGateSummary> => {
  const normalizedAthleteId = athleteId ?? "demo-athlete";
  let latestInput: RehabAssessmentInput | null = null;
  let previousInput: RehabAssessmentInput | null = null;

  if (athleteId) {
    const assessments = await prisma.rehabAssessment.findMany({
      where: { athleteId },
      orderBy: [{ sessionDate: "desc" }, { createdAt: "desc" }],
      take: 2,
    });
    latestInput = parseInputSnapshot(assessments[0]?.inputSnapshot);
    previousInput = parseInputSnapshot(assessments[1]?.inputSnapshot);
  }

  const gates: RtsGateMetric[] = RTS_GATE_BUILDERS.map((builder) => {
    const percentMetric = builder.scale === "percent";
    const baseTarget = sport === "pivot" ? builder.targetPivot : builder.targetNonPivot;
    const sexAdjust =
      sex === "female" && sport === "pivot"
        ? baseTarget + (percentMetric ? 0.02 : 0.05)
        : baseTarget;
    const ageAdjust = percentMetric
      ? age >= 28
        ? sexAdjust + 0.01
        : age <= 16
        ? sexAdjust - 0.02
        : sexAdjust
      : sexAdjust;
    const target = percentMetric
      ? formatPercent(Math.min(1.1, Math.max(0.5, ageAdjust)))
      : Number(ageAdjust.toFixed(2));

    const latestValue = builder.compute(latestInput);
    const previousValue = builder.compute(previousInput);
    const fallback = builder.fallback;
    const latest = latestValue ?? fallback;
    const monthAgo = previousValue ?? fallback;
    const best = Math.max(latest, previousValue ?? fallback);

    const trust: RtsTrustGrade =
      latestValue != null ? builder.baseTrust ?? "A" : "C";
    const variance =
      latestValue != null && previousValue != null
        ? Math.max(1, Math.round(Math.abs(latestValue - previousValue) * (percentMetric ? 100 : 40)))
        : latestValue != null
        ? 2
        : 8;
    const driftPercent =
      monthAgo > 0 ? Number((((monthAgo - latest) / monthAgo) * 100).toFixed(1)) : 0;
    const driftLocked = driftPercent >= 5;
    const status: "pass" | "fail" =
      latest >= target && !driftLocked && trust !== "C" ? "pass" : "fail";
    const notes = latestValue != null ? builder.presentNote : builder.missingNote;

    return {
      id: builder.id,
      label: builder.label,
      category: builder.category,
      units: builder.units,
      scale: builder.scale,
      latest,
      best,
      monthAgo,
      target,
      trust,
      variance,
      notes,
      driftLocked,
      driftPercent,
      status,
    };
  });

  const gatesRemaining = gates.filter((gate) => gate.status === "fail").length;
  const ready = gatesRemaining === 0;
  const progressPct = Math.round(((gates.length - gatesRemaining) / gates.length) * 100);
  const firstLocked = gates.find((gate) => gate.status === "fail");
  const explanation = firstLocked
    ? `${firstLocked.label} at ${
        firstLocked.scale === "percent"
          ? `${(firstLocked.latest * 100).toFixed(0)}%`
          : firstLocked.latest.toFixed(2)
      } (< target). Suggest: ${firstLocked.notes}`
    : "All RTS gates satisfied. Maintain weekly neuromuscular tune-ups.";

  return {
    athleteId: normalizedAthleteId,
    sport,
    sex,
    age,
    ready,
    progressPct,
    gatesRemaining,
    explanation,
    cameraHint: "Trust score improves with consistent lighting (>=300 lux) and 60 FPS capture.",
    receiptUrl: "/docs/rts-evidence.pdf",
    gates,
  };
};

const parseInputSnapshot = (
  snapshot: Prisma.JsonValue | null | undefined,
): RehabAssessmentInput | null => {
  if (!snapshot || typeof snapshot !== "object" || Array.isArray(snapshot)) return null;
  return snapshot as unknown as RehabAssessmentInput;
};
