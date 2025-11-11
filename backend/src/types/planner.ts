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

export type ProgressAction = "step_up" | "deload" | "steady";

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

export type HeatClockStatus = "safe" | "caution" | "danger";

export interface HeatClockEntry {
  time: string;
  heatIndex: number;
  status: HeatClockStatus;
  recommendation: string;
}

export interface FairnessGuardGroup {
  label: string;
  sampleSize: number;
  planConfidence: number;
}

export interface FairnessGuardSummary {
  needsIntervention: boolean;
  groups: FairnessGuardGroup[];
  alerts: string[];
}

export interface AccessRouterRecommendation {
  athleteId: string;
  displayName: string;
  reason: string;
  recommendedAction: string;
}

export interface AccessRouterSummary {
  flaggedAthletes: AccessRouterRecommendation[];
  transportDifficulty?: string;
  nextSteps: string;
}

export interface AthletePlanInsight {
  athleteId: string;
  displayName: string;
  position?: string | null;
  riskLevel: string;
  riskScore: number;
  riskTrend?: string | null;
  planConfidence: number;
  needsVerification: boolean;
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
  phaseSmart?: {
    mode: "private" | "share_label";
    label?: string | null;
    confidence?: string | null;
  };
  progression: {
    capacityIndex: number;
    consecutiveAGrades: number;
    lastProgressionAt?: string | null;
    action: ProgressAction;
  };
}

export interface CompiledSessionBlock {
  name: string;
  minutes: number;
  location: "indoor" | "turf" | "grass";
  focus: string;
  hydrationBreak?: boolean;
  difficultyIndex?: number;
}

export interface CapacityCurve {
  averageCapacity: number;
  nextStep: ProgressAction;
}

export interface TeamPlannerSimulationResult {
  simulationId: string;
  team: string;
  generatedAt: string;
  input: TeamPlannerSimulationInput;
  heatClock: HeatClockEntry[];
  parishFairness: FairnessGuardSummary;
  accessRouter: AccessRouterSummary;
  planConfidence: number;
  verificationCandidates: Array<{
    athleteId: string;
    displayName: string;
    planConfidence: number;
  }>;
  environmentFlags: string[];
  heatIndex?: number;
  rankedTweaks: RankedTweak[];
  athletes: AthletePlanInsight[];
  compiledSession: {
    blocks: CompiledSessionBlock[];
    hydrationSchedule: number[];
    summary: string;
  };
  capacityCurve: CapacityCurve;
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

export type CoachTriageSeverity = "high" | "medium" | "low";
export type CoachTriageCategory = "risk" | "rehab" | "environment" | "adherence";

export interface CoachTriageItem {
  id: string;
  athleteId: string;
  displayName: string;
  severity: CoachTriageSeverity;
  category: CoachTriageCategory;
  reason: string;
  actionLabel: string;
  actionUrl: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
}

export interface CoachTriageQueuePayload {
  team: string;
  refreshedAt: string;
  items: CoachTriageItem[];
}

export interface PracticeCompilerPayload {
  planId: string;
  team: string;
  sessionDate?: string | null;
  summary: string;
  script: string;
  shareCode: string;
  hydrationCalls: number[];
  blocks: Array<{
    name: string;
    location: "indoor" | "turf" | "grass";
    minutes: number;
    focus: string;
    difficultyIndex?: number;
  }>;
  generatedAt: string;
}
