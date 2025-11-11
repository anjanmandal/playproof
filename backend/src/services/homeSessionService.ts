import { prisma } from "../db/prisma";
import type { HomeSessionPlan, WearableInsight, WearableInsightInput } from "../types/homeSession";
import { getOpenAIClient } from "../config/openaiClient";
import { buildInputImageContents } from "../utils/openaiMedia";
import { env } from "../config/env";

const BASE_BLOCKS = [
  {
    key: "capacity",
    title: "Capacity reset",
    focus: "Breathing + mobility to unlock range",
    baseSets: 2,
    baseReps: 6,
    baseMinutes: 5,
    cues: "Nasal breathing, slow tempo",
  },
  {
    key: "control",
    title: "Control block",
    focus: "Single-leg tempo work",
    baseSets: 3,
    baseReps: 5,
    baseMinutes: 6,
    cues: "Knees track toes, hips back",
  },
  {
    key: "strength",
    title: "Strength block",
    focus: "Split-squat + RDL pairing",
    baseSets: 3,
    baseReps: 6,
    baseMinutes: 5,
    cues: "Drive through mid-foot, tall spine",
  },
  {
    key: "landing",
    title: "Landing / cut prep",
    focus: "Drop-jump stick + plant-cut",
    baseSets: 3,
    baseReps: 4,
    baseMinutes: 4,
    cues: "Soft landings, eyes up, reset",
  },
];

type SessionBlock = (typeof BASE_BLOCKS)[number] & {
  minutes: number;
  sets: number;
  reps: number;
  intensity: string;
};

const FORM_MULTIPLIER = (grade: string) => {
  switch (grade) {
    case "A":
      return 1.1;
    case "C":
      return 0.85;
    default:
      return 1;
  }
};

type BuildInput = {
  athleteId: string;
  minutes: number;
  soreness: number;
};

const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
const endOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);

export const buildHomeSessionPlan = async ({ athleteId, minutes, soreness }: BuildInput): Promise<HomeSessionPlan> => {
  const latestAssessment = await prisma.rehabAssessment.findFirst({
    where: { athleteId },
    orderBy: { createdAt: "desc" },
  });
  const latestRisk = await prisma.riskSnapshot.findFirst({
    where: { athleteId },
    orderBy: [{ recordedFor: "desc" }, { createdAt: "desc" }],
  });

  const formGrade = (latestAssessment?.formGrade ?? "B") as "A" | "B" | "C";
  const formCue = latestAssessment?.formCue ?? "Dial in soft landings and breathe between reps.";
  const gradeMultiplier = FORM_MULTIPLIER(formGrade);
  const sorenessMultiplier = Math.max(0.6, 1 - soreness * 0.06);
  const minutesMultiplier = minutes / 18;

  const blocks: SessionBlock[] = BASE_BLOCKS.map((block) => {
    const scaledMinutes = Math.max(
      3,
      Math.round(block.baseMinutes * gradeMultiplier * sorenessMultiplier * minutesMultiplier),
    );
    const scaledSets = Math.max(
      1,
      Math.round(block.baseSets * gradeMultiplier * sorenessMultiplier),
    );
    const scaledReps = Math.max(3, Math.round(block.baseReps * sorenessMultiplier));
    const intensity = formGrade === "A" ? "Progression" : formGrade === "C" ? "Softened" : "Standard";
    return {
      ...block,
      minutes: scaledMinutes,
      sets: scaledSets,
      reps: scaledReps,
      intensity,
    };
  });

  const lastAssessmentAt = latestAssessment?.createdAt?.toISOString?.() ?? null;

  const planSoftened = soreness >= 6 || formGrade === "C";
  const now = new Date();
  const todayStart = startOfDay(now);
  const todayEnd = endOfDay(now);
  const proofs = await prisma.homeSessionProof.findMany({
    where: {
      athleteId,
      sessionDate: {
        gte: todayStart,
        lt: todayEnd,
      },
    },
  });
  const proofsMap = proofs.reduce<Record<string, { clipUrl: string; capturedAt: string }>>((acc, proof) => {
    acc[proof.blockKey] = {
      clipUrl: proof.clipUrl,
      capturedAt: proof.createdAt.toISOString(),
    };
    return acc;
  }, {});

  const insights = await generateHomeSessionInsights({
    athleteId,
    formGrade,
    formCue,
    blocks,
    proofs,
  });

  return {
    athleteId,
    blocks,
    context: {
      formGrade,
      formCue,
      limbSymmetryScore: latestAssessment?.limbSymmetryScore ?? null,
      lastAssessmentAt,
      planSoftened,
      sorenessSource: soreness,
      sorenessAuto: latestRisk?.sorenessLevel ?? null,
    },
    completion: {
      targetMinutes: blocks.reduce((sum, block) => sum + block.minutes, 0),
      rescueAvailable: minutes > 10,
    },
    verification: {
      metricsOnly: true,
      confidence: latestAssessment ? 0.8 : 0.72,
    },
    streak: {
      days: 7,
    },
    proofs: proofsMap,
    insights: insights ?? undefined,
  };
};

type ProofInput = {
  athleteId: string;
  blockKey: string;
  clipUrl: string;
  minutes?: number;
};

export const recordHomeSessionProof = async ({ athleteId, blockKey, clipUrl, minutes }: ProofInput) => {
  const today = startOfDay(new Date());
  return prisma.homeSessionProof.upsert({
    where: {
      athleteId_blockKey_sessionDate: {
        athleteId,
        blockKey,
        sessionDate: today,
      },
    },
    create: {
      athleteId,
      blockKey,
      clipUrl,
      sessionDate: today,
      minutes,
      metadata: {},
    },
    update: {
      clipUrl,
      minutes,
      sessionDate: today,
    },
  });
};

type InsightInput = {
  athleteId: string;
  formGrade: "A" | "B" | "C";
  formCue: string;
  blocks: SessionBlock[];
  proofs: Awaited<ReturnType<typeof prisma.homeSessionProof.findMany>>;
};

const generateHomeSessionInsights = async (input: InsightInput) => {
  const client = getOpenAIClient();
  if (!client || input.proofs.length === 0) return null;
  try {
    const latestProof = input.proofs[input.proofs.length - 1]!;
    const imageParts = await buildInputImageContents([latestProof.clipUrl]);
    const response = await (client.responses as any).create({
      model: "gpt-4o-mini",
      input: [
        { role: "system", content: [{ type: "input_text", text: "You are a biomechanics coach. Summarize athlete cues and focus areas from the provided proof clip + plan metadata." }] },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: JSON.stringify({
                formGrade: input.formGrade,
                formCue: input.formCue,
                planBlocks: input.blocks.map((block) => ({
                  title: block.title,
                  sets: block.sets,
                  reps: block.reps,
                  minutes: block.minutes,
                  intensity: block.intensity,
                })),
              }),
            },
            ...imageParts,
          ],
        },
      ],
      text: { format: { type: "text" } },
    });
    const summary = response.output?.[0]?.content?.[0]?.text ?? "Focus on steady foot plants and hips-back decel.";
    return { summary, timestamp: new Date().toISOString() };
  } catch (error) {
    console.warn("Failed to generate home session insights", error);
    return null;
  }
};

const WEARABLE_INSIGHT_SCHEMA = {
  type: "object",
  properties: {
    summary: { type: "string" },
    cues: { type: "array", items: { type: "string" } },
    status_chip: { type: "string" },
    confidence: { type: "number" },
    watchouts: { type: "array", items: { type: "string" } },
  },
  required: ["summary", "cues", "status_chip", "confidence"],
  additionalProperties: false,
} as const;

const buildMockWearableInsight = (input: WearableInsightInput): WearableInsight => {
  const connected = input.devices.filter((device) => device.streaming).length;
  const { metrics } = input;
  const cues = [] as string[];
  if (metrics.valgus > 0.65) cues.push("Soften landings; drive knees over 2nd toe");
  if (metrics.decel > 4) cues.push("Add extra decel reps before cutting blocks");
  if (metrics.asymmetry > 0.3) cues.push("Mirror drills on the quieter side to rebalance load");
  if (cues.length === 0) cues.push("Great mechanics—lock in hip/ankle stiffness and stay smooth.");
  return {
    summary: `Streaming from ${connected || input.devices.length} wearables. PlayerLoad ${Math.round(metrics.playerLoad)} and cut density ${Math.round(metrics.cutDensity)}/min look ${metrics.cutDensity > 18 ? "high" : "steady"}.`,
    cues,
    statusChip:
      metrics.trust === "A"
        ? "IMU+Insole verified"
        : metrics.trust === "B"
        ? "Medium trust—spot-check lighting"
        : "Low trust—retry calibration",
    confidence: metrics.trust === "A" ? 0.86 : metrics.trust === "B" ? 0.72 : 0.51,
    watchouts:
      metrics.impact > 9
        ? ["Landing impact creeping up; consider swapping in landing resets."]
        : undefined,
    generatedAt: new Date().toISOString(),
  };
};

export const generateWearableInsight = async (input: WearableInsightInput): Promise<WearableInsight> => {
  const baseline = buildMockWearableInsight(input);
  const client = getOpenAIClient();
  if (!client || env.USE_OPENAI_MOCKS) {
    return baseline;
  }
  try {
    const response = await (client.responses as any).create({
      model: env.NODE_ENV === "production" ? "gpt-4.1-mini" : "gpt-4o-mini",
      input: [
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text:
                "You are PivotProof's wearable coach. Summarize IMU/insole telemetry for ACL risk readiness, returning JSON that includes summary, 2-3 cues, status chip copy, confidence (0-1) and optional watchouts.",
            },
          ],
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: JSON.stringify({
                athleteId: input.athleteId ?? "anon",
                metrics: input.metrics,
                devices: input.devices,
              }),
            },
          ],
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "WearableInsight",
          schema: WEARABLE_INSIGHT_SCHEMA,
          strict: false,
        },
      },
      temperature: 0.2,
    });

    const parsed =
      (response.output as any)?.[0]?.content?.find((item: any) => item?.parsed)?.parsed ??
      (response as any).parsed ??
      (response.output_text ? JSON.parse(response.output_text) : null);

    if (!parsed) {
      return baseline;
    }

    return {
      summary: parsed.summary ?? baseline.summary,
      cues: Array.isArray(parsed.cues) && parsed.cues.length ? parsed.cues : baseline.cues,
      statusChip: parsed.status_chip ?? baseline.statusChip,
      confidence: typeof parsed.confidence === "number" ? parsed.confidence : baseline.confidence,
      watchouts:
        Array.isArray(parsed.watchouts) && parsed.watchouts.length ? parsed.watchouts : baseline.watchouts,
      generatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.warn("Failed to generate wearable insight", error);
    return baseline;
  }
};
