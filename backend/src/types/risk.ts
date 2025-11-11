export interface DailyRiskInput {
  athleteId: string;
  athleteName?: string;
  recordedFor?: string;
  exposureMinutes: number;
  surface: "turf" | "grass" | "wet_grass" | "indoor" | "court";
  temperatureF: number;
  humidityPct: number;
  priorLowerExtremityInjury: boolean;
  sorenessLevel: 0 | 1 | 2 | 3;
  fatigueLevel: 0 | 1 | 2 | 3;
  bodyWeightTrend?: "up" | "down" | "stable";
  menstrualPhase?: "follicular" | "ovulatory" | "luteal" | "menstrual" | "unspecified";
  notes?: string;
  wearableFeatures?: Array<{
    contactMs?: number;
    stabilityMs?: number;
    valgusIdx0to3?: number;
    asymmetryPct?: number;
    confidence0to1?: number;
  }>;
}

export type RiskLevel = "green" | "yellow" | "red";
export type RiskTrend = "up" | "flat" | "down";

export interface MicroDrill {
  name: string;
  sets: number;
  reps: number;
  rest_s: number;
}

export interface RiskMicroPlan {
  focus?: string;
  phase?: "landing_control" | "frontal_plane_control" | "asymmetry" | "power";
  progression?: "build" | "maintain" | "deload";
  durationMinutes?: number;
  expectedMinutes?: number;
  drills: MicroDrill[];
}

export interface NextRepCheck {
  required: boolean;
  received: boolean;
  result?: "better" | "same" | "worse";
}

export interface DailyRiskRecommendation {
  snapshotId: string;
  athleteId: string;
  riskLevel: RiskLevel;
  rationale: string;
  changeToday: string;
  generatedAt: string;
  rawModelOutput?: unknown;
  riskTrend?: RiskTrend;
  uncertainty0to1?: number;
  drivers?: string[];
  driverScores?: Record<string, number>;
  microPlan?: RiskMicroPlan;
  adherence0to1?: number;
  nextRepCheck?: NextRepCheck;
  cohortPercentile0to100?: number;
  environmentPolicyFlags?: string[];
}
