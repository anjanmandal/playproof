import { randomUUID } from "crypto";
import { prisma } from "../db/prisma";
import {
  MovementAssessmentInput,
  MovementAssessmentResult,
  MovementBandWindow,
  MovementMicroPlan,
  MovementProofSummary,
  MovementVerdict,
  PhaseScore,
  ViewQualityAssessment,
  CounterfactualPlan,
  OverlayInstruction,
} from "../types/assessments";
import { MicroDrill } from "../types/risk";
import { getOpenAIClient } from "../config/openaiClient";
import { env } from "../config/env";
import { ensureAthlete } from "./athleteService";
import { Prisma } from "../generated/prisma/client";
import { buildInputImageContent } from "../utils/openaiMedia";

type DrillType = MovementAssessmentInput["drillType"];

interface MovementProofPersistencePayload {
  summary: MovementProofSummary;
  assessmentFields: {
    verdict?: string;
    verdictReason?: string | null;
    viewQuality?: string;
    baselineBand?: string;
    bandUncertainty0to1?: number | null;
    microPlan?: string;
  };
  proofData: Prisma.MovementProofUncheckedCreateInput;
}

type MovementProofWithAssessment = Prisma.MovementProofGetPayload<{
  include: { assessment: true };
}>;

const classifyViewQualityLabel = (score?: number | null): "low" | "medium" | "high" | undefined => {
  if (score === undefined || score === null) return undefined;
  if (score >= 0.75) return "high";
  if (score >= 0.55) return "medium";
  return "low";
};

const safeNumber = (value: unknown): number | null => {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
};

const parseJsonField = <T>(value: unknown): T | undefined => {
  if (!value) return undefined;
  if (typeof value === "string") {
    try {
      return JSON.parse(value) as T;
    } catch {
      return undefined;
    }
  }
  if (typeof value === "object") {
    return value as T;
  }
  return undefined;
};

const buildBandSummary = (delta: Record<string, unknown> | null | undefined): MovementBandWindow[] => {
  if (!delta || typeof delta !== "object") return [];

  const windows: MovementBandWindow[] = [];
  const seen = new Set<string>();

  const mappings: Array<{
    keys: string[];
    metric: string;
    label: string;
    units?: string;
    threshold: number;
    absolute?: boolean;
  }> = [
    {
      keys: ["knee_valgus_sigma", "valgus_sigma", "kneeValgusSigma"],
      metric: "knee_valgus_sigma",
      label: "Knee valgus (σ)",
      threshold: 1,
      absolute: true,
    },
    {
      keys: ["valgus_angle_deg", "knee_valgus_deg"],
      metric: "valgus_angle_deg",
      label: "Peak valgus (°)",
      units: "deg",
      threshold: 5,
      absolute: true,
    },
    {
      keys: ["time_to_stable_ms", "timeToStableMs"],
      metric: "time_to_stable_ms",
      label: "Time to stable (ms)",
      units: "ms",
      threshold: 100,
      absolute: true,
    },
  ];

  const pushWindow = (
    metric: string,
    label: string,
    value: number,
    options?: { units?: string; threshold?: number; absolute?: boolean },
  ) => {
    const threshold = options?.threshold ?? 1;
    const magnitude = options?.absolute === false ? value : Math.abs(value);
    const status: MovementBandWindow["status"] = magnitude <= threshold ? "inside" : "outside";
    windows.push({
      metric,
      label,
      delta: Number(value.toFixed(3)),
      units: options?.units,
      status,
      zScore: metric.endsWith("sigma") ? Number(value.toFixed(3)) : undefined,
    });
  };

  mappings.forEach((mapping) => {
    const raw = mapping.keys
      .map((key) => {
        seen.add(key);
        return (delta as Record<string, unknown>)[key];
      })
      .find((value) => value !== undefined && value !== null);
    const value = safeNumber(raw);
    if (value === null) return;
    pushWindow(mapping.metric, mapping.label, value, {
      units: mapping.units,
      threshold: mapping.threshold,
      absolute: mapping.absolute ?? true,
    });
  });

  Object.entries(delta).forEach(([key, raw]) => {
    if (seen.has(key)) return;
    const value = safeNumber(raw);
    if (value === null) return;
    if (key.endsWith("_sigma")) {
      pushWindow(key, key.replace(/_/g, " "), value, { threshold: 1, absolute: true });
      return;
    }
    if (key.endsWith("_deg")) {
      pushWindow(key, key.replace(/_/g, " "), value, { units: "deg", threshold: 5, absolute: true });
      return;
    }
    if (key.endsWith("_ms")) {
      pushWindow(key, key.replace(/_/g, " "), value, { units: "ms", threshold: 120, absolute: true });
    }
  });

  return windows;
};

const MICRO_PLAN_PHASE_LIBRARY: Record<
  "landing_control" | "frontal_plane_control" | "asymmetry",
  MovementMicroPlan
> = {
  landing_control: {
    focus: "Landing stiffness → soft knees and hips back",
    phase: "landing_control",
    durationMinutes: 6,
    expectedMinutes: 6,
    progression: "build",
    quickAssignAvailable: true,
    drills: [
      { name: "Drop-jump stick", sets: 2, reps: 8, rest_s: 45 },
      { name: "Single-leg tempo snap down", sets: 2, reps: 6, rest_s: 40 },
      { name: "Lateral bound hold", sets: 2, reps: 5, rest_s: 35 },
    ],
  },
  frontal_plane_control: {
    focus: "Control valgus window",
    phase: "frontal_plane_control",
    durationMinutes: 7,
    expectedMinutes: 7,
    progression: "build",
    quickAssignAvailable: true,
    drills: [
      { name: "Tempo plant-to-stick", sets: 2, reps: 5, rest_s: 50 },
      { name: "Mirror shuffle stick", sets: 2, reps: 5, rest_s: 45 },
      { name: "Mini-band lateral drive", sets: 2, reps: 10, rest_s: 30 },
    ],
  },
  asymmetry: {
    focus: "Match left/right decel",
    phase: "asymmetry",
    durationMinutes: 8,
    expectedMinutes: 8,
    progression: "build",
    quickAssignAvailable: true,
    drills: [
      { name: "Single-leg drop catch (weak side)", sets: 3, reps: 4, rest_s: 45 },
      { name: "Split squat iso hold", sets: 2, reps: 30, rest_s: 30 },
      { name: "Crossover decel series", sets: 2, reps: 4, rest_s: 45 },
    ],
  },
};

const determineDriftPhase = (
  bandSummary: MovementBandWindow[],
  asymmetryIndex?: number | null,
): "landing_control" | "frontal_plane_control" | "asymmetry" => {
  const hasValgusDrift = bandSummary.some(
    (band) => band.status === "outside" && /valgus|sigma/i.test(band.metric ?? ""),
  );
  if (hasValgusDrift) {
    return "frontal_plane_control";
  }

  const hasLandingDrift = bandSummary.some(
    (band) => band.status === "outside" && /stable|ground_contact/i.test(band.metric ?? ""),
  );
  if (hasLandingDrift) {
    return "landing_control";
  }

  if (typeof asymmetryIndex === "number" && asymmetryIndex >= 20) {
    return "asymmetry";
  }

  return "landing_control";
};

const buildTargetedMicroPlan = (
  result: MovementAssessmentResult,
  bandSummary: MovementBandWindow[],
): MovementMicroPlan | undefined => {
  const phase = determineDriftPhase(bandSummary, result.asymmetryIndex0to100);
  const template = MICRO_PLAN_PHASE_LIBRARY[phase] ?? MICRO_PLAN_PHASE_LIBRARY.landing_control;
  if (!template) return undefined;

  return {
    ...template,
    drills: template.drills.map((drill: MicroDrill) => ({ ...drill })),
    completion: { completed: false },
    quickAssignAvailable: true,
  };
};

const attachProofToResult = (result: MovementAssessmentResult): MovementProofPersistencePayload => {
  const viewQualityScore = result.viewQuality?.score0to1 ?? null;
  const viewQualityLabel = classifyViewQualityLabel(viewQualityScore);
  const bandSummary = buildBandSummary(result.deltaFromBaseline);
  const proofId = randomUUID();

  const kneeValgusScore = result.metrics?.kneeValgusScore ?? 0;
  const elevatedRisk = result.riskRating >= 2 || kneeValgusScore >= 2;
  const bandBreaches = bandSummary.filter((band) => band.status === "outside");

  let verdict: MovementVerdict = bandBreaches.length === 0 && !elevatedRisk ? "pass" : "fix";
  let verdictReason = bandBreaches.length
    ? `Outside Movement Twin band for ${bandBreaches.map((band) => band.label ?? band.metric).join(", ")}.`
    : elevatedRisk
    ? "Valgus cue still outside green band."
    : "Within Movement Twin band.";

  if (verdict === "pass") {
    verdictReason = "Within Movement Twin band.";
  }

  if (viewQualityScore !== null && viewQualityScore < 0.45) {
    verdict = "retake";
    verdictReason = result.viewQuality?.fixInstructions ?? "Camera angle too low — retake from hip height.";
  }

  let bandUncertainty = 0;
  if (viewQualityScore !== null) {
    bandUncertainty += Number((1 - viewQualityScore).toFixed(3));
  } else {
    bandUncertainty += 0.4;
  }
  if (!result.deltaFromBaseline || Object.keys(result.deltaFromBaseline).length === 0) {
    bandUncertainty = Math.min(1, bandUncertainty + 0.3);
  }
  if (result.counterfactual?.nextRepVerify) {
    bandUncertainty = Math.min(1, bandUncertainty + 0.05);
  }
  bandUncertainty = Number(Math.min(1, bandUncertainty).toFixed(3));

  if (verdict !== "retake" && bandUncertainty >= 0.55) {
    verdict = "needs_review";
    verdictReason = "Band confidence low — capture 1–2 more reps to confirm.";
  }

  const microPlan = verdict === "fix" ? buildTargetedMicroPlan(result, bandSummary) : undefined;

  const summary: MovementProofSummary = {
    id: proofId,
    verdict,
    verdictReason,
    withinBand: verdict === "pass",
    band: bandSummary.length ? bandSummary : undefined,
    viewQuality: {
      score0to1: viewQualityScore,
      label: viewQualityLabel,
      fixInstructions: result.viewQuality?.fixInstructions ?? undefined,
      retryRecommended: result.viewQuality?.retryRecommended,
    },
    cue: result.cues?.[0] ?? null,
    metrics: {
      kneeValgusScore,
      trunkLeanOutsideBOS: result.metrics?.trunkLeanOutsideBOS ?? null,
      footPlantOutsideCOM: result.metrics?.footPlantOutsideCOM ?? null,
      asymmetryIndex0to100: result.asymmetryIndex0to100 ?? null,
    },
    baselineBand: result.deltaFromBaseline ?? null,
    uncertainty0to1: bandUncertainty,
    microPlan,
    completion: microPlan?.completion,
    fixAssigned: false,
    proofAt: new Date().toISOString(),
  };

  result.verdict = verdict;
  result.verdictReason = verdictReason;
  result.bandSummary = summary.band;
  result.microPlan = microPlan;
  result.uncertainty0to1 = bandUncertainty;
  result.proof = summary;

  const assessmentFields: MovementProofPersistencePayload["assessmentFields"] = {
    verdict,
    verdictReason,
    viewQuality: summary.viewQuality ? JSON.stringify(summary.viewQuality) : undefined,
    baselineBand: result.deltaFromBaseline ? JSON.stringify(result.deltaFromBaseline) : undefined,
    bandUncertainty0to1: bandUncertainty,
    microPlan: microPlan ? JSON.stringify(microPlan) : undefined,
  };

  const proofData: Prisma.MovementProofUncheckedCreateInput = {
    id: proofId,
    assessmentId: result.assessmentId,
    athleteId: result.athleteId,
    drillType: result.drillType,
    verdict,
    verdictReason,
    withinBand: summary.withinBand ?? undefined,
    bandDelta: summary.band ? JSON.stringify(summary.band) : undefined,
    viewQualityScore: viewQualityScore ?? undefined,
    viewQualityLabel,
    cue: summary.cue ?? undefined,
    metrics: summary.metrics ? JSON.stringify(summary.metrics) : "{}",
    baselineBand: result.deltaFromBaseline ? JSON.stringify(result.deltaFromBaseline) : undefined,
    uncertainty0to1: bandUncertainty,
    proofAt: new Date(summary.proofAt),
    microPlan: microPlan ? JSON.stringify(microPlan) : undefined,
    fixAssigned: false,
    microPlanCompleted: false,
    microPlanCompletedAt: null,
    microPlanRpe: null,
    microPlanPain: null,
  };

  return {
    summary,
    assessmentFields,
    proofData,
  };
};

const phaseScoreSchema = (
  _phase: string,
  includeRiskDriver = false,
  includeTimeToStable = false,
) => ({
  type: "object",
  properties: {
    quality_0_3: { type: "integer", minimum: 0, maximum: 3 },
    notes: { type: "string" },
    ...(includeRiskDriver ? { risk_driver: { type: "string" } } : {}),
    ...(includeTimeToStable ? { time_to_stable_ms: { type: "number" } } : {}),
  },
  required: ["quality_0_3"],
  additionalProperties: false,
});

const MOVEMENT_RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    riskRating: { type: "integer", minimum: 0, maximum: 3 },
    cues: {
      type: "array",
      items: { type: "string" },
      minItems: 1,
      maxItems: 3,
    },
    metrics: {
      type: "object",
      properties: {
        kneeValgusScore: { type: "integer", minimum: 0, maximum: 3 },
        trunkLeanOutsideBOS: { type: "boolean" },
        footPlantOutsideCOM: { type: "boolean" },
      },
      required: ["kneeValgusScore", "trunkLeanOutsideBOS", "footPlantOutsideCOM"],
    },
    overview: {
      type: "object",
      properties: {
        headline: { type: "string" },
        summary: { type: "string" },
        confidence: { type: "integer", minimum: 0, maximum: 100 },
      },
      required: ["headline", "summary"],
    },
    riskSignals: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        properties: {
          label: { type: "string" },
          severity: { type: "string", enum: ["low", "moderate", "high"] },
          evidence: { type: "string" },
        },
        required: ["label", "severity", "evidence"],
      },
    },
    coachingPlan: {
      type: "object",
      properties: {
        immediateCue: { type: "string" },
        practiceFocus: { type: "string" },
        monitoring: { type: "string" },
      },
      required: ["immediateCue", "practiceFocus", "monitoring"],
    },
    phase_scores: {
      type: "object",
      properties: {
        prep: phaseScoreSchema("prep"),
        takeoff: phaseScoreSchema("takeoff"),
        first_contact: phaseScoreSchema("first_contact", true),
        stabilization: phaseScoreSchema("stabilization", false, true),
      },
      additionalProperties: false,
    },
    time_to_stable_ms: { type: "number" },
    ground_contact_time_ms: { type: "number" },
    peak_risk_phase: { type: "string" },
    view_quality: {
      type: "object",
      properties: {
        score_0_1: { type: "number", minimum: 0, maximum: 1 },
        fix_instructions: { type: "string" },
        retry_recommended: { type: "boolean" },
      },
      required: ["score_0_1"],
      additionalProperties: false,
    },
    counterfactual: {
      type: "object",
      properties: {
        tweak: { type: "string" },
        predicted_risk_drop: { type: "number" },
        next_rep_verify: { type: "boolean" },
        summary: { type: "string" },
      },
      required: ["tweak", "predicted_risk_drop", "next_rep_verify"],
      additionalProperties: false,
    },
    asymmetry_index_0_100: { type: "number", minimum: 0, maximum: 100 },
    delta_from_baseline: {
      type: "object",
      additionalProperties: { type: "number" },
    },
    overlays: {
      type: "array",
      items: {
        type: "object",
        properties: {
          overlay_type: { type: "string" },
          label: { type: "string" },
          description: { type: "string" },
          instructions: { type: "string" },
          severity: { type: "string", enum: ["low", "moderate", "high"] },
          band_status: { type: "string", enum: ["inside", "outside"] },
          metrics: {
            type: "object",
            additionalProperties: {
              type: ["number", "null"],
            },
          },
          visualization: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: true,
            },
          },
          before_image_url: { type: "string" },
          after_image_url: { type: "string" },
          comparison_label: { type: "string" },
        },
        required: ["overlay_type"],
        additionalProperties: false,
      },
    },
  },
  required: [
    "riskRating",
    "cues",
    "metrics",
    "overview",
    "riskSignals",
    "coachingPlan",
    "phase_scores",
    "time_to_stable_ms",
    "ground_contact_time_ms",
    "peak_risk_phase",
    "view_quality",
    "counterfactual",
    "asymmetry_index_0_100",
    "delta_from_baseline",
    "overlays",
  ],
  additionalProperties: false,
} as const;

const MOVEMENT_SYSTEM_PROMPT = `
You are an elite sports biomechanist helping field coaches reduce non-contact ACL risk.
Use the supplied context and 3–5 frames to analyse the entire action and return a JSON object that
includes:
- overview: headline + summary + confidence 0-100.
- riskSignals: label, severity (low/moderate/high), evidence text.
- phase_scores: evaluate prep, takeoff, first_contact, stabilization (quality_0_3, notes, risk driver when relevant) and report peak_risk_phase, ground_contact_time_ms, time_to_stable_ms.
- coaching cues + coachingPlan (immediate cue, practice focus, monitoring).
- view_quality (score_0_1, fix_instructions, retry_recommended when score < 0.6).
- counterfactual tweak with predicted risk drop and whether to verify next rep.
- asymmetry_index_0_100 and delta_from_baseline (numeric changes vs athlete’s best recent rep).
- overlays array describing any visual guides to render (overlay_type, description, instructions).
Only use information supported by the frames and context; make view quality suggestions if framing is poor.
`;

const MOVEMENT_USER_PROMPT = (input: MovementAssessmentInput) => {
  const { athleteId, drillType, context, frames } = input;

  const contextLines = [
    `athlete_id: ${athleteId}`,
    `drill_type: ${drillType}`,
    context?.surface ? `surface: ${context.surface}` : null,
    context?.environment ? `environment: ${context.environment}` : null,
    context?.temperatureF ? `temperature_f: ${context.temperatureF}` : null,
    context?.humidityPct ? `humidity_pct: ${context.humidityPct}` : null,
    context?.athleteProfile?.sex ? `sex: ${context.athleteProfile.sex}` : null,
    context?.athleteProfile?.position ? `position: ${context.athleteProfile.position}` : null,
    context?.notes ? `notes: ${context.notes}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const frameLines = frames
    .map(
      (frame, idx) =>
        `frame_${idx + 1}: { id: ${frame.id}, captured_at: ${frame.capturedAt}, label: ${
          frame.label ?? "n/a"
        }, url: ${frame.url} }`,
    )
    .join("\n");

  return `
Evaluate lower-extremity landing risk from the supplied frames.
Rate frontal plane knee collapse (valgus) 0–3 where 3 is severe.
Mark trunk lean outside base of support true/false.
Mark foot plant outside centre of mass true/false.
Segment the action into phases (prep, takeoff, first_contact, stabilization) and fill the phase_scores object.
Estimate time_to_stable_ms, ground_contact_time_ms, and identify peak_risk_phase.
Evaluate camera quality (score_0_1). If low, provide fix instructions and set retry_recommended true.
Provide 1–3 short coaching cues, a single counterfactual tweak with predicted_risk_drop, and monitoring guidance.
Compare to the athlete baseline when possible to compute asymmetry_index_0_100 and delta_from_baseline metrics.
List overlay instructions so the app can draw visual cues (hip-knee-ankle line, target line, etc.).

Context:
${contextLines}

Frames:
${frameLines}
`.trim();
};

const buildMockMovementAssessment = (input: MovementAssessmentInput): MovementAssessmentResult => {
  const generatedAt = new Date().toISOString();
  const riskRating = input.drillType === "unplanned_cut" ? 2 : 1;

  const cues = [
    input.drillType === "drop_jump" ? "Land softly with knees tracking toes." : "Keep hips back and chest tall.",
    "Stabilize knee over ankle on landing.",
  ];

  const overview = {
    headline: riskRating >= 2 ? "Moderate valgus risk detected" : "Mechanics trending safe",
    summary:
      riskRating >= 2
        ? "Plant limb shows moderate valgus drift on deceleration. Reinforce hip hinge and softer knee flexion."
        : "Landing control is improving with only light valgus. Keep coaching soft hinge and stacked joints.",
    confidence: 78,
  };

  const riskSignals: MovementAssessmentResult["riskSignals"] = [
    {
      label: riskRating >= 2 ? "Knee valgus drift" : "Controlled valgus",
      severity: riskRating >= 2 ? "moderate" : "low",
      evidence:
        riskRating >= 2
          ? "Frame 2 shows knee tracking inside ankle during plant."
          : "Knee stays mostly stacked during landing sequence.",
    },
    {
      label: "Foot placement",
      severity: riskRating >= 2 ? "moderate" : "low",
      evidence:
        riskRating >= 2
          ? "Lead foot lands wide of COM increasing hip torque."
          : "Foot strike remains near COM, reducing torque.",
    },
  ];

  const coachingPlan = {
    immediateCue: riskRating >= 2 ? "Drive knee over middle toe on plant" : "Keep soft knees and stacked ankle-knee",
    practiceFocus: riskRating >= 2 ? "Eccentric single-leg squat with mirror feedback" : "Continue pogo hops focusing on hip hinge",
    monitoring: riskRating >= 2 ? "Re-film decel drills after next session" : "Check landing mechanics after fatigue sessions",
  };

  const phaseScores: MovementAssessmentResult["phaseScores"] = {
    prep: { quality0to3: 2, notes: "Solid hip hinge." },
    takeoff: { quality0to3: 2, notes: "Balanced drive." },
    firstContact: {
      quality0to3: riskRating >= 2 ? 1 : 2,
      riskDriver: riskRating >= 2 ? "knee_valgus" : undefined,
      notes: "Plant knee drifts inside mid-foot.",
    },
    stabilization: {
      quality0to3: riskRating >= 2 ? 1 : 2,
      timeToStableMs: riskRating >= 2 ? 420 : 290,
      notes: "Needs faster hip engagement to lock position.",
    },
  };

  const timeToStableMs = phaseScores.stabilization?.timeToStableMs ?? null;
  const groundContactTimeMs = riskRating >= 2 ? 210 : 180;
  const peakRiskPhase = riskRating >= 2 ? "first_contact" : "stabilization";

  const viewQuality: ViewQualityAssessment = {
    score0to1: 0.72,
    fixInstructions: "Lower camera ~20cm and slide left to capture full foot strike",
    retryRecommended: false,
  };

  const counterfactual: CounterfactualPlan = {
    tweak: riskRating >= 2 ? "shorten_last_step_10pct" : "deeper_prep_bend",
    predictedRiskDrop: riskRating >= 2 ? 0.28 : 0.12,
    nextRepVerify: true,
    summary: riskRating >= 2 ? "Shorter last step reduces torque and valgus risk." : "Maintain deeper prep to lock in control.",
  };

  const asymmetryIndex0to100 = 23;
  const deltaFromBaseline = { valgus_angle_deg: riskRating >= 2 ? 6.4 : 1.5, time_to_stable_ms: riskRating >= 2 ? 110 : 15 };

  const beforeImageUrl = input.frames[0]?.url ?? null;
  const afterImageUrl =
    input.frames.length > 1 ? input.frames[input.frames.length - 1]?.url ?? beforeImageUrl : beforeImageUrl;

  const overlays: OverlayInstruction[] = [
    {
      overlayType: "hip_knee_ankle_line",
      label: "Knee angle vs baseline",
      description: "Highlight alignment compared with the athlete’s Movement Twin band.",
      instructions: "Draw red wedge when knee crosses inside green toe line.",
      severity: riskRating >= 2 ? "moderate" : "low",
      bandStatus: riskRating >= 2 ? "outside" : "inside",
      metrics: {
        knee_angle_deg: riskRating >= 2 ? 18 : 9,
        baseline_angle_deg: riskRating >= 2 ? 12 : 8,
      },
      visualization: [
        {
          type: "line",
          color: "#ff5f6d",
          points: [
            { x: 0.52, y: 0.12 },
            { x: 0.47, y: 0.68 },
          ],
        },
        {
          type: "line",
          color: "#49f2c2",
          points: [
            { x: 0.55, y: 0.18 },
            { x: 0.53, y: 0.65 },
          ],
        },
      ],
      beforeImageUrl,
      afterImageUrl,
      comparisonLabel: "Baseline vs latest rep",
    },
    {
      overlayType: "com_projection",
      label: "COM over base",
      description: "Visualise centre-of-mass projection relative to base of support.",
      instructions: "Show COM dot and projected base to cue stacked landing.",
      severity: riskRating >= 2 ? "moderate" : "low",
      bandStatus: riskRating >= 2 ? "outside" : "inside",
      metrics: {
        com_offset_cm: riskRating >= 2 ? 8 : 3,
        target_offset_cm: 2,
      },
      visualization: [
        {
          type: "marker",
          color: "#ffd166",
          position: { x: 0.5, y: 0.38 },
        },
        {
          type: "polygon",
          color: "rgba(73,242,194,0.35)",
          points: [
            { x: 0.42, y: 0.92 },
            { x: 0.58, y: 0.92 },
            { x: 0.64, y: 1 },
            { x: 0.36, y: 1 },
          ],
        },
      ],
      beforeImageUrl,
      afterImageUrl,
      comparisonLabel: "Green band footprint",
    },
  ];

  const rawModelOutput = {
    source: "mock",
    overview,
    riskSignals,
    coachingPlan,
    phase_scores: {
      prep: { quality_0_3: phaseScores.prep?.quality0to3, notes: phaseScores.prep?.notes },
      takeoff: { quality_0_3: phaseScores.takeoff?.quality0to3, notes: phaseScores.takeoff?.notes },
      first_contact: {
        quality_0_3: phaseScores.firstContact?.quality0to3,
        notes: phaseScores.firstContact?.notes,
        risk_driver: phaseScores.firstContact?.riskDriver,
      },
      stabilization: {
        quality_0_3: phaseScores.stabilization?.quality0to3,
        notes: phaseScores.stabilization?.notes,
        time_to_stable_ms: phaseScores.stabilization?.timeToStableMs,
      },
    },
    time_to_stable_ms: timeToStableMs,
    ground_contact_time_ms: groundContactTimeMs,
    peak_risk_phase: peakRiskPhase,
    view_quality: {
      score_0_1: viewQuality.score0to1,
      fix_instructions: viewQuality.fixInstructions,
      retry_recommended: viewQuality.retryRecommended,
    },
    counterfactual: {
      tweak: counterfactual.tweak,
      predicted_risk_drop: counterfactual.predictedRiskDrop,
      next_rep_verify: counterfactual.nextRepVerify,
      summary: counterfactual.summary,
    },
    asymmetry_index_0_100: asymmetryIndex0to100,
    delta_from_baseline: deltaFromBaseline,
    overlays: overlays.map((overlay) => ({
      overlay_type: overlay.overlayType,
      label: overlay.label,
      description: overlay.description,
      instructions: overlay.instructions,
      severity: overlay.severity,
      band_status: overlay.bandStatus,
      metrics: overlay.metrics,
      visualization: overlay.visualization,
      before_image_url: overlay.beforeImageUrl,
      after_image_url: overlay.afterImageUrl,
      comparison_label: overlay.comparisonLabel,
    })),
  };

  return {
    assessmentId: randomUUID(),
    athleteId: input.athleteId,
    drillType: input.drillType,
    riskRating,
    cues,
    metrics: {
      kneeValgusScore: riskRating,
      trunkLeanOutsideBOS: input.drillType !== "drop_jump",
      footPlantOutsideCOM: input.drillType !== "drop_jump",
    },
    overview,
    riskSignals,
    coachingPlan,
    phaseScores,
    timeToStableMs: timeToStableMs ?? undefined,
    groundContactTimeMs,
    peakRiskPhase,
    viewQuality,
    counterfactual,
    asymmetryIndex0to100,
    deltaFromBaseline,
    overlays,
    frames: input.frames,
    context: input.context,
    generatedAt,
    rawModelOutput,
  };
};

const extractJson = (content: any): any => {
  if (!content) {
    return null;
  }

  if (typeof content === "string") {
    try {
      return JSON.parse(content);
    } catch {
      return null;
    }
  }

  if (Array.isArray(content)) {
    for (const item of content) {
      const parsed = extractJson(item);
      if (parsed) {
        return parsed;
      }
    }
  }

  if (typeof content === "object") {
    if ("text" in content && typeof content.text === "string") {
      return extractJson(content.text);
    }
    if ("content" in content) {
      return extractJson(content.content);
    }
  }

  return null;
};

const mapPhaseScore = (phase: any | undefined): PhaseScore | undefined => {
  if (!phase || typeof phase !== "object") return undefined;
  return {
    quality0to3: phase.quality_0_3 ?? phase.quality ?? null,
    notes: phase.notes ?? null,
    riskDriver: phase.risk_driver ?? phase.riskDriver ?? null,
    timeToStableMs: phase.time_to_stable_ms ?? phase.timeToStableMs ?? null,
  };
};

const parsePhaseScores = (raw: any | undefined): MovementAssessmentResult["phaseScores"] | undefined => {
  if (!raw || typeof raw !== "object") return undefined;
  return {
    prep: mapPhaseScore(raw.prep),
    takeoff: mapPhaseScore(raw.takeoff),
    firstContact: mapPhaseScore(raw.first_contact ?? raw.firstContact),
    stabilization: mapPhaseScore(raw.stabilization),
  };
};

const ensureSeverity = (value: string | undefined): "low" | "moderate" | "high" => {
  if (value === "low" || value === "moderate" || value === "high") return value;
  return "moderate";
};

const parseRiskSignals = (raw: any[] | undefined): MovementAssessmentResult["riskSignals"] | undefined => {
  if (!Array.isArray(raw)) return undefined;
  return raw
    .map((signal) => ({
      label: signal?.label ?? "",
      severity: ensureSeverity(signal?.severity),
      evidence: signal?.evidence ?? "",
    }))
    .filter((signal) => !!signal.label);
};

const parseViewQuality = (raw: any | undefined): ViewQualityAssessment | undefined => {
  if (!raw || typeof raw !== "object") return undefined;
  if (typeof raw.score_0_1 !== "number") return undefined;
  return {
    score0to1: raw.score_0_1,
    fixInstructions: raw.fix_instructions ?? raw.fixInstructions ?? null,
    retryRecommended: raw.retry_recommended ?? raw.retryRecommended ?? raw.score_0_1 < 0.6,
  };
};

const parseCounterfactual = (raw: any | undefined): CounterfactualPlan | undefined => {
  if (!raw || typeof raw !== "object") return undefined;
  if (!raw.tweak) return undefined;
  return {
    tweak: raw.tweak,
    predictedRiskDrop: typeof raw.predicted_risk_drop === "number" ? raw.predicted_risk_drop : 0,
    nextRepVerify: Boolean(raw.next_rep_verify ?? raw.nextRepVerify),
    summary: raw.summary ?? undefined,
  };
};

const parseOverlayMetricsFromRaw = (value: unknown): Record<string, number | null> | undefined => {
  if (!value || typeof value !== "object") return undefined;
  const entries: Array<[string, number | null]> = [];
  for (const [key, rawValue] of Object.entries(value as Record<string, unknown>)) {
    if (rawValue === null || rawValue === undefined) {
      entries.push([key, null]);
      continue;
    }
    const num = Number(rawValue);
    if (Number.isFinite(num)) {
      entries.push([key, num as number]);
    }
  }
  if (!entries.length) return undefined;
  return Object.fromEntries(entries);
};

const parseOverlayVisualizationFromRaw = (
  value: unknown,
): Array<Record<string, unknown>> | undefined => {
  if (!value) return undefined;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.filter((item) => item && typeof item === "object") as Array<Record<string, unknown>>;
      }
      if (parsed && typeof parsed === "object") {
        return [parsed as Record<string, unknown>];
      }
      return undefined;
    } catch {
      return undefined;
    }
  }
  if (Array.isArray(value)) {
    return value.filter((item) => item && typeof item === "object") as Array<Record<string, unknown>>;
  }
  if (typeof value === "object") {
    return [value as Record<string, unknown>];
  }
  return undefined;
};

const parseOverlays = (raw: any[] | undefined): OverlayInstruction[] | undefined => {
  if (!Array.isArray(raw)) return undefined;
  const overlays = raw
    .map((overlay) => {
      const overlayType = overlay?.overlay_type ?? overlay?.overlayType ?? "";
      if (!overlayType) return null;
      const metrics = parseOverlayMetricsFromRaw(
        overlay?.metrics ?? overlay?.metrics_json ?? overlay?.metricsJson,
      );
      const visualization = parseOverlayVisualizationFromRaw(
        overlay?.visualization ?? overlay?.visualization_json ?? overlay?.visualizationJson,
      );
      const bandStatusRaw = overlay?.band_status ?? overlay?.bandStatus;
      const bandStatus =
        bandStatusRaw === "inside" || bandStatusRaw === "outside" ? bandStatusRaw : undefined;

      return {
        overlayType,
        label: overlay?.label ?? overlay?.overlay_label ?? undefined,
        description: overlay?.description ?? undefined,
        instructions: overlay?.instructions ?? undefined,
        severity: overlay?.severity ? ensureSeverity(overlay.severity) : undefined,
        bandStatus,
        metrics,
        visualization,
        beforeImageUrl: overlay?.before_image_url ?? overlay?.beforeImageUrl ?? null,
        afterImageUrl: overlay?.after_image_url ?? overlay?.afterImageUrl ?? null,
        comparisonLabel: overlay?.comparison_label ?? overlay?.comparisonLabel ?? null,
      } as OverlayInstruction;
    })
    .filter((overlay): overlay is OverlayInstruction => Boolean(overlay));

  return overlays.length ? overlays : undefined;
};

export const createMovementAssessment = async (
  input: MovementAssessmentInput,
): Promise<MovementAssessmentResult> => {
  const client = getOpenAIClient();

  await ensureAthlete(
    input.athleteId,
    input.context?.athleteProfile?.name ?? input.context?.athleteProfile?.position ?? input.athleteId,
  );

  if (!client || env.USE_OPENAI_MOCKS) {
    const result = buildMockMovementAssessment(input);
    const proofPayload = attachProofToResult(result);
    await persistMovementAssessment(input, result, proofPayload);
    return result;
  }

  try {
    const imageContents = await Promise.all(
      input.frames.map((frame) => buildInputImageContent(frame.url)),
    );

    const response = await (client.responses as any).create({
      model: env.NODE_ENV === "production" ? "gpt-4.1" : "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content: MOVEMENT_SYSTEM_PROMPT.trim(),
        },
        {
          role: "user",
          content: [
            { type: "input_text", text: MOVEMENT_USER_PROMPT(input) },
            ...imageContents.filter(Boolean),
          ],
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "MovementAssessment",
          schema: MOVEMENT_RESPONSE_SCHEMA,
          strict: false,
        },
      },
    });

    const parsed =
      (response.output as any)?.[0]?.content?.find((item: any) => item?.parsed)?.parsed ??
      extractJson(response.output ?? response);

    if (!parsed) {
      throw new Error("Unable to parse OpenAI response for movement assessment");
    }

    const phaseScores = parsePhaseScores(parsed.phase_scores);
    const riskSignals = parseRiskSignals(parsed.riskSignals ?? parsed.risk_signals);
    const viewQuality = parseViewQuality(parsed.view_quality ?? parsed.viewQuality);
    const counterfactual = parseCounterfactual(parsed.counterfactual);
    const overlays = parseOverlays(parsed.overlays);
    const timeToStableMs =
      parsed.time_to_stable_ms ?? parsed.phase_scores?.stabilization?.time_to_stable_ms ?? null;
    const groundContactTimeMs = parsed.ground_contact_time_ms ?? null;
    const peakRiskPhase = parsed.peak_risk_phase ?? null;
    const asymmetryIndex0to100 = parsed.asymmetry_index_0_100 ?? null;
    const deltaFromBaseline = parsed.delta_from_baseline ?? null;

    const result: MovementAssessmentResult = {
      assessmentId: randomUUID(),
      athleteId: input.athleteId,
      drillType: input.drillType,
      riskRating: parsed.riskRating,
      cues: parsed.cues,
      metrics: parsed.metrics,
      overview: parsed.overview,
      riskSignals,
      coachingPlan: parsed.coachingPlan,
      phaseScores,
      timeToStableMs: timeToStableMs ?? undefined,
      groundContactTimeMs: groundContactTimeMs ?? undefined,
      peakRiskPhase: peakRiskPhase ?? undefined,
      viewQuality,
      counterfactual,
      asymmetryIndex0to100: asymmetryIndex0to100 ?? undefined,
      deltaFromBaseline,
      overlays,
      frames: input.frames,
      context: input.context,
      generatedAt: new Date().toISOString(),
      rawModelOutput: parsed,
    };

    const proofPayload = attachProofToResult(result);
    await persistMovementAssessment(input, result, proofPayload);

    return result;
  } catch (error) {
    console.error("OpenAI movement assessment failed", error);
    const fallback = buildMockMovementAssessment(input);
    const proofPayload = attachProofToResult(fallback);
    await persistMovementAssessment(input, fallback, proofPayload);
    return fallback;
  }
};

const persistMovementAssessment = async (
  input: MovementAssessmentInput,
  result: MovementAssessmentResult,
  proofPayload?: MovementProofPersistencePayload,
) => {
  const contextPayload = {
    ...input.context,
  };

  const framesPayload = input.frames.map((frame, index) => ({
    id: frame.id,
    snapshotUrl: frame.url,
    label: frame.label,
    capturedAt: frame.capturedAt,
    frameIndex: index,
  }));

  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    await tx.movementAssessment.create({
      data: {
        id: result.assessmentId,
        athleteId: input.athleteId,
        sessionId: input.sessionId,
        drillType: input.drillType,
        riskRating: result.riskRating,
        cues: JSON.stringify(result.cues),
        metrics: JSON.stringify(result.metrics),
        context: JSON.stringify(contextPayload),
        rawModelOutput: JSON.stringify(result.rawModelOutput ?? {}),
        verdict: proofPayload?.assessmentFields.verdict ?? result.verdict ?? null,
        verdictReason: proofPayload?.assessmentFields.verdictReason ?? result.verdictReason ?? null,
        viewQuality:
          proofPayload?.assessmentFields.viewQuality ??
          (result.viewQuality
            ? JSON.stringify({
                score0to1: result.viewQuality.score0to1,
                fixInstructions: result.viewQuality.fixInstructions ?? null,
                retryRecommended: result.viewQuality.retryRecommended ?? false,
              })
            : undefined),
        baselineBand:
          proofPayload?.assessmentFields.baselineBand ??
          (result.deltaFromBaseline ? JSON.stringify(result.deltaFromBaseline) : undefined),
        bandUncertainty0to1: proofPayload?.assessmentFields.bandUncertainty0to1 ?? result.uncertainty0to1 ?? undefined,
        microPlan:
          proofPayload?.assessmentFields.microPlan ??
          (result.microPlan ? JSON.stringify(result.microPlan) : undefined),
        frames: {
          createMany: {
            data: framesPayload,
          },
        },
      },
    });

    const defaultBeforeImage = input.frames[0]?.url ?? null;
    const defaultAfterImage =
      input.frames.length > 1
        ? input.frames[input.frames.length - 1]?.url ?? defaultBeforeImage
        : defaultBeforeImage;

    const overlayRecords = (result.overlays ?? []).map((overlay) => ({
      assessmentId: result.assessmentId,
      overlayType: overlay.overlayType,
      label: overlay.label ?? null,
      description: overlay.description ?? null,
      instructions: overlay.instructions ?? null,
      severity: overlay.severity ?? null,
      bandStatus: overlay.bandStatus ?? null,
      metrics: overlay.metrics ? (overlay.metrics as Prisma.InputJsonValue) : undefined,
      visualization: overlay.visualization ? (overlay.visualization as Prisma.InputJsonValue) : undefined,
      beforeImageUrl: overlay.beforeImageUrl ?? defaultBeforeImage,
      afterImageUrl: overlay.afterImageUrl ?? defaultAfterImage ?? overlay.beforeImageUrl ?? defaultBeforeImage,
      comparisonLabel: overlay.comparisonLabel ?? null,
    }));

    if (overlayRecords.length) {
      await tx.movementOverlay.createMany({
        data: overlayRecords,
      });
    }

    if (proofPayload) {
      await tx.movementProof.create({
        data: proofPayload.proofData,
      });
    }
  });
};

export const listMovementAssessments = (athleteId: string, limit = 20) =>
  prisma.movementAssessment.findMany({
    where: { athleteId },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      frames: {
        orderBy: { frameIndex: "asc" },
      },
      recommendations: true,
      overlays: {
        orderBy: { createdAt: "asc" },
      },
      proof: true,
    },
  });

export const getMovementAssessment = (assessmentId: string) =>
  prisma.movementAssessment.findUnique({
    where: { id: assessmentId },
    include: {
      frames: {
        orderBy: { frameIndex: "asc" },
      },
      recommendations: true,
      overlays: {
        orderBy: { createdAt: "asc" },
      },
      proof: true,
      athlete: true,
    },
  });

export const updateMovementProofAssignment = async (
  assessmentId: string,
  fixAssigned: boolean,
): Promise<MovementProofWithAssessment> => {
  return prisma.$transaction(async (tx) => {
    const existing = await tx.movementProof.findUnique({ where: { assessmentId } });
    if (!existing) {
      throw new Error("Movement proof not found for assessment");
    }

    const microPlanObj = parseJsonField<MovementMicroPlan>(existing.microPlan) ?? undefined;
    if (microPlanObj) {
      microPlanObj.quickAssignAvailable = !fixAssigned;
    }

    const updated = await tx.movementProof.update({
      where: { assessmentId },
      data: {
        fixAssigned,
        ...(microPlanObj ? { microPlan: JSON.stringify(microPlanObj) } : {}),
      },
      include: {
        assessment: true,
      },
    }) as MovementProofWithAssessment;

    if (microPlanObj) {
      await tx.movementAssessment.update({
        where: { id: assessmentId },
        data: { microPlan: JSON.stringify(microPlanObj) },
      });
    }

    return updated;
  });
};

export const updateMovementProofCompletion = async (
  assessmentId: string,
  payload: { completed: boolean; rpe?: number; pain?: number },
): Promise<MovementProofWithAssessment> => {
  return prisma.$transaction(async (tx) => {
    const existing = await tx.movementProof.findUnique({ where: { assessmentId } });
    if (!existing) {
      throw new Error("Movement proof not found for assessment");
    }

    const microPlanObj = parseJsonField<MovementMicroPlan>(existing.microPlan) ?? undefined;
    if (microPlanObj) {
      microPlanObj.completion = {
        completed: payload.completed,
        completedAt: payload.completed ? new Date().toISOString() : undefined,
        rpe: payload.completed ? payload.rpe ?? null : null,
        pain: payload.completed ? payload.pain ?? null : null,
      };
      if (payload.completed) {
        microPlanObj.quickAssignAvailable = false;
      }
    }

    const updated = await tx.movementProof.update({
      where: { assessmentId },
      data: {
        microPlanCompleted: payload.completed,
        microPlanCompletedAt: payload.completed ? new Date() : null,
        microPlanRpe: payload.completed ? payload.rpe ?? null : null,
        microPlanPain: payload.completed ? payload.pain ?? null : null,
        ...(microPlanObj ? { microPlan: JSON.stringify(microPlanObj) } : {}),
      },
      include: {
        assessment: true,
      },
    }) as MovementProofWithAssessment;

    if (microPlanObj) {
      await tx.movementAssessment.update({
        where: { id: assessmentId },
        data: { microPlan: JSON.stringify(microPlanObj) },
      });
    }

    return updated;
  });
};
