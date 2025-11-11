export interface LimbSymmetryMetrics {
  hopDistance: number;
  tripleHopDistance: number;
  squatDepth?: number;
  notes?: string;
}

export interface StrengthMetrics {
  quad: number;
  hamstring: number;
  glute?: number;
  units: "lbs" | "kgs" | "n";
}

export interface RehabAssessmentInput {
  athleteId: string;
  surgicalSide: "left" | "right";
  sessionDate?: string;
  videos: Array<{
    id: string;
    testType: "single_leg_hop" | "triple_hop" | "squat" | "lunge";
    url: string;
    capturedAt: string;
  }>;
  limbSymmetry?: {
    injured: LimbSymmetryMetrics;
    healthy: LimbSymmetryMetrics;
  };
  strength?: {
    injured: StrengthMetrics;
    healthy: StrengthMetrics;
  };
  crossoverHop?: {
    injuredDistance: number;
    healthyDistance: number;
  };
  yBalance?: {
    injuredComposite: number;
    healthyComposite: number;
  };
  psychological?: {
    aclRsiScore: number; // 0-100
  };
  strengthToBw?: number;
}

export type RehabFormGrade = "A" | "B" | "C";

export interface RehabAssessmentResult {
  rehabAssessmentId: string;
  athleteId: string;
  cleared: boolean;
  limbSymmetryScore: number;
  concerns: string[];
  recommendedExercises: string[];
  parentSummary: string;
  athleteSummary: string;
  clinicianNotes: string;
  generatedAt: string;
  rawModelOutput?: unknown;
  formGrade: RehabFormGrade;
  formCue: string;
}

export type RtsGateCategory = "hop" | "strength" | "balance" | "psych";
export type RtsTrustGrade = "A" | "B" | "C";

export interface RtsGateMetric {
  id: string;
  label: string;
  category: RtsGateCategory;
  units: string;
  scale: "percent" | "ratio";
  latest: number;
  best: number;
  monthAgo: number;
  target: number;
  trust: RtsTrustGrade;
  variance: number;
  notes: string;
  status: "pass" | "fail";
  driftLocked: boolean;
  driftPercent: number;
}

export interface RtsGateSummary {
  athleteId: string;
  sport: "pivot" | "non_pivot";
  sex: "female" | "male";
  age: number;
  ready: boolean;
  progressPct: number;
  gatesRemaining: number;
  explanation: string;
  cameraHint: string;
  receiptUrl: string | null;
  gates: RtsGateMetric[];
}
