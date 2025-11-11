import { randomUUID } from "crypto";
import { prisma } from "../db/prisma";
import { MicroDrill, RiskLevel } from "../types/risk";
import {
  AccessRouterSummary,
  ApplyTeamPlanInput,
  AthletePlanInsight,
  CoachTriageItem,
  CoachTriageQueuePayload,
  CompiledSessionBlock,
  FairnessGuardSummary,
  HeatClockEntry,
  PracticeCompilerPayload,
  RankedTweak,
  TeamPlanRecord,
  TeamPlannerSimulationInput,
  TeamPlannerSimulationResult,
} from "../types/planner";
import { estimateHeatIndex } from "../utils/plannerHeuristics";
import { Prisma, CycleShareScope, MovementProof } from "../generated/prisma/client";
import { createAutomationCaseEvent } from "./caseChannelService";

const DEFAULT_TWEAK_LIBRARY: Record<
  string,
  {
    label: string;
    baseDelta: number;
    rationale: (context: SimulationContext) => string;
  }
> = {
  move_indoor: {
    label: "Move session indoors",
    baseDelta: 0.18,
    rationale: (context) =>
      context.environmentFlags.includes("cooling_breaks_15m")
        ? "High heat index triggers cooling policy — indoor focus protects fatigued athletes."
        : "Indoor move cuts heat and surface friction risk.",
  },
  reduce_cutting_15: {
    label: "Reduce cutting load by 15%",
    baseDelta: 0.11,
    rationale: () => "Lowering lateral load trims knee abduction risk for skill groups.",
  },
  add_fifa11: {
    label: "Add neuromuscular warmup (FIFA11+)",
    baseDelta: 0.07,
    rationale: () => "Neuromuscular warmup primes landing mechanics before high demand drills.",
  },
};

const BLOCK_STAGE_BASE: Record<string, number> = {
  capacity: 45,
  control: 60,
  strength: 75,
  landing: 85,
};

type ProgressAction = "step_up" | "deload" | "steady";

interface ProgressionState {
  capacityIndex: number;
  consecutiveAGrades: number;
  lastProgressionAt: string | null;
  action: ProgressAction;
}

const BLOCK_STAGE_KEYWORDS: Array<{ stage: keyof typeof BLOCK_STAGE_BASE; keywords: string[] }> = [
  { stage: "capacity", keywords: ["warmup", "mobility", "prep", "mobility"] },
  { stage: "control", keywords: ["control", "technique", "tempo"] },
  { stage: "strength", keywords: ["strength", "power", "tempo", "drill"] },
  { stage: "landing", keywords: ["landing", "cut", "landing"] },
];

const determineBlockStage = (name: string): keyof typeof BLOCK_STAGE_BASE => {
  const lowered = name.toLowerCase();
  for (const mapping of BLOCK_STAGE_KEYWORDS) {
    if (mapping.keywords.some((keyword) => lowered.includes(keyword))) {
      return mapping.stage;
    }
  }
  return "control";
};

const computeDifficultyIndex = (stage: keyof typeof BLOCK_STAGE_BASE, capacityIndex: number) => {
  const base = BLOCK_STAGE_BASE[stage] ?? 50;
  return Math.max(0, Math.min(100, base + Math.round((capacityIndex - 60) / 2)));
};

const computeConsecutiveAGrades = (proofs: MovementProof[]) => {
  let count = 0;
  for (const proof of proofs) {
    if ((proof.verdict ?? "").toUpperCase() === "A") {
      count += 1;
      continue;
    }
    break;
  }
  return count;
};

const fetchRecentProofs = async (athleteIds: string[]) => {
  const proofsMap = new Map<string, MovementProof[]>();
  await Promise.all(
    athleteIds.map(async (athleteId) => {
      const proofs = await prisma.movementProof.findMany({
        where: { athleteId },
        orderBy: { proofAt: "desc" },
        take: 3,
      });
      proofsMap.set(athleteId, proofs);
    }),
  );
  return proofsMap;
};

const refreshAthleteProgressions = async (
  athleteIds: string[],
  riskMap: Map<string, { sorenessLevel?: number | null }>,
): Promise<Map<string, ProgressionState>> => {
  const progressRecords = await prisma.athletePlanProgress.findMany({
    where: { athleteId: { in: athleteIds } },
  });
  const progressRecordMap = new Map<string, (typeof progressRecords)[number]>(
    progressRecords.map((record) => [record.athleteId, record]),
  );
  const proofsMap = await fetchRecentProofs(athleteIds);
  const updatedMap = new Map<string, ProgressionState>();

  await Promise.all(
    athleteIds.map(async (athleteId) => {
      const existing = progressRecordMap.get(athleteId);
      const proofs = proofsMap.get(athleteId) ?? [];
      const consecutiveA = computeConsecutiveAGrades(proofs);
      const now = new Date();
      const daysSince =
        existing && existing.lastProgressionAt
          ? Math.floor((now.getTime() - existing.lastProgressionAt.getTime()) / (1000 * 3600 * 24))
          : Infinity;
      const soreness = riskMap.get(athleteId)?.sorenessLevel ?? 0;
      let nextCapacity = existing?.capacityIndex ?? 60;
      let action: ProgressAction = "steady";

      if (soreness >= 6) {
        nextCapacity = Math.max(35, nextCapacity - 5);
        action = "deload";
      } else if (consecutiveA >= 2 && daysSince >= 7) {
        nextCapacity = Math.min(100, nextCapacity + 5);
        action = "step_up";
      }

      const lastProgressionAt =
        action !== "steady" ? now : existing?.lastProgressionAt ?? null;

      await prisma.athletePlanProgress.upsert({
        where: { athleteId },
        create: {
          athleteId,
          capacityIndex: nextCapacity,
          consecutiveAGrades: consecutiveA,
          lastProgressionAt: lastProgressionAt ?? undefined,
        },
        update: {
          capacityIndex: nextCapacity,
          consecutiveAGrades: consecutiveA,
          lastProgressionAt: lastProgressionAt ?? undefined,
        },
      });

      updatedMap.set(athleteId, {
        capacityIndex: nextCapacity,
        consecutiveAGrades: consecutiveA,
        lastProgressionAt: lastProgressionAt ? lastProgressionAt.toISOString() : null,
        action,
      });
    }),
  );

  return updatedMap;
};

interface SimulationContext {
  environmentFlags: string[];
  heatIndex: number;
}

const TWEAK_KEY_CUSTOM = "custom_tweak";

const ensureBlocksFitSession = (
  sessionLength: number,
  blocks: TeamPlannerSimulationInput["blocks"],
  indoorPreferred: boolean,
  averageCapacity: number,
): { blocks: CompiledSessionBlock[]; hydrationSchedule: number[]; summary: string } => {
  const totalMin = blocks.reduce((sum, block) => sum + block.minMinutes, 0);
  const totalMax = blocks.reduce((sum, block) => sum + block.maxMinutes, 0);
  const available = Math.max(sessionLength, totalMin);
  const scale =
    totalMax === totalMin ? 1 : Math.min(1, (available - totalMin) / Math.max(totalMax - totalMin, 1));

  let elapsed = 0;
  const compiledBlocks: CompiledSessionBlock[] = blocks.map((block, index) => {
    const extra = Math.round((block.maxMinutes - block.minMinutes) * scale);
    const minutes = Math.min(block.maxMinutes, block.minMinutes + extra);
    const location: CompiledSessionBlock["location"] =
      index === 0 ? (indoorPreferred ? "indoor" : "turf") : indoorPreferred ? "indoor" : "turf";
    const focus =
      index === 0
        ? "Movement quality & neuromuscular prep"
        : index === blocks.length - 1
        ? "Team install & walkthrough"
        : "Position-specific workload";
    elapsed += minutes;
    const stage = determineBlockStage(block.name);
    const difficultyIndex = computeDifficultyIndex(stage, averageCapacity);
    return { name: block.name, minutes, location, focus, difficultyIndex };
  });

  const hydrationEvery = 15;
  const hydrationSchedule: number[] = [];
  for (let mark = hydrationEvery; mark < sessionLength; mark += hydrationEvery) {
    hydrationSchedule.push(mark);
  }

  const summary = `Session fits ${sessionLength} min with hydration at ${hydrationSchedule.join(
    ", ",
  )} min.`;

  return { blocks: compiledBlocks, hydrationSchedule, summary };
};

const microDrillLibrary: MicroDrill[] = [
  { name: "Drop-jump stick", sets: 2, reps: 6, rest_s: 45 },
  { name: "Lateral bound hold", sets: 2, reps: 5, rest_s: 40 },
  { name: "Single-leg tempo step-down", sets: 2, reps: 6, rest_s: 30 },
];

const buildMicroPlan = (): { drills: MicroDrill[] } => ({
  drills: microDrillLibrary.slice(0, 2),
});

const riskLevelScore = (riskLevel: string): number => {
  switch (riskLevel as RiskLevel) {
    case "red":
      return 0.85;
    case "yellow":
      return 0.45;
    default:
      return 0.15;
  }
};

const computePlanConfidence = (
  riskScore: number,
  videoFeatures?: Record<string, unknown>,
  progression?: ProgressionState,
): number => {
  const clipAgeCandidates = [
    Number(videoFeatures?.last_verified_clip_hours),
    Number(videoFeatures?.last_verified_clip_age_hours),
  ];
  const clipAgeHoursRaw = clipAgeCandidates.find((value) => Number.isFinite(value));
  const clipFreshness = Number.isFinite(clipAgeHoursRaw)
    ? Math.max(0, Math.min(1, 1 - (clipAgeHoursRaw as number) / 72))
    : 0.5;
  const viewConfidence = Number(videoFeatures?.last_video_confidence_0_1);
  const viewFactor = Number.isFinite(viewConfidence) ? Math.max(0, Math.min(1, viewConfidence)) : 0.65;
  let confidence = 0.45 * (1 - riskScore) + 0.3 * clipFreshness + 0.25 * viewFactor;
  if (progression?.action === "deload") confidence += 0.05;
  if (progression?.action === "step_up") confidence -= 0.05;
  return Number(Math.max(0.1, Math.min(1, confidence)).toFixed(2));
};

const classifyHeatStatus = (heatIndex: number): { status: "safe" | "caution" | "danger"; recommendation: string } => {
  if (heatIndex < 90) return { status: "safe", recommendation: "Standard cadence" };
  if (heatIndex < 103) return { status: "caution", recommendation: "Add shade break + hydration" };
  return { status: "danger", recommendation: "Move indoor / shorten load" };
};

const buildHeatClock = (
  sessionDate: Date,
  baseTemp: number | undefined,
  baseHumidity: number | undefined,
  indoorPreferred: boolean,
): HeatClockEntry[] => {
  const temperature = baseTemp ?? 88;
  const humidity = baseHumidity ?? 65;
  const slots = [0, 30, 60, 90, 120];
  return slots.map((minute) => {
    const tempShift = minute >= 60 ? 2 + minute / 60 : minute / 45;
    const humidityShift = minute / 90;
    const adjustedTemp = indoorPreferred ? temperature - 1 : temperature + tempShift;
    const adjustedHumidity = Math.min(100, humidity + humidityShift * 4);
    const heatIndex = Number(
      estimateHeatIndex(adjustedTemp, adjustedHumidity).toFixed(1),
    );
    const blockTime = new Date(sessionDate);
    blockTime.setMinutes(blockTime.getMinutes() + minute);
    const { status, recommendation } = classifyHeatStatus(heatIndex);
    return {
      time: blockTime.toISOString(),
      heatIndex,
      status,
      recommendation: indoorPreferred && status === "danger" ? "Keep indoor priority" : recommendation,
    };
  });
};

const describePositionGroup = (position?: string | null): "skill" | "line" | "hybrid" => {
  if (!position) return "hybrid";
  const normalized = position.trim().toLowerCase();
  const skillSet = ["rb", "wr", "cb", "db", "wr", "lb", "fs", "ss", "slot"];
  const lineSet = ["dl", "ol", "ot", "og", "c"];
  if (skillSet.some((label) => normalized.includes(label))) return "skill";
  if (lineSet.some((label) => normalized.includes(label))) return "line";
  return "hybrid";
};

const buildFairnessGuard = (
  athleteInsights: AthletePlanInsight[],
  roster: { athleteId: string; sex?: string | null; position?: string | null }[],
): FairnessGuardSummary => {
  const map = new Map<string, { sum: number; count: number }>();
  const labelLookup = new Map<string, string>();

  athleteInsights.forEach((insight) => {
    const rosterEntry = roster.find((athlete) => athlete.athleteId === insight.athleteId);
    const sexLabel = (rosterEntry?.sex ?? "unknown").toLowerCase();
    const positionGroup = describePositionGroup(rosterEntry?.position);
    const buckets = [
      `sex:${sexLabel}`,
      `group:${positionGroup}`,
    ];
    buckets.forEach((bucket) => {
      labelLookup.set(bucket, bucket.startsWith("sex:") ? `Sex · ${sexLabel || "n/a"}` : `Role · ${positionGroup}`);
      const existing = map.get(bucket) ?? { sum: 0, count: 0 };
      existing.sum += insight.planConfidence;
      existing.count += 1;
      map.set(bucket, existing);
    });
  });

  const groups = Array.from(map.entries()).map(([key, value]) => ({
    label: labelLookup.get(key) ?? key,
    sampleSize: value.count,
    planConfidence: value.count ? Number((value.sum / value.count).toFixed(2)) : 0,
  }));

  const alerts: string[] = [];
  for (let i = 0; i < groups.length; i++) {
    for (let j = i + 1; j < groups.length; j++) {
      const groupA = groups[i];
      const groupB = groups[j];
      if (!groupA || !groupB) continue;
      const gap = Math.abs(groupA.planConfidence - groupB.planConfidence);
      if (gap >= 0.12) {
        alerts.push(
          `${groupA.label} vs ${groupB.label} gap ${(gap * 100).toFixed(0)}%`,
        );
      }
    }
  }

  return {
    needsIntervention: alerts.length > 0,
    groups,
    alerts,
  };
};

const buildAccessRouter = (
  athleteInsights: AthletePlanInsight[],
  roster: { athleteId: string; displayName: string; position?: string | null; team?: string | null }[],
  simulationContext: SimulationContext,
): AccessRouterSummary => {
  const flagged = athleteInsights
    .filter(
      (athlete) =>
        athlete.riskLevel !== "green" &&
        (simulationContext.environmentFlags.includes("cooling_breaks_15m") || athlete.planConfidence < 0.6),
    )
    .slice(0, 5)
    .map((athlete) => {
      const rosterEntry = roster.find((entry) => entry.athleteId === athlete.athleteId);
      const reason =
        athlete.riskLevel === "red"
          ? "High risk twin (red)"
          : simulationContext.environmentFlags.includes("cooling_breaks_15m")
          ? "Heat index spike"
          : "Low trust capture";
      const recommendedAction =
        athlete.planConfidence < 0.6
          ? "Schedule tele-PT verification"
          : "Route to parish tele-coach for check-in";
      return {
        athleteId: athlete.athleteId,
        displayName: rosterEntry?.displayName ?? athlete.displayName,
        reason,
        recommendedAction,
      };
    });

  const transportDifficulty = simulationContext.environmentFlags.includes("turf_load_monitor")
    ? "Outdoor fields only"
    : undefined;

  return {
    flaggedAthletes: flagged,
    transportDifficulty,
    nextSteps: flagged.length
      ? "Send tele-visit link to flagged athletes; auto-notify parish access coordinator."
      : "No rural routing needed today.",
  };
};

const parseStringArray = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.filter((entry): entry is string => typeof entry === "string");
  }
  if (typeof value === "string" && value.trim().length) {
    return [value];
  }
  return [];
};

const toNextRepCheck = (value: unknown): { required?: boolean; received?: boolean } | null => {
  if (!value || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  return {
    required: typeof record.required === "boolean" ? record.required : undefined,
    received: typeof record.received === "boolean" ? record.received : undefined,
  };
};

const computeTweakImpact = (
  key: string,
  baseDelta: number,
  athleteRiskScore: number,
  context: SimulationContext,
  videoFeatures?: Record<string, unknown>,
): number => {
  const heatMultiplier =
    key === "move_indoor" && context.environmentFlags.includes("cooling_breaks_15m") ? 1.2 : 1;
  const skillMultiplier = athleteRiskScore > 0.6 ? 1.1 : athleteRiskScore > 0.4 ? 1.0 : 0.6;
  const valgusScore = Number(videoFeatures?.last_video_valgus_score_0_3);
  const valgusMultiplier =
    Number.isFinite(valgusScore) && valgusScore >= 2 ? 1.15 : Number.isFinite(valgusScore) ? 1.05 : 1;
  const trunkMultiplier = videoFeatures?.trunk_lean_flag === true ? 1.05 : 1;
  return Number((baseDelta * heatMultiplier * skillMultiplier * valgusMultiplier * trunkMultiplier).toFixed(3));
};

const selectSubstitution = (riskLevel: string): AthletePlanInsight["substitutions"][number] => {
  if (riskLevel === "red") {
    return {
      from: "Full-speed cut drill",
      to: "Tempo plant-to-stick track",
      minutes: 12,
      focus: "Landing control, reduce valgus load",
    };
  }
  if (riskLevel === "yellow") {
    return {
      from: "High-intensity scrimmage",
      to: "Controlled walkthrough with cues",
      minutes: 10,
      focus: "Maintain install, reduce chaotic load",
    };
  }
  return {
    from: "Standard cut progression",
    to: "Movement prep with intent cues",
    minutes: 8,
    focus: "Reinforce good mechanics",
  };
};

const summariseEnvironment = (input: TeamPlannerSimulationInput): SimulationContext => {
  const { temperatureF = 85, humidityPct = 60 } = input.policy;
  const heatIndex = estimateHeatIndex(temperatureF, humidityPct);
  const flags: string[] = [];
  if (heatIndex >= 95) flags.push("cooling_breaks_15m");
  if (input.facility.indoorAvailable) flags.push("indoor_priority");
  if (input.facility.surfacePreference === "turf") flags.push("turf_load_monitor");
  return { environmentFlags: flags, heatIndex };
};

const buildAthleteInsights = (
  athleteRisks: Array<{
    athleteId: string;
    displayName: string;
    position?: string | null;
    riskLevel: string;
    riskTrend?: string | null;
  }>,
  tweaks: RankedTweak[],
  featureMap: Map<string, Record<string, unknown>>,
  cycleMap: Map<
    string,
    {
      shareScope: CycleShareScope;
      lastSharedPhase: string | null;
      lastSharedConfidence: string | null;
    }
  >,
  progressionMap: Map<string, ProgressionState>,
): AthletePlanInsight[] => {
  return athleteRisks.map((athlete) => {
    const riskScore = riskLevelScore(athlete.riskLevel);
    const videoFeatures = featureMap.get(athlete.athleteId);
    const recommendedTweaks = tweaks
      .filter((tweak) => tweak.expectedDelta > 0 && tweak.recommendedFor.includes(athlete.athleteId))
      .map((tweak) => tweak.label);
    const cycleSetting = cycleMap.get(athlete.athleteId);
    let phaseSmart: AthletePlanInsight["phaseSmart"] | undefined;
    if (cycleSetting) {
      if (cycleSetting.shareScope === CycleShareScope.PRIVATE) {
        phaseSmart = { mode: "private" };
      } else if (cycleSetting.shareScope === CycleShareScope.SHARE_LABEL) {
        phaseSmart = {
          mode: "share_label",
          label: cycleSetting.lastSharedPhase ?? undefined,
          confidence: cycleSetting.lastSharedConfidence ?? undefined,
        };
      }
    }
    const progression = progressionMap.get(athlete.athleteId);
    const planConfidence = computePlanConfidence(riskScore, videoFeatures, progression);
    const needsVerification = planConfidence < 0.65 || (riskScore >= 0.45 && planConfidence < 0.75);
    return {
      athleteId: athlete.athleteId,
      displayName: athlete.displayName,
      position: athlete.position,
      riskLevel: athlete.riskLevel,
      riskScore,
      riskTrend: athlete.riskTrend,
      planConfidence,
      needsVerification,
      expectedDelta: Number(
        recommendedTweaks.reduce((sum, _label) => sum + riskScore * 0.05, 0).toFixed(3),
      ),
      recommendedTweaks,
      substitutions: [selectSubstitution(athlete.riskLevel)],
      microPlan: riskScore >= 0.5 ? buildMicroPlan() : undefined,
      nextRepCheck:
        riskScore >= 0.5
          ? {
              required: true,
              focus:
                videoFeatures?.last_video_valgus_score_0_3 && Number(videoFeatures.last_video_valgus_score_0_3) >= 2
                  ? "Verify valgus control after tweaks"
                  : "Capture landing clip post-plan to verify improvement",
            }
          : undefined,
      phaseSmart,
      progression: {
        capacityIndex: progression?.capacityIndex ?? 60,
        consecutiveAGrades: progression?.consecutiveAGrades ?? 0,
        lastProgressionAt: progression?.lastProgressionAt ?? null,
        action: progression?.action ?? "steady",
      },
    };
  });
};

export const simulateTeamPlan = async (
  input: TeamPlannerSimulationInput,
): Promise<TeamPlannerSimulationResult> => {
  const simulationId = randomUUID();
  const sessionDate = input.sessionDate ? new Date(input.sessionDate) : new Date();
  const sessionLength = input.sessionLengthMinutes;

  const teamAthletes = await prisma.athlete.findMany({
    where: { team: input.team },
    include: {
      movementSessions: false,
    },
  });

  const athleteIds = teamAthletes.map((athlete) => athlete.id);
  const featureRecords = await prisma.riskFeatureCache.findMany({
    where: { athleteId: { in: athleteIds } },
  });
  const featureMap = new Map<string, Record<string, unknown>>(
    featureRecords.map((record) => [record.athleteId, (record.features ?? {}) as Record<string, unknown>]),
  );
  const latestRisks = await prisma.riskSnapshot.findMany({
    where: { athleteId: { in: athleteIds } },
    orderBy: [{ recordedFor: "desc" }, { createdAt: "desc" }],
  });
  const cycleSettings = await prisma.cyclePrivacySetting.findMany({
    where: { athleteId: { in: athleteIds } },
  });
  const cycleMap = new Map<string, (typeof cycleSettings)[number]>(
    cycleSettings.map((setting) => [setting.athleteId, setting]),
  );

  const latestRiskByAthlete = new Map<string, (typeof latestRisks)[number]>();
  latestRisks.forEach((snapshot) => {
    if (!latestRiskByAthlete.has(snapshot.athleteId)) {
      latestRiskByAthlete.set(snapshot.athleteId, snapshot);
    }
  });
  const riskMetaMap = new Map<string, { sorenessLevel?: number | null }>();
  latestRisks.forEach((snapshot) => {
    riskMetaMap.set(snapshot.athleteId, {
      sorenessLevel: snapshot.sorenessLevel ?? null,
    });
  });

  const simulationContext = summariseEnvironment(input);

  const tweakKeys = [
    ...input.tweaks,
    ...(input.customTweak?.trim() ? [TWEAK_KEY_CUSTOM] : []),
  ];

  const rankedTweaks: RankedTweak[] = tweakKeys.map((key) => {
    const libraryEntry = DEFAULT_TWEAK_LIBRARY[key];
    const label =
      libraryEntry?.label ?? (input.customTweak?.trim() ? input.customTweak.trim() : "Custom tweak");
    const baseDelta = libraryEntry?.baseDelta ?? 0.05;

    let cumulativeDelta = 0;
    const recommendedFor: string[] = [];

    teamAthletes.forEach((athlete) => {
      const riskSnapshot = latestRiskByAthlete.get(athlete.id);
      const riskLevel = riskSnapshot?.riskLevel ?? "green";
      const riskScore = riskLevelScore(riskLevel);
      if (riskScore < 0.1) return;
      const individualDelta = computeTweakImpact(
        key,
        baseDelta,
        riskScore,
        simulationContext,
        featureMap.get(athlete.id),
      );
      if (individualDelta > 0.01) {
        cumulativeDelta += individualDelta;
        recommendedFor.push(athlete.id);
      }
    });

    const rationale = libraryEntry?.rationale(simulationContext) ?? "Coach-provided adjustment.";

    return {
      key,
      label,
      expectedDelta: Number(cumulativeDelta.toFixed(3)),
      rationale,
      recommendedFor,
    };
  });

  rankedTweaks.sort((a, b) => b.expectedDelta - a.expectedDelta);
  const progressionMap = await refreshAthleteProgressions(athleteIds, riskMetaMap);
  const averageCapacity =
    progressionMap.size > 0
      ? Math.round(
          Array.from(progressionMap.values()).reduce((sum, value) => sum + value.capacityIndex, 0) /
            progressionMap.size,
        )
      : 60;

  const athleteInsights = buildAthleteInsights(
    teamAthletes.map((athlete) => {
      const risk = latestRiskByAthlete.get(athlete.id);
      const riskLevel = risk?.riskLevel ?? "green";
      return {
        athleteId: athlete.id,
        displayName: athlete.displayName,
        position: athlete.position,
        riskLevel,
        riskTrend: risk?.riskTrend,
      };
    }),
    rankedTweaks,
    featureMap,
    cycleMap,
    progressionMap,
  );
  const planConfidence =
    athleteInsights.length > 0
      ? Number(
          (
            athleteInsights.reduce((sum, athlete) => sum + athlete.planConfidence, 0) /
            athleteInsights.length
          ).toFixed(2),
        )
      : 0.75;
  const verificationCandidates = athleteInsights
    .filter((athlete) => athlete.needsVerification)
    .map((athlete) => ({
      athleteId: athlete.athleteId,
      displayName: athlete.displayName,
      planConfidence: athlete.planConfidence,
    }));

  const indoorPreferred =
    simulationContext.environmentFlags.includes("indoor_priority") || input.facility.indoorAvailable;
  const heatClock = buildHeatClock(sessionDate, input.policy.temperatureF, input.policy.humidityPct, indoorPreferred);
  const parishFairness = buildFairnessGuard(
    athleteInsights,
    teamAthletes.map((athlete) => ({
      athleteId: athlete.id,
      sex: athlete.sex,
      position: athlete.position,
    })),
  );
  const accessRouter = buildAccessRouter(
    athleteInsights,
    teamAthletes.map((athlete) => ({
      athleteId: athlete.id,
      displayName: athlete.displayName,
      position: athlete.position,
      team: athlete.team,
    })),
    simulationContext,
  );

  const { blocks, hydrationSchedule, summary } = ensureBlocksFitSession(
    sessionLength,
    input.blocks,
    indoorPreferred,
    averageCapacity,
  );

  const totalExpectedDelta = Number(
    rankedTweaks.reduce((sum, tweak) => sum + tweak.expectedDelta, 0).toFixed(3),
  );

  return {
    simulationId,
    team: input.team,
    generatedAt: new Date().toISOString(),
    input,
    heatClock,
    parishFairness,
    accessRouter,
    planConfidence,
    verificationCandidates,
    environmentFlags: simulationContext.environmentFlags,
    heatIndex: Number(simulationContext.heatIndex.toFixed(1)),
    rankedTweaks,
    athletes: athleteInsights,
    compiledSession: {
      blocks,
      hydrationSchedule,
      summary,
    },
    capacityCurve: {
      averageCapacity,
      nextStep: Array.from(progressionMap.values()).some((value) => value.action === "step_up")
        ? "step_up"
        : Array.from(progressionMap.values()).some((value) => value.action === "deload")
        ? "deload"
        : "steady",
    },
    totalExpectedDelta,
  };
};

export const getCoachTriageQueue = async (team: string): Promise<CoachTriageQueuePayload> => {
  const roster = await prisma.athlete.findMany({
    where: { team },
    select: { id: true, displayName: true },
  });
  if (!roster.length) {
    return { team, refreshedAt: new Date().toISOString(), items: [] };
  }
  const athleteIds = roster.map((athlete) => athlete.id);
  const [snapshots, rehabAssessments] = await Promise.all([
    prisma.riskSnapshot.findMany({
      where: { athleteId: { in: athleteIds } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.rehabAssessment.findMany({
      where: { athleteId: { in: athleteIds } },
      orderBy: { createdAt: "desc" },
    }),
  ]);
  const riskMap = new Map<string, (typeof snapshots)[number]>();
  snapshots.forEach((snapshot) => {
    if (!riskMap.has(snapshot.athleteId)) {
      riskMap.set(snapshot.athleteId, snapshot);
    }
  });
  const rehabMap = new Map<string, (typeof rehabAssessments)[number]>();
  rehabAssessments.forEach((assessment) => {
    if (!rehabMap.has(assessment.athleteId)) {
      rehabMap.set(assessment.athleteId, assessment);
    }
  });
  const items: CoachTriageItem[] = [];
  const nowIso = new Date().toISOString();
  roster.forEach((athlete) => {
    const snapshot = riskMap.get(athlete.id);
    if (snapshot) {
      const nextRep = toNextRepCheck(snapshot.nextRepCheck);
      if (nextRep?.required && nextRep.received !== true) {
        items.push({
          id: `${athlete.id}-lowtrust`,
          athleteId: athlete.id,
          displayName: athlete.displayName,
          severity: "high",
          category: "risk",
          reason: "Low-trust capture — need fresh clip before practice.",
          actionLabel: "Open Movement",
          actionUrl: `/movement?athleteId=${athlete.id}`,
          updatedAt: snapshot.updatedAt?.toISOString?.() ?? nowIso,
        });
      }
      const envFlags = parseStringArray(snapshot.environmentPolicyFlags);
      if (envFlags.some((flag) => flag.includes("cooling") || flag.includes("heat"))) {
        items.push({
          id: `${athlete.id}-heat`,
          athleteId: athlete.id,
          displayName: athlete.displayName,
          severity: "medium",
          category: "environment",
          reason: "Heat override triggered – confirm cooling plan.",
          actionLabel: "Review risk",
          actionUrl: `/risk?athleteId=${athlete.id}`,
          updatedAt: snapshot.updatedAt?.toISOString?.() ?? nowIso,
        });
      }
      if (
        snapshot.recommendationAcknowledged === false &&
        snapshot.changeToday &&
        snapshot.changeToday.length > 0
      ) {
        items.push({
          id: `${athlete.id}-ack`,
          athleteId: athlete.id,
          displayName: athlete.displayName,
          severity: "medium",
          category: "adherence",
          reason: "Coach acknowledgement pending for today's change.",
          actionLabel: "Mark done",
          actionUrl: `/risk?athleteId=${athlete.id}`,
          updatedAt: snapshot.updatedAt?.toISOString?.() ?? nowIso,
        });
      }
      if ((snapshot.riskLevel ?? "").toLowerCase() === "red") {
        items.push({
          id: `${athlete.id}-red`,
          athleteId: athlete.id,
          displayName: athlete.displayName,
          severity: "high",
          category: "risk",
          reason: "Red risk twin — adjust load before kickoff.",
          actionLabel: "Open risk twin",
          actionUrl: `/risk?athleteId=${athlete.id}`,
          updatedAt: snapshot.updatedAt?.toISOString?.() ?? nowIso,
        });
      }
    }
    const rehab = rehabMap.get(athlete.id);
    if (rehab && rehab.cleared === false) {
      items.push({
        id: `${athlete.id}-rehab`,
        athleteId: athlete.id,
        displayName: athlete.displayName,
        severity: "medium",
        category: "rehab",
        reason: `Rehab gate locked (${Math.round(rehab.limbSymmetryScore)}% LSI).`,
        actionLabel: "Review rehab",
        actionUrl: `/dashboard/rehab?athleteId=${athlete.id}`,
        updatedAt: rehab.updatedAt?.toISOString?.() ?? nowIso,
      });
    }
  });
  const severityRank: Record<CoachTriageItem["severity"], number> = {
    high: 0,
    medium: 1,
    low: 2,
  };
  items.sort((a, b) => {
    const severityDiff = severityRank[a.severity] - severityRank[b.severity];
    if (severityDiff !== 0) return severityDiff;
    return b.updatedAt.localeCompare(a.updatedAt);
  });
  return {
    team,
    refreshedAt: new Date().toISOString(),
    items,
  };
};

export const applyTeamPlan = async (
  input: ApplyTeamPlanInput,
  appliedBy?: string,
): Promise<TeamPlanRecord> => {
  const { simulation, selectedTweaks } = input;

  const created = await prisma.teamPlan.create({
    data: {
      team: simulation.team,
      sessionDate: simulation.input.sessionDate ? new Date(simulation.input.sessionDate) : null,
      sessionLength: simulation.input.sessionLengthMinutes,
      constraints: simulation.input as unknown as Prisma.InputJsonValue,
      selectedTweaks: selectedTweaks as unknown as Prisma.InputJsonValue,
      compiledPlan: simulation.compiledSession as unknown as Prisma.InputJsonValue,
      audit: {
        rankedTweaks: simulation.rankedTweaks,
        environmentFlags: simulation.environmentFlags,
        totalExpectedDelta: simulation.totalExpectedDelta,
        generatedAt: simulation.generatedAt,
      } as unknown as Prisma.InputJsonValue,
      appliedBy: appliedBy ?? null,
    },
  });

  await attachPlanMicroPlans(created.id, simulation);
  await logPlannerCaseEvents(created.id, simulation, selectedTweaks);

  return {
    id: created.id,
    team: created.team,
    sessionDate: created.sessionDate?.toISOString?.() ?? null,
    sessionLengthMinutes: created.sessionLength,
    selectedTweaks,
    compiledPlan: simulation.compiledSession,
    createdAt: created.createdAt.toISOString(),
  };
};

const attachPlanMicroPlans = async (planId: string, simulation: TeamPlannerSimulationResult) => {
  const athletesNeedingPlans = simulation.athletes.filter((athlete) => athlete.microPlan);
  if (!athletesNeedingPlans.length) return;

  const sessionDate = simulation.input.sessionDate ? new Date(simulation.input.sessionDate) : new Date();
  const dayStart = new Date(sessionDate);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(dayStart);
  dayEnd.setDate(dayEnd.getDate() + 1);

  const athleteIds = athletesNeedingPlans.map((athlete) => athlete.athleteId);
  const existingSnapshots = await prisma.riskSnapshot.findMany({
    where: {
      athleteId: { in: athleteIds },
      createdAt: { gte: dayStart, lt: dayEnd },
    },
    orderBy: { createdAt: "desc" },
  });

  const latestSnapshotByAthlete = new Map<string, (typeof existingSnapshots)[number]>();
  existingSnapshots.forEach((snapshot) => {
    if (!latestSnapshotByAthlete.has(snapshot.athleteId)) {
      latestSnapshotByAthlete.set(snapshot.athleteId, snapshot);
    }
  });

  const surfacePreference =
    simulation.input.facility.surfacePreference ??
    (simulation.input.facility.indoorAvailable ? "indoor" : "turf");

  for (const athlete of athletesNeedingPlans) {
    const targetSnapshot = latestSnapshotByAthlete.get(athlete.athleteId);
  const microPlanJson = athlete.microPlan
    ? (athlete.microPlan as unknown as Prisma.InputJsonValue)
    : undefined;
  const nextRepCheckJson = athlete.nextRepCheck
    ? (athlete.nextRepCheck as unknown as Prisma.InputJsonValue)
    : undefined;
  if (targetSnapshot) {
    const updateData: Prisma.RiskSnapshotUpdateInput = {
      recommendationAcknowledged: false,
      adherence0to1: null,
      sourcePlanId: planId,
      sourceSimulationId: simulation.simulationId,
    };
    if (microPlanJson) {
      updateData.microPlan = microPlanJson;
    }
    if (nextRepCheckJson) {
      updateData.nextRepCheck = nextRepCheckJson;
    }
    await prisma.riskSnapshot.update({
      where: { id: targetSnapshot.id },
      data: updateData,
    });
    continue;
  }

  await prisma.riskSnapshot.create({
    data: {
      athleteId: athlete.athleteId,
        exposureMinutes: simulation.input.sessionLengthMinutes,
        surface: surfacePreference,
        temperatureF: simulation.input.policy.temperatureF ?? 85,
        humidityPct: simulation.input.policy.humidityPct ?? 60,
        priorLowerExtremityInjury: false,
        sorenessLevel: 0,
        fatigueLevel: 0,
        recordedFor: sessionDate,
        riskLevel: athlete.riskLevel,
        riskTrend: athlete.riskTrend ?? null,
        rationale: `Practice micro-plan generated via Team Planner ${simulation.simulationId}`,
        changeToday: "Execute assigned practice micro-plan.",
      microPlan: microPlanJson,
      nextRepCheck: nextRepCheckJson,
      recommendationAcknowledged: false,
      sourcePlanId: planId,
      sourceSimulationId: simulation.simulationId,
    },
  });
  }
};

const logPlannerCaseEvents = async (
  planId: string,
  simulation: TeamPlannerSimulationResult,
  selectedTweaks: string[],
) => {
  const tweakSummary = selectedTweaks.length ? selectedTweaks.join(", ") : "No tweaks";
  await Promise.all(
    simulation.athletes
      .filter((athlete) => athlete.expectedDelta > 0 || athlete.recommendedTweaks.length > 0)
      .map(async (athlete) => {
        try {
          await createAutomationCaseEvent(
            athlete.athleteId,
            {
              eventType: "planner",
              title: `Plan published (${simulation.team})`,
              summary: `${tweakSummary} · Δ${athlete.expectedDelta.toFixed(2)}`,
              trustGrade: "B",
              nextAction: athlete.recommendedTweaks[0],
              metadata: {
                expectedDelta: athlete.expectedDelta,
                recommendedTweaks: athlete.recommendedTweaks,
                planId,
              },
            },
            {
              team: simulation.team,
              actor: { role: "Planner" },
            },
          );
        } catch (error) {
          console.warn("Failed to log planner case event", error);
        }
      }),
  );
};

export const compilePracticePlan = async (team: string): Promise<PracticeCompilerPayload> => {
  const planRecord = await prisma.teamPlan.findFirst({
    where: { team },
    orderBy: { createdAt: "desc" },
  });
  if (!planRecord) {
    throw new Error("No published plan found for this team.");
  }
  const compiled = (planRecord.compiledPlan ?? {}) as unknown as TeamPlannerSimulationResult["compiledSession"];
  const blocks = Array.isArray(compiled?.blocks) ? compiled.blocks : [];
  const hydrationCalls = Array.isArray(compiled?.hydrationSchedule) ? compiled.hydrationSchedule : [];
  const blockSummaries = blocks.map((block) => ({
    name: block.name,
    location: block.location,
    minutes: block.minutes,
    focus: block.focus,
    difficultyIndex: block.difficultyIndex,
  }));
  const script = blockSummaries
    .map(
      (block, index) =>
        `${index + 1}. ${block.name} (${block.location}, ${block.minutes} min): ${block.focus}`,
    )
    .join("\n");
  return {
    planId: planRecord.id,
    team: planRecord.team,
    sessionDate: planRecord.sessionDate?.toISOString?.() ?? null,
    summary: compiled?.summary ?? "Compiled practice session",
    script,
    shareCode: planRecord.id.slice(-6).toUpperCase(),
    hydrationCalls,
    blocks: blockSummaries,
    generatedAt: new Date().toISOString(),
  };
};

export const getLatestTeamPlan = async (team: string): Promise<TeamPlanRecord | null> => {
  const record = await prisma.teamPlan.findFirst({
    where: { team },
    orderBy: { createdAt: "desc" },
  });
  if (!record) return null;
  return {
    id: record.id,
    team: record.team,
    sessionDate: record.sessionDate?.toISOString?.() ?? null,
    sessionLengthMinutes: record.sessionLength,
    selectedTweaks: (record.selectedTweaks ?? []) as unknown as string[],
    compiledPlan: (record.compiledPlan ?? {}) as unknown as TeamPlannerSimulationResult["compiledSession"],
    createdAt: record.createdAt.toISOString(),
  };
};
