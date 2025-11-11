import { randomUUID } from "crypto";
import {
  DailyRiskInput,
  DailyRiskRecommendation,
  MicroDrill,
  NextRepCheck,
  RiskLevel,
  RiskTrend,
  RiskMicroPlan,
} from "../types/risk";
import { Prisma } from "../generated/prisma/client";
import { getOpenAIClient } from "../config/openaiClient";
import { env } from "../config/env";
import { prisma } from "../db/prisma";
import { ensureAthlete } from "./athleteService";
import { estimateHeatIndex } from "../utils/plannerHeuristics";
import type { WearableFeatureOut } from "./wearableService";
import { CycleShareScope } from "../generated/prisma/client";
import { createAutomationCaseEvent } from "./caseChannelService";

type VideoFeatureEntry = { features: Record<string, unknown>; recordedAt: Date };
type WearableFeatureEntry = { features: WearableFeatureOut[]; recordedAt: Date };
const videoFeatureCache = new Map<string, VideoFeatureEntry>();
const wearableFeatureCache = new Map<string, WearableFeatureEntry>();

type RiskFeatureEnvelope = {
  video?: { payload: Record<string, unknown>; recordedAt: string };
  wearable?: { payload: WearableFeatureOut[]; recordedAt: string };
};

const parseRiskFeatureEnvelope = (raw: unknown): RiskFeatureEnvelope => {
  if (!raw || typeof raw !== "object") {
    return {};
  }
  const record = raw as Record<string, unknown>;
  if (record.video || record.wearable) {
    const envelope: RiskFeatureEnvelope = {};
    if (record.video && typeof record.video === "object") {
      const video = record.video as Record<string, unknown>;
      if ("payload" in video && video.payload && typeof video.payload === "object") {
        envelope.video = {
          payload: video.payload as Record<string, unknown>,
          recordedAt: typeof video.recordedAt === "string" ? video.recordedAt : new Date().toISOString(),
        };
      }
    }
    if (record.wearable && typeof record.wearable === "object") {
      const wearable = record.wearable as Record<string, unknown>;
      if ("payload" in wearable && Array.isArray(wearable.payload)) {
        envelope.wearable = {
          payload: wearable.payload as WearableFeatureOut[],
          recordedAt: typeof wearable.recordedAt === "string" ? wearable.recordedAt : new Date().toISOString(),
        };
      }
    }
    return envelope;
  }

  // Legacy structure: treat entire record as video features
  return {
    video: { payload: record, recordedAt: new Date().toISOString() },
  };
};

const upsertRiskFeatureEnvelope = async (athleteId: string, mutate: (envelope: RiskFeatureEnvelope) => RiskFeatureEnvelope) => {
  const existing = await prisma.riskFeatureCache.findUnique({ where: { athleteId } });
  const envelope = parseRiskFeatureEnvelope(existing?.features ?? {});
  const next = mutate(envelope);
  await prisma.riskFeatureCache.upsert({
    where: { athleteId },
    update: {
      features: next as Prisma.InputJsonValue,
    },
    create: {
      athleteId,
      features: next as Prisma.InputJsonValue,
    },
  });
};

const getVideoFeatureEntry = async (athleteId: string): Promise<VideoFeatureEntry | null> => {
  const cached = videoFeatureCache.get(athleteId);
  if (cached) return cached;

  const record = await prisma.riskFeatureCache.findUnique({ where: { athleteId } });
  if (!record) return null;

  const envelope = parseRiskFeatureEnvelope(record.features);
  if (!envelope.video) return null;
  const entry: VideoFeatureEntry = {
    features: envelope.video.payload,
    recordedAt: new Date(envelope.video.recordedAt ?? record.updatedAt ?? new Date()),
  };
  videoFeatureCache.set(athleteId, entry);
  return entry;
};

const getWearableFeatureEntry = async (athleteId: string): Promise<WearableFeatureEntry | null> => {
  const cached = wearableFeatureCache.get(athleteId);
  if (cached) return cached;

  const record = await prisma.riskFeatureCache.findUnique({ where: { athleteId } });
  if (!record) return null;
  const envelope = parseRiskFeatureEnvelope(record.features);
  if (!envelope.wearable) return null;
  const entry: WearableFeatureEntry = {
    features: envelope.wearable.payload,
    recordedAt: new Date(envelope.wearable.recordedAt ?? record.updatedAt ?? new Date()),
  };
  wearableFeatureCache.set(athleteId, entry);
  return entry;
};

const calculateHeuristicScore = (input: DailyRiskInput): number => {
  const workloadScore = input.fatigueLevel + input.sorenessLevel;
  const priorInjuryPenalty = input.priorLowerExtremityInjury ? 1 : 0;
  const heatPenalty = input.temperatureF >= 90 ? 1 : 0;
  return workloadScore + priorInjuryPenalty + heatPenalty;
};

const scoreToRiskLevel = (score: number): RiskLevel => {
  if (score >= 4) return "red";
  if (score >= 2) return "yellow";
  return "green";
};

const clampLoadLevel = (value: number): 0 | 1 | 2 | 3 => {
  if (value <= 0) return 0;
  if (value >= 3) return 3;
  const rounded = Math.round(value);
  if (rounded <= 0) return 0;
  if (rounded >= 3) return 3;
  return rounded as 1 | 2;
};

const RISK_LEVEL_SCORES: Record<RiskLevel, number> = {
  green: 0,
  yellow: 1,
  red: 2,
};

const ALT_RISK_LEVEL_MAP: Record<string, RiskLevel> = {
  low: "green",
  moderate: "yellow",
  high: "red",
};

const RISK_RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    risk_level: { type: "string", enum: ["green", "yellow", "red", "low", "moderate", "high"] },
    risk_trend: { type: "string", enum: ["up", "flat", "down"] },
    uncertainty_0_1: { type: "number" },
    drivers: { type: "array", items: { type: "string" } },
    driver_scores: { type: "object", additionalProperties: { type: "number" } },
    why: { type: "string" },
    change_today: { type: "string" },
    micro_plan: {
      type: "object",
      properties: {
        drills: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              sets: { type: "number" },
              reps: { type: "number" },
              rest_s: { type: "number" },
            },
            required: ["name", "sets", "reps", "rest_s"],
          },
        },
      },
    },
    adherence_0_1: { type: "number" },
    next_rep_check: {
      type: "object",
      properties: {
        required: { type: "boolean" },
        received: { type: "boolean" },
        result: { type: "string", enum: ["better", "same", "worse"] },
      },
    },
    cohort_percentile_0_100: { type: "number" },
    environment_policy_flags: { type: "array", items: { type: "string" } },
  },
  required: ["risk_level", "why", "change_today"],
  additionalProperties: false,
} as const;

const RISK_SYSTEM_PROMPT = `
You are a sports scientist assigning daily non-contact ACL risk.
Use evidence-based heuristics (fatigue, valgus exposure, surface, heat, prior injury) and return one actionable change.
Include trend + confidence when possible. Keep guidance practical and field-ready.
`;

const clamp = (value: number | undefined | null, min: number, max: number): number | undefined => {
  if (value === undefined || value === null || Number.isNaN(value)) return undefined;
  if (value < min) return min;
  if (value > max) return max;
  return value;
};

const normalizeRiskLevel = (value: unknown): RiskLevel => {
  if (typeof value === "string") {
    const lower = value.toLowerCase();
    if (lower in ALT_RISK_LEVEL_MAP) {
      const mapped = ALT_RISK_LEVEL_MAP[lower];
      if (mapped) {
        return mapped;
      }
    }
    if (["green", "yellow", "red"].includes(lower)) {
      return lower as RiskLevel;
    }
  }
  // default to yellow if AI gives something unexpected
  return "yellow";
};

const normalizeRiskTrend = (value: unknown): RiskTrend | undefined => {
  if (typeof value !== "string") return undefined;
  const lower = value.toLowerCase();
  if (lower === "up" || lower === "flat" || lower === "down") {
    return lower;
  }
  return undefined;
};

const ensureArrayOfStrings = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter((item) => item.length > 0);
};

const asNumberRecord = (value: unknown): Record<string, number> | undefined => {
  if (!value || typeof value !== "object") return undefined;
  const entries = Object.entries(value as Record<string, unknown>)
    .map(([key, val]) => {
      const num = Number(val);
      return Number.isFinite(num) ? [key, num] : null;
    })
    .filter((item): item is [string, number] => Boolean(item));
  if (!entries.length) return undefined;
  return Object.fromEntries(entries);
};

const parseMicroPlan = (value: unknown): RiskMicroPlan | undefined => {
  if (!value || typeof value !== "object") return undefined;
  const record = value as Record<string, unknown>;
  const drillsRaw = record.drills;
  if (!Array.isArray(drillsRaw)) return undefined;

  const drills: MicroDrill[] = drillsRaw
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const drill = item as Record<string, unknown>;
      const name = typeof drill.name === "string" ? drill.name.trim() : null;
      const sets = Number(drill.sets);
      const reps = Number(drill.reps);
      const rest = Number(drill.rest_s);
      if (!name || !Number.isFinite(sets) || !Number.isFinite(reps) || !Number.isFinite(rest)) return null;
      return {
        name,
        sets,
        reps,
        rest_s: rest,
      };
    })
    .filter((item): item is MicroDrill => item !== null);

  if (!drills.length) return undefined;
  const duration = Number(record.durationMinutes ?? record.duration_minutes ?? record.expectedMinutes ?? record.expected_minutes);
  const phaseValue = typeof record.phase === "string" ? (record.phase as RiskMicroPlan["phase"]) : undefined;
  const progressionValue = typeof record.progression === "string" ? (record.progression as RiskMicroPlan["progression"]) : undefined;
  const expectedMinutes = Number(record.expectedMinutes ?? record.expected_minutes ?? duration);

  return {
    focus: typeof record.focus === "string" ? record.focus : undefined,
    phase: phaseValue,
    progression: progressionValue,
    durationMinutes: Number.isFinite(duration) ? Number(duration) : undefined,
    expectedMinutes: Number.isFinite(expectedMinutes) ? Number(expectedMinutes) : undefined,
    drills,
  };
};

const parseNextRepCheck = (value: unknown): NextRepCheck | undefined => {
  if (!value || typeof value !== "object") return undefined;
  const record = value as Record<string, unknown>;
  const required = typeof record.required === "boolean" ? record.required : false;
  const received = typeof record.received === "boolean" ? record.received : false;
  const result =
    typeof record.result === "string" && ["better", "same", "worse"].includes(record.result)
      ? (record.result as "better" | "same" | "worse")
      : undefined;
  return { required, received, result };
};

const computeBaseUncertainty = (input: DailyRiskInput): number => {
  const featureKeys: Array<keyof DailyRiskInput> = [
    "exposureMinutes",
    "surface",
    "temperatureF",
    "humidityPct",
    "priorLowerExtremityInjury",
    "sorenessLevel",
    "fatigueLevel",
    "bodyWeightTrend",
    "menstrualPhase",
    "notes",
  ];
  const total = featureKeys.length;
  const present = featureKeys.filter((key) => {
    const value = input[key];
    if (value === null || value === undefined) return false;
    if (typeof value === "string") return value.trim().length > 0;
    return true;
  }).length;

  if (total === 0) return 0;
  const completeness = present / total;
  return clamp(1 - completeness, 0, 1) ?? 0;
};

const deriveEnvironmentPolicyFlags = (input: DailyRiskInput): { flags: string[]; heatIndex: number } => {
  const flags: string[] = [];
  const heatIndex = estimateHeatIndex(input.temperatureF, input.humidityPct);

  if (heatIndex >= 95) {
    flags.push("cooling_breaks_15m");
  }
  if (input.surface === "turf") {
    flags.push("reduce_cutting_20%");
  }

  return { flags, heatIndex };
};

const computeAverageScore = (scores: number[]): number | null => {
  if (!scores.length) return null;
  const sum = scores.reduce((total, current) => total + current, 0);
  return sum / scores.length;
};

const inferTrend = (averageScore: number | null, newScore: number): RiskTrend => {
  if (averageScore === null) return "flat";
  const delta = newScore - averageScore;
  const threshold = 0.15;
  if (delta > threshold) return "up";
  if (delta < -threshold) return "down";
  return "flat";
};

type WearableSummary = {
  medianContactMs?: number;
  medianStabilityMs?: number;
  medianValgusIdx?: number;
  maxValgusIdx?: number;
  medianAsymmetryPct?: number;
  medianConfidence?: number;
  windowCount: number;
};

const median = (values: number[]): number | undefined => {
  if (!values.length) return undefined;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    const leftIndex = Math.max(0, mid - 1);
    const rightIndex = Math.min(sorted.length - 1, mid);
    const left = sorted[leftIndex] ?? 0;
    const right = sorted[rightIndex] ?? left;
    return (left + right) / 2;
  }
  return sorted[mid];
};

const summariseWearableFeatures = (features: WearableFeatureOut[] | undefined, limit = 8): WearableSummary | null => {
  if (!features || !features.length) return null;
  const recent = features.slice(-limit);
  const contacts = recent.map((f) => f.contactMs).filter((value): value is number => Number.isFinite(value));
  const stability = recent.map((f) => f.stabilityMs).filter((value): value is number => Number.isFinite(value));
  const valgus = recent.map((f) => f.valgusIdx0to3).filter((value): value is number => Number.isFinite(value));
  const asymmetry = recent.map((f) => f.asymmetryPct).filter((value): value is number => Number.isFinite(value));
  const confidence = recent.map((f) => f.confidence0to1).filter((value): value is number => Number.isFinite(value));

  return {
    medianContactMs: median(contacts),
    medianStabilityMs: median(stability),
    medianValgusIdx: median(valgus),
    maxValgusIdx: valgus.length ? Math.max(...valgus) : undefined,
    medianAsymmetryPct: median(asymmetry),
    medianConfidence: median(confidence),
    windowCount: recent.length,
  };
};

const inlineWearableFeaturesToWindows = (
  features?: DailyRiskInput["wearableFeatures"],
): WearableFeatureOut[] => {
  if (!features || !features.length) return [];
  return features.map((entry, index) => ({
    windowTs: new Date(Date.now() - index * 250).toISOString(),
    contactMs: entry.contactMs ?? undefined,
    stabilityMs: entry.stabilityMs ?? undefined,
    valgusIdx0to3: entry.valgusIdx0to3 ?? undefined,
    asymmetryPct: entry.asymmetryPct ?? undefined,
    confidence0to1: entry.confidence0to1 ?? undefined,
  }));
};

const mapDriversFromInput = (
  input: DailyRiskInput,
  videoFeatures?: Record<string, unknown>,
  wearableSummary?: WearableSummary | null,
): { labels: string[]; scores: Record<string, number> } => {
  const drivers: string[] = [];
  const driverScores: Record<string, number> = {};

  const fatigueLoad = (input.fatigueLevel + input.sorenessLevel) / 6; // max 1
  if (fatigueLoad >= 0.34) {
    drivers.push("high fatigue / soreness load");
    driverScores.fatigue_load = Number(fatigueLoad.toFixed(2));
  }

  if (input.priorLowerExtremityInjury) {
    drivers.push("prior lower-extremity injury history");
    driverScores.prior_injury = 0.8;
  }

  if (input.temperatureF >= 90 || estimateHeatIndex(input.temperatureF, input.humidityPct) >= 95) {
    drivers.push("heat stress conditions");
    driverScores.heat_index = Number((estimateHeatIndex(input.temperatureF, input.humidityPct) / 120).toFixed(2));
  }

  const valgusScore = Number(videoFeatures?.last_video_valgus_score_0_3);
  if (Number.isFinite(valgusScore) && valgusScore >= 2) {
    drivers.push("Video: valgus collapse detected");
    driverScores.video_valgus = Number(Math.min(valgusScore / 3, 1).toFixed(2));
  }

  if (videoFeatures?.trunk_lean_flag === true) {
    drivers.push("Video: trunk lean outside BOS");
    driverScores.video_trunk = 0.6;
  }

  if (wearableSummary) {
    const conf = wearableSummary.medianConfidence ?? 0;
    if (wearableSummary.maxValgusIdx !== undefined && wearableSummary.maxValgusIdx >= 2 && conf >= 0.55) {
      drivers.push("Wearable: dynamic valgus load high");
      driverScores.wearable_valgus = Number(Math.min(1, (wearableSummary.maxValgusIdx + conf) / 4).toFixed(2));
    }
    if (wearableSummary.medianStabilityMs !== undefined && wearableSummary.medianStabilityMs > 420 && conf >= 0.5) {
      drivers.push("Wearable: slow landing stabilization");
      driverScores.wearable_stability = Number(Math.min(1, wearableSummary.medianStabilityMs / 800).toFixed(2));
    }
    if (wearableSummary.medianAsymmetryPct !== undefined && wearableSummary.medianAsymmetryPct >= 12 && conf >= 0.5) {
      drivers.push("Wearable: asymmetry trending high");
      driverScores.wearable_asymmetry = Number(Math.min(1, wearableSummary.medianAsymmetryPct / 30).toFixed(2));
    }
  }

  if (drivers.length === 0) {
    drivers.push("standard workload profile");
    driverScores.load = 0.2;
  }

  return { labels: drivers, scores: driverScores };
};

const elevateRiskLevel = (level: RiskLevel): RiskLevel => {
  if (level === "green") return "yellow";
  if (level === "yellow") return "red";
  return "red";
};

const applyWearableAdjustments = (
  recommendation: DailyRiskRecommendation,
  summary?: WearableSummary | null,
): DailyRiskRecommendation => {
  if (!summary || !summary.windowCount) {
    return recommendation;
  }

  const confidence = summary.medianConfidence ?? 0;
  const next = { ...recommendation };
  const drivers = [...(next.drivers ?? [])];
  const driverScores = { ...(next.driverScores ?? {}) };

  const ensureDriver = (label: string) => {
    if (!drivers.includes(label)) {
      drivers.push(label);
    }
  };

  let adjustedRisk = next.riskLevel;

  if (confidence >= 0.6 && (summary.maxValgusIdx ?? 0) >= 2) {
    ensureDriver("Wearable: valgus load spike");
    driverScores.wearable_valgus = Math.max(driverScores.wearable_valgus ?? 0, 0.72);
    adjustedRisk = elevateRiskLevel(adjustedRisk);
  }

  if (confidence >= 0.6 && (summary.medianStabilityMs ?? 0) > 520) {
    ensureDriver("Wearable: delayed stabilization");
    driverScores.wearable_stability = Math.max(
      driverScores.wearable_stability ?? 0,
      Math.min(1, (summary.medianStabilityMs ?? 0) / 800),
    );
    adjustedRisk = elevateRiskLevel(adjustedRisk);
  }

  if (confidence >= 0.55 && (summary.medianAsymmetryPct ?? 0) >= 15) {
    ensureDriver("Wearable: asymmetry trending high");
    driverScores.wearable_asymmetry = Math.max(
      driverScores.wearable_asymmetry ?? 0,
      Math.min(1, (summary.medianAsymmetryPct ?? 0) / 30),
    );
  }

  next.riskLevel = adjustedRisk;
  if (adjustedRisk !== recommendation.riskLevel && next.riskTrend !== "up") {
    next.riskTrend = "up";
  }
  next.drivers = drivers;
  next.driverScores = driverScores;
  if (next.rawModelOutput && typeof next.rawModelOutput === "object") {
    (next.rawModelOutput as Record<string, unknown>).wearable_adjusted = {
      summary,
      previousRiskLevel: recommendation.riskLevel,
      adjustedRiskLevel: adjustedRisk,
    };
  }
  return next;
};

const appendPhaseSmartDriver = (
  recommendation: DailyRiskRecommendation,
  cyclePrivacy?: { shareScope: CycleShareScope; lastSharedPhase: string | null } | null,
) => {
  if (!cyclePrivacy || cyclePrivacy.shareScope !== CycleShareScope.SHARE_LABEL) return recommendation;
  if (!cyclePrivacy.lastSharedPhase) return recommendation;
  const label = `Phase-smart warmup active (${cyclePrivacy.lastSharedPhase})`;
  const drivers = recommendation.drivers ?? [];
  if (!drivers.includes(label)) {
    recommendation.drivers = [...drivers, label];
  }
  return recommendation;
};

const RISK_USER_PROMPT = (
  input: DailyRiskInput,
  averageScore: number | null,
  baseUncertainty: number,
  recentLevels: string[],
  environmentFlags: string[],
  videoFeatureSnapshot?: Record<string, unknown>,
  wearableSummary?: WearableSummary | null,
) => `
Athlete context:
  id: ${input.athleteId}
  exposure_minutes_yesterday: ${input.exposureMinutes}
  surface: ${input.surface}
  temperature_f: ${input.temperatureF}
  humidity_pct: ${input.humidityPct}
  prior_lower_extremity_injury: ${input.priorLowerExtremityInjury ? "yes" : "no"}
  soreness_level_0_3: ${input.sorenessLevel}
  fatigue_level_0_3: ${input.fatigueLevel}
  body_weight_trend: ${input.bodyWeightTrend ?? "unknown"}
  menstrual_phase_hint: ${input.menstrualPhase ?? "not_provided"}
  notes: ${input.notes ?? "none"}

Recent risk_levels: [${recentLevels.join(", ")}]
Rolling_average_score_hint: ${averageScore ?? "unknown"}
Input_uncertainty_hint: ${baseUncertainty.toFixed(2)}
Environment_policy_flags_hint: [${environmentFlags.join(", ")}]
${
  videoFeatureSnapshot
    ? `Latest_video_features: ${JSON.stringify(videoFeatureSnapshot).slice(0, 400)}`
    : "Latest_video_features: none provided"
}
${
  wearableSummary
    ? `Wearable_summary: ${JSON.stringify(wearableSummary)}`
    : "Wearable_summary: none provided"
}

Return JSON (DailyRiskRecommendation schema) including:
- risk_level (green/yellow/red)
- risk_trend (up/flat/down)
- uncertainty_0_1 (0=confident, 1=very uncertain)
- drivers (list of short bullet phrases)
- driver_scores (numeric 0-1 importance)
- why (plain-language rationale)
- change_today (single actionable change)
- optional micro_plan drills (max 3 entries)
- optional adherence_0_1 if you expect follow-up
- environment_policy_flags if special guardrails apply
`.trim();

const buildMockRiskRecommendation = (
  input: DailyRiskInput,
  context: {
    averageScore: number | null;
    baseUncertainty: number;
    environmentFlags: string[];
    videoFeatures?: Record<string, unknown>;
    wearableSummary?: WearableSummary | null;
  },
): DailyRiskRecommendation => {
  const total = calculateHeuristicScore(input);
  const riskLevel = scoreToRiskLevel(total);
  const riskScore = RISK_LEVEL_SCORES[riskLevel];
  const riskTrend = inferTrend(context.averageScore, riskScore);
  const { labels: drivers, scores: driverScores } = mapDriversFromInput(
    input,
    context.videoFeatures,
    context.wearableSummary,
  );

  const changeTodayMap: Record<RiskLevel, string> = {
    red: "Replace full-speed cutting with landing mechanics circuit; cap high-load reps at 6 and monitor heat breaks.",
    yellow: "Add extended glute activation warm-up and trim sharp cutting volume by ~20%.",
    green: "Maintain plan but spot-check landings on first small-sided drill.",
  };

  const microPlan: RiskMicroPlan = {
    focus: riskLevel === "red" ? "Stabilize landing under fatigue" : "Maintain controlled landing mechanics",
    phase: "landing_control",
    progression: riskLevel === "red" ? "build" : "maintain",
    durationMinutes: 6,
    expectedMinutes: 6,
    drills: [
      { name: "Landing reset on box", sets: 3, reps: 8, rest_s: 45 },
      { name: "Lateral decel step", sets: 3, reps: 6, rest_s: 30 },
      { name: "Hip hinge isometric", sets: 2, reps: 5, rest_s: 40 },
    ],
  };

  return {
    snapshotId: randomUUID(),
    athleteId: input.athleteId,
    riskLevel,
    riskTrend,
    uncertainty0to1: context.baseUncertainty,
    drivers,
    driverScores,
    rationale: `Heuristic score ${total.toFixed(1)} (fatigue ${input.fatigueLevel}, soreness ${input.sorenessLevel}${
      input.priorLowerExtremityInjury ? ", prior injury" : ""
    }${input.temperatureF >= 90 ? ", high heat" : ""})`,
    changeToday: changeTodayMap[riskLevel],
    microPlan,
    environmentPolicyFlags: context.environmentFlags.length ? context.environmentFlags : undefined,
    generatedAt: new Date().toISOString(),
    rawModelOutput: {
      source: "mock",
      heuristicScore: total,
      videoFeatures: context.videoFeatures ?? null,
      wearableSummary: context.wearableSummary ?? null,
    },
  };
};

export const buildDailyRiskRecommendation = async (
  input: DailyRiskInput,
): Promise<DailyRiskRecommendation> => {
  await ensureAthlete(input.athleteId, input.athleteName ?? input.athleteId);
  const cyclePrivacy = await prisma.cyclePrivacySetting.findUnique({
    where: { athleteId: input.athleteId },
  });

  const recentSnapshots = await prisma.riskSnapshot.findMany({
    where: { athleteId: input.athleteId },
    orderBy: [{ recordedFor: "desc" }, { createdAt: "desc" }],
    take: 7,
    select: { riskLevel: true },
  });

  const recentScores = recentSnapshots
    .map((snapshot) => RISK_LEVEL_SCORES[snapshot.riskLevel as RiskLevel])
    .filter((score) => typeof score === "number");
  const averageScore = computeAverageScore(recentScores);
  const baseUncertainty = computeBaseUncertainty(input);
  const { flags: environmentFlags, heatIndex } = deriveEnvironmentPolicyFlags(input);
  const recentLevelsText = recentSnapshots.map((s) => s.riskLevel);
  const videoFeatureEntry = await getVideoFeatureEntry(input.athleteId);
  const videoFeatures = videoFeatureEntry?.features;
  const wearableFeatureEntry = await getWearableFeatureEntry(input.athleteId);
  const cachedWearableFeatures = wearableFeatureEntry ? wearableFeatureEntry.features : [];
  const inlineWearableWindows = inlineWearableFeaturesToWindows(input.wearableFeatures);
  const wearableSummary = summariseWearableFeatures([...cachedWearableFeatures, ...inlineWearableWindows]);

  const client = getOpenAIClient();

  if (!client || env.USE_OPENAI_MOCKS) {
    const mockBase = buildMockRiskRecommendation(input, {
      averageScore,
      baseUncertainty,
      environmentFlags,
      videoFeatures,
      wearableSummary,
    });
    appendPhaseSmartDriver(mockBase, cyclePrivacy);
    const mock = applyWearableAdjustments(mockBase, wearableSummary);
    await persistRiskSnapshot(input, mock);
    return mock;
  }

  try {
    const response = await (client.responses as any).create({
      model: env.NODE_ENV === "production" ? "gpt-4.1" : "gpt-4.1-mini",
      input: [
        { role: "system", content: [{ type: "input_text", text: RISK_SYSTEM_PROMPT.trim() }] },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: RISK_USER_PROMPT(
                input,
                averageScore,
                baseUncertainty,
                recentLevelsText,
                environmentFlags,
                videoFeatures,
                wearableSummary,
              ),
            },
          ],
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "DailyRiskRecommendation",
          schema: RISK_RESPONSE_SCHEMA,
          strict: false,
        },
      },
    });

    const parsed =
      (response.output as any)?.[0]?.content?.find((item: any) => item?.parsed)?.parsed ??
      (response as any).parsed ??
      (response.output_text ? JSON.parse(response.output_text) : null);

    if (!parsed) {
      throw new Error("Unable to parse OpenAI risk response");
    }

    const riskLevel = normalizeRiskLevel(parsed.risk_level);
    const riskScore = RISK_LEVEL_SCORES[riskLevel];
    const riskTrend = normalizeRiskTrend(parsed.risk_trend) ?? inferTrend(averageScore, riskScore);
    const drivers = ensureArrayOfStrings(parsed.drivers);
    const driverScores = asNumberRecord(parsed.driver_scores);
    const microPlan = parseMicroPlan(parsed.micro_plan);
    const nextRepCheck = parseNextRepCheck(parsed.next_rep_check);
    const uncertainty = clamp(parsed.uncertainty_0_1, 0, 1) ?? baseUncertainty;
    const cohortPercentile = clamp(parsed.cohort_percentile_0_100, 0, 100);

    let environmentPolicyFlags = ensureArrayOfStrings(parsed.environment_policy_flags);
    if (!environmentPolicyFlags.length && environmentFlags.length) {
      environmentPolicyFlags = environmentFlags;
    }

    const result: DailyRiskRecommendation = {
      snapshotId: randomUUID(),
      athleteId: input.athleteId,
      riskLevel,
      riskTrend,
      uncertainty0to1: uncertainty,
      drivers: drivers.length ? drivers : undefined,
      driverScores: driverScores,
      rationale: parsed.why,
      changeToday: parsed.change_today,
      microPlan,
      adherence0to1: clamp(parsed.adherence_0_1, 0, 1),
      nextRepCheck,
      cohortPercentile0to100: cohortPercentile,
      environmentPolicyFlags: environmentPolicyFlags.length ? environmentPolicyFlags : undefined,
      generatedAt: new Date().toISOString(),
      rawModelOutput: {
        ...parsed,
        heat_index_hint: heatIndex,
        video_features_hint: videoFeatures ?? null,
        wearable_summary_hint: wearableSummary ?? null,
      },
    };

    appendPhaseSmartDriver(result, cyclePrivacy);

    const wearableAdjusted = applyWearableAdjustments(result, wearableSummary);
    await persistRiskSnapshot(input, wearableAdjusted);
    return wearableAdjusted;
  } catch (error) {
    console.error("OpenAI risk classification failed", error);
    const fallbackBase = buildMockRiskRecommendation(input, {
      averageScore,
      baseUncertainty,
      environmentFlags,
      videoFeatures,
      wearableSummary,
    });
    appendPhaseSmartDriver(fallbackBase, cyclePrivacy);
    const fallback = applyWearableAdjustments(fallbackBase, wearableSummary);
    await persistRiskSnapshot(input, fallback);
    return fallback;
  }
};

const toTrustGrade = (uncertainty?: number | null) => {
  if (uncertainty === undefined || uncertainty === null) return "B";
  if (uncertainty <= 0.2) return "A";
  if (uncertainty <= 0.35) return "B";
  return "C";
};

const persistRiskSnapshot = async (input: DailyRiskInput, result: DailyRiskRecommendation) => {
  await prisma.riskSnapshot.create({
    data: {
      id: result.snapshotId,
      athleteId: input.athleteId,
      exposureMinutes: input.exposureMinutes,
      surface: input.surface,
      temperatureF: input.temperatureF,
      humidityPct: input.humidityPct,
      priorLowerExtremityInjury: input.priorLowerExtremityInjury,
      sorenessLevel: input.sorenessLevel,
      fatigueLevel: input.fatigueLevel,
      bodyWeightTrend: input.bodyWeightTrend,
      menstrualPhase: input.menstrualPhase,
      notes: input.notes,
      recordedFor: input.recordedFor ? new Date(input.recordedFor) : new Date(),
      riskLevel: result.riskLevel,
      riskTrend: result.riskTrend ?? null,
      uncertainty0to1: result.uncertainty0to1 ?? null,
      drivers: result.drivers ? (result.drivers as unknown as Prisma.InputJsonValue) : undefined,
      driverScores: result.driverScores ? (result.driverScores as unknown as Prisma.InputJsonValue) : undefined,
      microPlan: result.microPlan ? (result.microPlan as unknown as Prisma.InputJsonValue) : undefined,
      adherence0to1: result.adherence0to1 ?? null,
      nextRepCheck: result.nextRepCheck ? (result.nextRepCheck as unknown as Prisma.InputJsonValue) : undefined,
      cohortPercentile0to100: result.cohortPercentile0to100 ?? null,
      environmentPolicyFlags: result.environmentPolicyFlags
        ? (result.environmentPolicyFlags as unknown as Prisma.InputJsonValue)
        : undefined,
      rationale: result.rationale,
      changeToday: result.changeToday,
      rawModelOutput: JSON.stringify(result.rawModelOutput ?? {}),
    },
  });
  await recordRiskCaseEvent(input, result);
};

const recordRiskCaseEvent = async (input: DailyRiskInput, result: DailyRiskRecommendation) => {
  try {
    const athlete = await prisma.athlete.findUnique({
      where: { id: input.athleteId },
      select: { team: true },
    });
    await createAutomationCaseEvent(
      input.athleteId,
      {
        eventType: "risk",
        title: `Risk ${result.riskLevel.toUpperCase()}`,
        summary: result.rationale,
        trustGrade: toTrustGrade(result.uncertainty0to1),
        nextAction: result.changeToday,
        pinned: result.riskLevel === "red",
        metadata: {
          riskTrend: result.riskTrend,
          drivers: result.drivers?.slice?.(0, 3),
          uncertainty: result.uncertainty0to1 ?? null,
        },
      },
      {
        team: athlete?.team ?? null,
        actor: { role: "Risk Twin" },
      },
    );
  } catch (error) {
    console.warn("Failed to create risk case event", error);
  }
};

export const listRiskSnapshots = (athleteId: string, limit = 30) =>
  prisma.riskSnapshot.findMany({
    where: { athleteId },
    orderBy: [{ recordedFor: "desc" }, { createdAt: "desc" }],
    take: limit,
  });

export const listLatestRiskSnapshotsForTeam = async (team: string, targetDate?: string) => {
  const teamAthletes = await prisma.athlete.findMany({
    where: { team },
    select: { id: true, displayName: true, position: true, team: true },
  });

  if (!teamAthletes.length) {
    return [];
  }

  const athleteIds = teamAthletes.map((athlete) => athlete.id);

  const snapshots = await prisma.riskSnapshot.findMany({
    where: {
      athleteId: { in: athleteIds },
      ...(targetDate
        ? {
            recordedFor: {
              gte: new Date(targetDate),
              lt: new Date(new Date(targetDate).getTime() + 24 * 60 * 60 * 1000),
            },
          }
        : {}),
    },
    orderBy: [{ recordedFor: "desc" }, { createdAt: "desc" }],
  });

  const latestByAthlete = new Map<string, (typeof snapshots)[number]>();
  snapshots.forEach((snapshot) => {
    if (!latestByAthlete.has(snapshot.athleteId)) {
      latestByAthlete.set(snapshot.athleteId, snapshot);
    }
  });

  return teamAthletes
    .map((athlete) => {
      const snapshot = latestByAthlete.get(athlete.id);
      if (!snapshot) return null;

      return {
        athlete,
        snapshot,
      };
    })
    .filter((entry): entry is { athlete: typeof teamAthletes[number]; snapshot: (typeof snapshots)[number] } => entry !== null);
};

export const acknowledgeRiskSnapshot = (snapshotId: string) =>
  prisma.riskSnapshot.update({
    where: { id: snapshotId },
    data: { recommendationAcknowledged: true },
    select: {
      id: true,
      athleteId: true,
      changeToday: true,
      riskLevel: true,
    },
  });

export const updateRiskSnapshotMeta = (
  snapshotId: string,
  data: { adherence0to1?: number | null; nextRepCheck?: NextRepCheck | null },
) => {
  const updatePayload: Record<string, unknown> = {};
  if (data.adherence0to1 !== undefined) {
    updatePayload.adherence0to1 = data.adherence0to1;
  }
  if (data.nextRepCheck !== undefined) {
    updatePayload.nextRepCheck = data.nextRepCheck ? JSON.stringify(data.nextRepCheck) : null;
  }

  if (Object.keys(updatePayload).length === 0) {
    throw new Error("No fields provided to update.");
  }

  return prisma.riskSnapshot.update({
    where: { id: snapshotId },
    data: updatePayload,
  });
};

export const storeVideoRiskFeatures = async (athleteId: string, features: Record<string, unknown>) => {
  const recordedAt = new Date();
  videoFeatureCache.set(athleteId, { features, recordedAt });
  await upsertRiskFeatureEnvelope(athleteId, (envelope) => ({
    ...envelope,
    video: { payload: features, recordedAt: recordedAt.toISOString() },
  }));
};

export const storeWearableRiskFeatures = async (athleteId: string, features: WearableFeatureOut[]) => {
  const recordedAt = new Date();
  wearableFeatureCache.set(athleteId, { features, recordedAt });
  await upsertRiskFeatureEnvelope(athleteId, (envelope) => ({
    ...envelope,
    wearable: { payload: features, recordedAt: recordedAt.toISOString() },
  }));
};

const applyHeuristicTweak = (input: DailyRiskInput, tweak: string): DailyRiskInput => {
  const next: DailyRiskInput = { ...input };
  const normalized = tweak.toLowerCase();

  if (normalized.includes("cut") && normalized.includes("20")) {
    next.fatigueLevel = clampLoadLevel(next.fatigueLevel - 1);
    next.sorenessLevel = clampLoadLevel(next.sorenessLevel - 1);
  }

  if (normalized.includes("shade") || normalized.includes("shorten") || normalized.includes("cool")) {
    next.temperatureF = Math.max(75, next.temperatureF - 5);
  }

  if (normalized.includes("molded") || normalized.includes("cleat")) {
    // treat as lowering surface risk
    next.surface = "grass";
  }

  if (normalized.includes("reduce") && normalized.includes("exposure")) {
    next.exposureMinutes = Math.max(20, Math.round(next.exposureMinutes * 0.8));
  }

  return next;
};

export const simulateRiskCounterfactuals = async (input: {
  athleteId: string;
  context?: Partial<DailyRiskInput>;
  tweaks: string[];
}) => {
  const base: DailyRiskInput = {
    athleteId: input.athleteId,
    exposureMinutes: input.context?.exposureMinutes ?? 45,
    surface: input.context?.surface ?? "turf",
    temperatureF: input.context?.temperatureF ?? 85,
    humidityPct: input.context?.humidityPct ?? 60,
    priorLowerExtremityInjury: input.context?.priorLowerExtremityInjury ?? false,
    sorenessLevel: input.context?.sorenessLevel ?? 1,
    fatigueLevel: input.context?.fatigueLevel ?? 1,
    bodyWeightTrend: input.context?.bodyWeightTrend,
    menstrualPhase: input.context?.menstrualPhase,
    notes: input.context?.notes,
  };

  const baseScore = calculateHeuristicScore(base);

  const results = input.tweaks.map((tweak) => {
    const adjusted = applyHeuristicTweak(base, tweak);
    const adjustedScore = calculateHeuristicScore(adjusted);
    const expectedDelta = Number((baseScore - adjustedScore).toFixed(2));
    const rationale =
      expectedDelta > 0
        ? "Heuristic expects this tweak to lower fatigue or heat drivers."
        : "Minimal change expected against current workload profile.";
    return {
      tweak,
      expectedDelta,
      rationale,
    };
  });

  return results.sort((a, b) => b.expectedDelta - a.expectedDelta);
};

const parseJsonField = <T>(value: unknown): T | undefined => {
  if (value === null || value === undefined) return undefined;
  if (typeof value === "string") {
    try {
      return JSON.parse(value) as T;
    } catch {
      return undefined;
    }
  }
  return value as T;
};

export const getRiskSnapshotAudit = async (snapshotId: string) => {
  const snapshot = await prisma.riskSnapshot.findUnique({ where: { id: snapshotId } });
  if (!snapshot) {
    throw new Error("Snapshot not found");
  }

  const drivers = parseJsonField<string[]>(snapshot.drivers);
  const driverScores = parseJsonField<Record<string, number>>(snapshot.driverScores);
  const microPlan = parseJsonField<{ drills: MicroDrill[] }>(snapshot.microPlan);
  const nextRepCheck = parseJsonField<NextRepCheck>(snapshot.nextRepCheck);
  const environmentPolicyFlags = parseJsonField<string[]>(snapshot.environmentPolicyFlags);
  const rawModelPayload = snapshot.rawModelOutput ? parseJsonField<unknown>(snapshot.rawModelOutput) ?? snapshot.rawModelOutput : null;
  const videoFeatures = await getVideoFeatureEntry(snapshot.athleteId);

  const heuristicVersion =
    typeof rawModelPayload === "object" && rawModelPayload && (rawModelPayload as any).source === "mock"
      ? "heuristic_v1"
      : "openai_v1";

  return {
    promptInputs: {
      athleteId: snapshot.athleteId,
      exposureMinutes: snapshot.exposureMinutes,
      surface: snapshot.surface,
      temperatureF: snapshot.temperatureF,
      humidityPct: snapshot.humidityPct,
      priorLowerExtremityInjury: snapshot.priorLowerExtremityInjury,
      sorenessLevel: snapshot.sorenessLevel,
      fatigueLevel: snapshot.fatigueLevel,
      bodyWeightTrend: snapshot.bodyWeightTrend,
      menstrualPhase: snapshot.menstrualPhase,
      notes: snapshot.notes,
      recordedFor: snapshot.recordedFor?.toISOString?.() ?? snapshot.recordedFor,
    },
    rawModelPayload,
    heuristicVersion,
    featureVector: {
      drivers,
      driverScores,
      microPlan,
      nextRepCheck,
      environmentPolicyFlags,
      videoFeatures: videoFeatures
        ? { recordedAt: videoFeatures.recordedAt.toISOString(), ...videoFeatures.features }
        : null,
    },
  };
};
