import { MicroDrill } from "./risk";

export interface PlannerBlockConstraint {
  name: string;
  minMinutes: number;
  maxMinutes: number;
}

export interface PlannerFacilityConstraints {
  indoorAvailable: boolean;
  surfacePreference?: "indoor" | "turf" | "grass";
}

export interface PlannerPolicyConstraints {
  hydrationIntervalMinutes?: number;
  maxCuttingDensity?: number;
  temperatureF?: number;
  humidityPct?: number;
}

export interface TeamPlannerSimulationInput {
  team: string;
  sessionLengthMinutes: number;
  sessionDate?: string;
  blocks: PlannerBlockConstraint[];
  facility: PlannerFacilityConstraints;
  policy: PlannerPolicyConstraints;
  tweaks: string[];
  customTweak?: string;
}

export interface RankedTweak {
  key: string;
  label: string;
  expectedDelta: number;
  rationale: string;
  recommendedFor: string[];
}

export interface AthletePlanInsight {
  athleteId: string;
  displayName: string;
  position?: string | null;
  riskLevel: string;
  riskScore: number;
  riskTrend?: string | null;
  expectedDelta: number;
  recommendedTweaks: string[];
  substitutions: Array<{
    from: string;
    to: string;
    minutes: number;
    focus: string;
  }>;
  microPlan?: {
    drills: MicroDrill[];
  };
  nextRepCheck?: {
    required: boolean;
    focus: string;
  };
}

export interface CompiledSessionBlock {
  name: string;
  minutes: number;
  location: "indoor" | "turf" | "grass";
  focus: string;
  hydrationBreak?: boolean;
}

export interface TeamPlannerSimulationResult {
  team: string;
  generatedAt: string;
  input: TeamPlannerSimulationInput;
  environmentFlags: string[];
  heatIndex?: number;
  rankedTweaks: RankedTweak[];
  athletes: AthletePlanInsight[];
  compiledSession: {
    blocks: CompiledSessionBlock[];
    hydrationSchedule: number[];
    summary: string;
  };
  totalExpectedDelta: number;
}

export interface ApplyTeamPlanInput {
  simulation: TeamPlannerSimulationResult;
  selectedTweaks: string[];
}

export interface TeamPlanRecord {
  id: string;
  team: string;
  sessionDate?: string | null;
  sessionLengthMinutes: number;
  selectedTweaks: string[];
  compiledPlan: TeamPlannerSimulationResult["compiledSession"];
  createdAt: string;
}
