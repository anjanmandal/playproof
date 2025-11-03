import { randomUUID } from "crypto";
import { RehabAssessmentInput, RehabAssessmentResult } from "../types/rehab";
import { getOpenAIClient } from "../config/openaiClient";
import { env } from "../config/env";
import { prisma } from "../db/prisma";
import { ensureAthlete } from "./athleteService";
import { Prisma } from "../generated/prisma/client";
import { buildInputImageContent } from "../utils/openaiMedia";

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

const REHAB_SYSTEM_PROMPT = `
You are a return-to-play gatekeeper following evidence-based ACL protocols.
Use hop tests, limb symmetry, and strength metrics to decide clearance.
If LSI < 0.9 or mechanics show valgus collapse, return NOT CLEARED.
Provide friendly explanations for parents and athletes, and clinical notes for the medical team.
`;

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
