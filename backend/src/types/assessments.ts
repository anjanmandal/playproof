import { MicroDrill } from "./risk";

export type DrillType = "drop_jump" | "planned_cut" | "unplanned_cut";

export type MovementVerdict = "pass" | "fix" | "retake" | "needs_review";

export interface MovementBandWindow {
  metric: string;
  label?: string;
  current?: number | null;
  targetLow?: number | null;
  targetHigh?: number | null;
  delta?: number | null;
  units?: string;
  status: "inside" | "outside";
  zScore?: number | null;
}

export interface MovementMicroPlan {
  focus?: string;
  drills: MicroDrill[];
  durationMinutes?: number;
  quickAssignAvailable?: boolean;
  phase?: "landing_control" | "frontal_plane_control" | "asymmetry" | "power";
  progression?: "build" | "maintain" | "deload";
  expectedMinutes?: number;
  completion?: {
    completed: boolean;
    completedAt?: string;
    rpe?: number | null;
    pain?: number | null;
  };
}

export interface MovementProofSummary {
  id: string;
  verdict: MovementVerdict;
  verdictReason?: string;
  withinBand?: boolean;
  band?: MovementBandWindow[];
  viewQuality?: {
    score0to1?: number | null;
    label?: "low" | "medium" | "high";
    fixInstructions?: string | null;
    retryRecommended?: boolean;
  };
  cue?: string | null;
  metrics?: Record<string, number | boolean | null>;
  baselineBand?: Record<string, unknown> | null;
  uncertainty0to1?: number | null;
  microPlan?: MovementMicroPlan;
  fixAssigned?: boolean;
  completion?: MovementMicroPlan["completion"];
  proofAt: string;
}

export interface FrameSnapshot {
  id: string;
  url: string;
  label?: string;
  capturedAt: string;
}

export interface MovementAssessmentInput {
  athleteId: string;
  drillType: DrillType;
  sessionId?: string;
  context?: {
    surface?: string;
    environment?: string;
    temperatureF?: number;
    humidityPct?: number;
    notes?: string;
    athleteProfile?: {
      name?: string;
      sex?: "male" | "female" | "nonbinary";
      position?: string;
      level?: string;
      age?: number;
    };
  };
  frames: FrameSnapshot[];
}

export interface MovementAssessmentResult {
  assessmentId: string;
  athleteId: string;
  drillType: DrillType;
  riskRating: number;
  cues: string[];
  metrics: {
    kneeValgusScore: number;
    trunkLeanOutsideBOS: boolean;
    footPlantOutsideCOM: boolean;
  };
  overview?: {
    headline: string;
    summary: string;
    confidence?: number;
  };
  riskSignals?: Array<{
    label: string;
    severity: "low" | "moderate" | "high";
    evidence: string;
  }>;
  coachingPlan?: {
    immediateCue: string;
    practiceFocus: string;
    monitoring: string;
  };
  phaseScores?: {
    prep?: PhaseScore;
    takeoff?: PhaseScore;
    firstContact?: PhaseScore;
    stabilization?: PhaseScore;
  };
  timeToStableMs?: number;
  groundContactTimeMs?: number;
  peakRiskPhase?: string;
  viewQuality?: ViewQualityAssessment;
  counterfactual?: CounterfactualPlan;
  asymmetryIndex0to100?: number;
  deltaFromBaseline?: Record<string, number> | null;
  overlays?: Array<OverlayInstruction>;
  frames?: FrameSnapshot[];
  context?: MovementAssessmentInput["context"];
  generatedAt: string;
  rawModelOutput?: unknown;
  verdict?: MovementVerdict;
  verdictReason?: string;
  bandSummary?: MovementBandWindow[];
  microPlan?: MovementMicroPlan;
  uncertainty0to1?: number;
  proof?: MovementProofSummary;
}

export interface PhaseScore {
  quality0to3?: number | null;
  notes?: string | null;
  riskDriver?: string | null;
  timeToStableMs?: number | null;
}

export interface ViewQualityAssessment {
  score0to1: number;
  fixInstructions?: string | null;
  retryRecommended?: boolean;
}

export interface CounterfactualPlan {
  tweak: string;
  predictedRiskDrop: number;
  nextRepVerify: boolean;
  summary?: string;
}

export interface OverlayInstruction {
  overlayType: string;
  label?: string;
  description?: string;
  instructions?: string;
  severity?: "low" | "moderate" | "high";
  bandStatus?: "inside" | "outside";
  metrics?: Record<string, number | null>;
  visualization?: Array<Record<string, unknown>>;
  beforeImageUrl?: string | null;
  afterImageUrl?: string | null;
  comparisonLabel?: string | null;
}
