import { CycleShareScope } from "../generated/prisma/client";
import { prisma } from "../db/prisma";
import { getOpenAIClient } from "../config/openaiClient";
import { env } from "../config/env";
import type { CycleSignals, Phase, PhaseEstimate, PhasePolicy, WarmupSummary } from "../types/cycle";

export const getCyclePrivacySetting = async (athleteId: string) => {
  return prisma.cyclePrivacySetting.findUnique({
    where: { athleteId },
  });
};

export const setCycleShareScope = async (athleteId: string, shareScope: CycleShareScope) => {
  return prisma.cyclePrivacySetting.upsert({
    where: { athleteId },
    update: { shareScope },
    create: { athleteId, shareScope },
  });
};

export const recordCycleShare = async (
  athleteId: string,
  phase: string,
  confidenceBucket: string,
) => {
  const result = await prisma.$transaction(async (tx) => {
    const updated = await tx.cyclePrivacySetting.upsert({
      where: { athleteId },
      update: { lastSharedPhase: phase, lastSharedConfidence: confidenceBucket, lastSharedAt: new Date() },
      create: {
        athleteId,
        shareScope: CycleShareScope.SHARE_LABEL,
        lastSharedPhase: phase,
        lastSharedConfidence: confidenceBucket,
        lastSharedAt: new Date(),
      },
    });
    await tx.cycleShareLog.create({
      data: {
        athleteId,
        phase,
        confidenceBucket,
      },
    });
    return updated;
  });
  return result;
};

const daysBetween = (startIso: string, endIso: string) => {
  const start = new Date(`${startIso}T00:00:00`);
  const end = new Date(`${endIso}T00:00:00`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null;
  return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
};

const localPhaseEstimate = (signals: CycleSignals = {}): PhaseEstimate => {
  const today = new Date();
  const lastStart = signals.lastPeriodISO ? new Date(signals.lastPeriodISO) : null;
  const daysSince =
    lastStart && !Number.isNaN(lastStart.getTime())
      ? Math.max(0, Math.round((today.getTime() - lastStart.getTime()) / (1000 * 60 * 60 * 24)))
      : null;
  const cycleLength = signals.avgCycleDays && signals.avgCycleDays > 0 ? signals.avgCycleDays : 28;
  let phase: Phase = "unsure";
  if (daysSince !== null) {
    const normalized = daysSince % cycleLength;
    if (normalized <= 4) phase = "menstrual";
    else if (normalized <= cycleLength * 0.45) phase = "follicular";
    else if (normalized <= cycleLength * 0.65) phase = "ovulatory";
    else phase = "luteal";
  }
  let confidence = lastStart ? 0.8 : 0.45;
  if (signals.contraception === "combined_ocp") confidence *= 0.6;
  if (signals.symptoms?.includes("heavy_flow")) confidence = Math.max(confidence, 0.7);
  return {
    phase,
    confidence0to1: Math.min(1, Math.max(0.2, confidence)),
    reasons: [
      lastStart ? `Logged ${daysSince}d ago` : "No recent period log",
      `Cycle length ${cycleLength}d`,
    ],
  };
};

const CYCLE_RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    phase: { type: "string", enum: ["menstrual", "follicular", "ovulatory", "luteal", "unsure"] },
    confidence_0_1: { type: "number" },
    reasons: { type: "array", items: { type: "string" } },
  },
  required: ["phase", "confidence_0_1"],
  additionalProperties: false,
} as const;

const clamp = (value: number | null | undefined, min: number, max: number): number | undefined => {
  if (value === null || value === undefined || Number.isNaN(value)) return undefined;
  if (value < min) return min;
  if (value > max) return max;
  return value;
};

export const inferCyclePhaseAI = async (signals: CycleSignals): Promise<PhaseEstimate> => {
  const fallback = localPhaseEstimate(signals);
  if (env.USE_OPENAI_MOCKS) return fallback;
  const client = getOpenAIClient();
  if (!client) return fallback;

  const nowIso = new Date().toISOString().slice(0, 10);
  const sanitized = {
    days_since_last_period:
      signals.lastPeriodISO && nowIso ? daysBetween(signals.lastPeriodISO, nowIso) : null,
    avg_cycle_days: signals.avgCycleDays ?? 28,
    symptoms: signals.symptoms ?? [],
    hrv_trend: signals.hrvTrend ?? "flat",
    temp_trend: signals.tempTrend ?? "flat",
    contraception: signals.contraception ?? "none",
  };

  try {
    const response = await (client.responses as any).create({
      model: env.NODE_ENV === "production" ? "gpt-4.1" : "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text: `You are a privacy-safe physiology assistant that infers menstrual cycle phase bands (menstrual, follicular, ovulatory, luteal, unsure).
Only use the anonymized signals provided. Output calibrated confidence and short reasons.`,
            },
          ],
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: `Signals (JSON): ${JSON.stringify(sanitized, null, 2)}
Return JSON with { "phase": "...", "confidence_0_1": 0-1 float, "reasons": ["..."] }`,
            },
          ],
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "CyclePhaseEstimate",
          schema: CYCLE_RESPONSE_SCHEMA,
          strict: false,
        },
      },
    });

    const parsed =
      (response.output as any)?.[0]?.content?.find((item: any) => item?.parsed)?.parsed ??
      (response as any).parsed ??
      (response.output_text ? JSON.parse(response.output_text) : null);

    if (!parsed) {
      throw new Error("Unable to parse OpenAI cycle response");
    }

    const phase = (parsed.phase ?? "unsure") as Phase;
    const confidence = clamp(parsed.confidence_0_1, 0, 1) ?? fallback.confidence0to1;
    const reasons =
      Array.isArray(parsed.reasons) && parsed.reasons.length
        ? parsed.reasons.map((reason: unknown) => String(reason)).slice(0, 4)
        : fallback.reasons;

    return {
      phase,
      confidence0to1: confidence,
      reasons,
    };
  } catch (error) {
    console.error("Cycle AI inference failed", error);
    return fallback;
  }
};

const localWarmupSummary = (
  signals: CycleSignals,
  estimate: PhaseEstimate,
  policy: PhasePolicy,
): WarmupSummary => {
  const desc = [
    estimate.phase === "unsure"
      ? "General neuromuscular focus"
      : `${estimate.phase.charAt(0).toUpperCase()}${estimate.phase.slice(1)} focus`,
    `Confidence ${(estimate.confidence0to1 * 100).toFixed(0)}%`,
    `+${policy.warmupExtraMin} min prep`,
    policy.cutDensityDelta < 0
      ? `${Math.abs(Math.round(policy.cutDensityDelta * 100))}% cutting deload`
      : "Standard cutting load",
  ].join(" • ");
  const nudges = [
    `Glute/hamstring activation +${policy.warmupExtraMin} min`,
    policy.landingFocus ? "Landing control block gets two extra reps" : "Standard landing block",
    policy.cutDensityDelta < 0
      ? `Reduce sharp cutting by ${Math.abs(Math.round(policy.cutDensityDelta * 100))}%`
      : "Maintain standard cutting volume",
    policy.cueVigilance === "high" ? "Flag knee-valgus cues in Block 1" : "Normal cues",
  ];
  const symptomFlag = signals.symptoms?.find((symptom) => symptom && symptom !== "none");
  return {
    title: "Today’s phase-tuned warmup",
    description: desc,
    nudges,
    cta: symptomFlag ? "Heavy symptoms logged—offer low-impact alternate drills." : null,
  };
};

const WarmupResponseSchema = {
  type: "object",
  properties: {
    title: { type: "string" },
    description: { type: "string" },
    nudges: { type: "array", items: { type: "string" }, minItems: 1, maxItems: 4 },
    cta: { type: "string" },
  },
  required: ["title", "description", "nudges"],
  additionalProperties: false,
} as const;

export const generateWarmupSummary = async (
  signals: CycleSignals,
  estimate: PhaseEstimate,
  policy: PhasePolicy,
): Promise<WarmupSummary> => {
  const fallback = localWarmupSummary(signals, estimate, policy);
  if (env.USE_OPENAI_MOCKS) return fallback;
  const client = getOpenAIClient();
  if (!client) return fallback;

  const payload = {
    phase: estimate.phase,
    confidence_pct: Math.round(estimate.confidence0to1 * 100),
    warmup_extra_min: policy.warmupExtraMin,
    cutting_delta_pct: Math.round(policy.cutDensityDelta * 100),
    landing_focus: policy.landingFocus,
    cue_vigilance: policy.cueVigilance,
    symptom_flags: signals.symptoms ?? [],
    hrv_trend: signals.hrvTrend ?? "flat",
    temp_trend: signals.tempTrend ?? "flat",
    contraception: signals.contraception ?? "none",
  };

  try {
    const response = await (client.responses as any).create({
      model: env.NODE_ENV === "production" ? "gpt-4.1" : "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text:
                "You are a privacy-safe performance coach. Generate concise warmup copy (title, description, 3 short nudges, optional CTA) for soccer/field athletes. Mention phase impact on workload without referencing cycle dates.",
            },
          ],
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: `Context JSON: ${JSON.stringify(payload, null, 2)}
Return JSON { "title": "...", "description": "...", "nudges": ["..."], "cta": "..." }`,
            },
          ],
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "WarmupSummary",
          schema: WarmupResponseSchema,
          strict: false,
        },
      },
    });

    const parsed =
      (response.output as any)?.[0]?.content?.find((item: any) => item?.parsed)?.parsed ??
      (response as any).parsed ??
      (response.output_text ? JSON.parse(response.output_text) : null);

    if (!parsed) throw new Error("Unable to parse OpenAI warmup summary response");

    return {
      title: typeof parsed.title === "string" ? parsed.title : fallback.title,
      description: typeof parsed.description === "string" ? parsed.description : fallback.description,
      nudges: Array.isArray(parsed.nudges) && parsed.nudges.length
        ? parsed.nudges.map((item: unknown) => String(item)).slice(0, 4)
        : fallback.nudges,
      cta: parsed.cta ? String(parsed.cta) : fallback.cta,
    };
  } catch (error) {
    console.error("Warmup summary generation failed", error);
    return fallback;
  }
};
