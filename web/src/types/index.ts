export type Role = 'ATHLETE' | 'COACH' | 'AT_PT' | 'PARENT' | 'ADMIN';

export interface AuthUser {
  id: string;
  email: string;
  role: Role;
  athleteId?: string | null;
  teams?: string[];
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export type DrillType = 'drop_jump' | 'planned_cut' | 'unplanned_cut';

export type MovementVerdict = 'pass' | 'fix' | 'retake' | 'needs_review';

export interface MovementBandWindow {
  metric: string;
  label?: string;
  current?: number | null;
  targetLow?: number | null;
  targetHigh?: number | null;
  delta?: number | null;
  units?: string;
  status: 'inside' | 'outside';
  zScore?: number | null;
}

export interface MovementMicroPlan {
  focus?: string;
  drills: MicroDrill[];
  durationMinutes?: number;
  quickAssignAvailable?: boolean;
  phase?: 'landing_control' | 'frontal_plane_control' | 'asymmetry' | 'power';
  progression?: 'build' | 'maintain' | 'deload';
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
    label?: 'low' | 'medium' | 'high';
    fixInstructions?: string | null;
    retryRecommended?: boolean;
  };
  cue?: string | null;
  metrics?: Record<string, number | boolean | null>;
  baselineBand?: Record<string, unknown> | null;
  uncertainty0to1?: number | null;
  microPlan?: MovementMicroPlan;
  fixAssigned?: boolean;
  completion?: MovementMicroPlan['completion'];
  proofAt: string;
}

export interface MovementFrame {
  id: string;
  snapshotUrl: string;
  label?: string | null;
  capturedAt: string;
  frameIndex?: number | null;
}

export type MovementRiskSeverity = 'low' | 'moderate' | 'high';

export interface MovementOverview {
  headline: string;
  summary: string;
  confidence?: number | null;
}

export interface MovementRiskSignal {
  label: string;
  severity: MovementRiskSeverity;
  evidence: string;
}

export interface MovementCoachingPlan {
  immediateCue: string;
  practiceFocus: string;
  monitoring: string;
}

export interface MovementPhaseScore {
  quality0to3?: number | null;
  notes?: string | null;
  riskDriver?: string | null;
  timeToStableMs?: number | null;
}

export interface MovementPhaseScores {
  prep?: MovementPhaseScore;
  takeoff?: MovementPhaseScore;
  firstContact?: MovementPhaseScore;
  stabilization?: MovementPhaseScore;
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

export interface MovementOverlayInstruction {
  overlayType: string;
  label?: string;
  description?: string;
  instructions?: string;
  severity?: MovementRiskSeverity;
  bandStatus?: 'inside' | 'outside';
  metrics?: Record<string, number | null>;
  visualization?: Array<Record<string, unknown>>;
  beforeImageUrl?: string | null;
  afterImageUrl?: string | null;
  comparisonLabel?: string | null;
}

export interface MovementAssessment {
  id: string;
  athleteId: string;
  drillType: DrillType;
  sessionId?: string | null;
  riskRating: number;
  cues: string[];
  metrics: {
    kneeValgusScore: number;
    trunkLeanOutsideBOS: boolean;
    footPlantOutsideCOM: boolean;
  };
  context?: Record<string, unknown> | null;
  createdAt: string;
  updatedAt?: string;
  frames?: MovementFrame[];
  overview?: MovementOverview | null;
  riskSignals?: MovementRiskSignal[] | null;
  coachingPlan?: MovementCoachingPlan | null;
  phaseScores?: MovementPhaseScores | null;
  timeToStableMs?: number | null;
  groundContactTimeMs?: number | null;
  peakRiskPhase?: string | null;
  viewQuality?: ViewQualityAssessment | null;
  counterfactual?: CounterfactualPlan | null;
  asymmetryIndex0to100?: number | null;
  deltaFromBaseline?: Record<string, number> | null;
  overlays?: MovementOverlayInstruction[] | null;
  rawModelOutput?: unknown;
  verdict?: MovementVerdict;
  verdictReason?: string;
  bandSummary?: MovementBandWindow[];
  microPlan?: MovementMicroPlan | null;
  uncertainty0to1?: number | null;
  proof?: MovementProofSummary;
}

export interface MovementAssessmentInput {
  athleteId: string;
  drillType: DrillType;
  sessionId?: string;
  context?: Record<string, unknown>;
  frames: Array<{
    id: string;
    url: string;
    label?: string;
    capturedAt: string;
  }>;
}

export type RiskLevel = 'green' | 'yellow' | 'red';
export type RiskTrend = 'up' | 'flat' | 'down';

export interface MicroDrill {
  name: string;
  sets: number;
  reps: number;
  rest_s: number;
}

export interface NextRepCheck {
  required: boolean;
  received: boolean;
  result?: 'better' | 'same' | 'worse';
}

export interface MicroPlan {
  drills: MicroDrill[];
}

export interface RiskSnapshot {
  id: string;
  athleteId: string;
  exposureMinutes: number;
  surface: string;
  temperatureF: number;
  humidityPct: number;
  priorLowerExtremityInjury: boolean;
  sorenessLevel: number;
  fatigueLevel: number;
  bodyWeightTrend?: string | null;
  menstrualPhase?: string | null;
  notes?: string | null;
  recordedFor?: string | null;
  riskLevel: RiskLevel;
  rationale: string;
  changeToday: string;
  createdAt: string;
  updatedAt?: string;
  recommendationAcknowledged: boolean;
  riskTrend?: RiskTrend | null;
  uncertainty0to1?: number | null;
  drivers?: string[];
  driverScores?: Record<string, number>;
  microPlan?: MicroPlan;
  adherence0to1?: number | null;
  nextRepCheck?: NextRepCheck;
  cohortPercentile0to100?: number | null;
  environmentPolicyFlags?: string[];
}

export interface TeamRiskSnapshot extends RiskSnapshot {
  athlete?: {
    id: string;
    displayName: string;
    position?: string | null;
    team?: string | null;
  };
}

export interface DailyRiskInput {
  athleteId: string;
  athleteName?: string;
  recordedFor?: string;
  exposureMinutes: number;
  surface: 'turf' | 'grass' | 'wet_grass' | 'indoor' | 'court';
  temperatureF: number;
  humidityPct: number;
  priorLowerExtremityInjury: boolean;
  sorenessLevel: 0 | 1 | 2 | 3;
  fatigueLevel: 0 | 1 | 2 | 3;
  bodyWeightTrend?: 'up' | 'down' | 'stable';
  menstrualPhase?: 'follicular' | 'ovulatory' | 'luteal' | 'menstrual' | 'unspecified';
  notes?: string;
}

export interface DailyRiskResponse {
  snapshotId: string;
  athleteId: string;
  riskLevel: RiskLevel;
  riskTrend?: RiskTrend;
  uncertainty0to1?: number;
  drivers?: string[];
  driverScores?: Record<string, number>;
  rationale: string;
  changeToday: string;
  microPlan?: MicroPlan;
  adherence0to1?: number;
  nextRepCheck?: NextRepCheck;
  cohortPercentile0to100?: number;
  environmentPolicyFlags?: string[];
  generatedAt: string;
}

export interface PlannerBlockConstraint {
  name: string;
  minMinutes: number;
  maxMinutes: number;
}

export interface PlannerFacilityConstraints {
  indoorAvailable: boolean;
  surfacePreference?: 'indoor' | 'turf' | 'grass';
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
  location: 'indoor' | 'turf' | 'grass';
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

export interface TeamPlanRecord {
  id: string;
  team: string;
  sessionDate?: string | null;
  sessionLengthMinutes: number;
  selectedTweaks: string[];
  compiledPlan: TeamPlannerSimulationResult['compiledSession'];
  createdAt: string;
}

export type RehabTestType = 'single_leg_hop' | 'triple_hop' | 'squat' | 'lunge';

export interface RehabAssessmentVideo {
  id: string;
  url: string;
  testType: RehabTestType;
  capturedAt: string;
}

export interface RehabAssessmentRecord {
  id: string;
  athleteId: string;
  surgicalSide: 'left' | 'right';
  sessionDate?: string | null;
  limbSymmetryScore: number;
  cleared: boolean;
  concerns: string[];
  recommendedExercises: string[];
  athleteSummary: string;
  parentSummary: string;
  clinicianNotes: string;
  createdAt: string;
  videos?: RehabAssessmentVideo[];
}

export interface RehabAssessmentInput {
  athleteId: string;
  surgicalSide: 'left' | 'right';
  sessionDate?: string;
  videos: Array<{
    id: string;
    testType: RehabTestType;
    url: string;
    capturedAt: string;
  }>;
  limbSymmetry?: {
    injured: {
      hopDistance: number;
      tripleHopDistance: number;
      squatDepth?: number;
      notes?: string;
    };
    healthy: {
      hopDistance: number;
      tripleHopDistance: number;
      squatDepth?: number;
      notes?: string;
    };
  };
  strength?: {
    injured: {
      quad: number;
      hamstring: number;
      glute?: number;
      units: 'lbs' | 'kgs' | 'n';
    };
    healthy: {
      quad: number;
      hamstring: number;
      glute?: number;
      units: 'lbs' | 'kgs' | 'n';
    };
  };
}

export interface AthleteSummary {
  id: string;
  displayName: string;
  jerseyNumber?: string | null;
  sport?: string | null;
  position?: string | null;
  team?: string | null;
  sex?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface AthleteDashboard extends AthleteSummary {
  movementSessions?: MovementAssessment[];
  riskSnapshots?: RiskSnapshot[];
  rehabAssessments?: RehabAssessmentRecord[];
}

export interface AudienceRewriteInput {
  assessmentId: string;
  baselineMessage: string;
  audience: 'coach' | 'athlete' | 'parent' | 'at_pt';
  tone?: 'technical' | 'supportive' | 'motivational';
}

export interface AudienceRewriteResponse {
  id: string;
  assessmentId?: string;
  rewritten: string;
  audience: AudienceRewriteInput['audience'];
  tone?: AudienceRewriteInput['tone'];
  createdAt: string;
}
