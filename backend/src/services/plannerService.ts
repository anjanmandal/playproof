import { prisma } from "../db/prisma";
import { MicroDrill, RiskLevel } from "../types/risk";
import {
  ApplyTeamPlanInput,
  AthletePlanInsight,
  CompiledSessionBlock,
  RankedTweak,
  TeamPlanRecord,
  TeamPlannerSimulationInput,
  TeamPlannerSimulationResult,
} from "../types/planner";
import { estimateHeatIndex } from "../utils/plannerHeuristics";
import { Prisma } from "../generated/prisma/client";

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

interface SimulationContext {
  environmentFlags: string[];
  heatIndex: number;
}

const TWEAK_KEY_CUSTOM = "custom_tweak";

const ensureBlocksFitSession = (
  sessionLength: number,
  blocks: TeamPlannerSimulationInput["blocks"],
  indoorPreferred: boolean,
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
    return { name: block.name, minutes, location, focus };
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
): AthletePlanInsight[] => {
  return athleteRisks.map((athlete) => {
    const riskScore = riskLevelScore(athlete.riskLevel);
    const videoFeatures = featureMap.get(athlete.athleteId);
    const recommendedTweaks = tweaks
      .filter((tweak) => tweak.expectedDelta > 0 && tweak.recommendedFor.includes(athlete.athleteId))
      .map((tweak) => tweak.label);
    return {
      athleteId: athlete.athleteId,
      displayName: athlete.displayName,
      position: athlete.position,
      riskLevel: athlete.riskLevel,
      riskScore,
      riskTrend: athlete.riskTrend,
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
    };
  });
};

export const simulateTeamPlan = async (
  input: TeamPlannerSimulationInput,
): Promise<TeamPlannerSimulationResult> => {
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

  const latestRiskByAthlete = new Map<string, (typeof latestRisks)[number]>();
  latestRisks.forEach((snapshot) => {
    if (!latestRiskByAthlete.has(snapshot.athleteId)) {
      latestRiskByAthlete.set(snapshot.athleteId, snapshot);
    }
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
  );

  const indoorPreferred =
    simulationContext.environmentFlags.includes("indoor_priority") || input.facility.indoorAvailable;

  const { blocks, hydrationSchedule, summary } = ensureBlocksFitSession(
    sessionLength,
    input.blocks,
    indoorPreferred,
  );

  const totalExpectedDelta = Number(
    rankedTweaks.reduce((sum, tweak) => sum + tweak.expectedDelta, 0).toFixed(3),
  );

  return {
    team: input.team,
    generatedAt: new Date().toISOString(),
    input,
    environmentFlags: simulationContext.environmentFlags,
    heatIndex: Number(simulationContext.heatIndex.toFixed(1)),
    rankedTweaks,
    athletes: athleteInsights,
    compiledSession: {
      blocks,
      hydrationSchedule,
      summary,
    },
    totalExpectedDelta,
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
