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
  sourcePlanId?: string | null;
  sourceSimulationId?: string | null;
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

export type HeatClockStatus = 'safe' | 'caution' | 'danger';

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
    mode: Exclude<ShareScope, 'off'>;
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
  location: 'indoor' | 'turf' | 'grass';
  focus: string;
  hydrationBreak?: boolean;
  difficultyIndex?: number;
}

export type ProgressAction = 'step_up' | 'deload' | 'steady';

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

export interface TeamPlanRecord {
  id: string;
  team: string;
  sessionDate?: string | null;
  sessionLengthMinutes: number;
  selectedTweaks: string[];
  compiledPlan: TeamPlannerSimulationResult['compiledSession'];
  createdAt: string;
}

export type CoachTriageSeverity = 'high' | 'medium' | 'low';
export type CoachTriageCategory = 'risk' | 'rehab' | 'environment' | 'adherence';

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
    location: 'indoor' | 'turf' | 'grass';
    minutes: number;
    focus: string;
    difficultyIndex?: number;
  }>;
  generatedAt: string;
}

export interface CaseEvent {
  id: string;
  athleteId: string;
  team?: string | null;
  eventType: string;
  title: string;
  summary?: string | null;
  trustGrade?: string | null;
  role: string;
  actorId?: string | null;
  actorName?: string | null;
  pinned: boolean;
  nextAction?: string | null;
  attachments?: Record<string, unknown> | null;
  metadata?: Record<string, unknown> | null;
  mentions?: string[] | null;
  consentFlag?: string | null;
  visibility?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CaseChannelResponse {
  events: CaseEvent[];
  pinnedNextAction: CaseEvent | null;
  availableTypes: string[];
  availableRoles: string[];
}

export interface EvidencePackResponse {
  evidenceId: string;
  downloadUrl: string;
  viewerLogUrl: string;
  expiresAt: string;
}

export interface EvidenceViewLogEntry {
  id: string;
  viewer: string;
  viewedAt: string;
}

export interface EvidenceCard {
  id: string;
  title: string;
  takeaway: string;
  bullets: string[];
  limitations: string[];
  citations: Array<{
    title: string;
    authors: string;
    year: number;
    doi?: string;
    url?: string;
    levelOfEvidence: string;
  }>;
}

export interface ResearchPaper {
  paperId: string;
  title: string;
  journal: string;
  year: number;
  authors: string;
  abstract: string;
  doi?: string;
  tags: string[];
  levelOfEvidence: string;
  impactTag: string;
}

export interface HomeSessionPlanBlock {
  key: string;
  title: string;
  focus: string;
  sets: number;
  reps: number;
  minutes: number;
  intensity: string;
  cues: string;
}

export interface HomeSessionPlanResponse {
  athleteId: string;
  blocks: HomeSessionPlanBlock[];
  context: {
    formGrade: 'A' | 'B' | 'C';
    formCue: string;
    limbSymmetryScore: number | null;
    lastAssessmentAt: string | null;
    planSoftened: boolean;
    sorenessSource: number;
    sorenessAuto: number | null;
  };
  completion: {
    targetMinutes: number;
    rescueAvailable: boolean;
  };
  verification: {
    metricsOnly: boolean;
    confidence: number;
  };
  streak: {
    days: number;
  };
  proofs: Record<
    string,
    {
      clipUrl: string;
      capturedAt: string;
    }
  >;
  insights?: {
    summary: string;
    timestamp: string;
  };
}

export interface WearableInsightMetrics {
  valgus: number;
  impact: number;
  decel: number;
  asymmetry: number;
  cutDensity: number;
  playerLoad: number;
  frameRate: number;
  motionQuality: number;
  bleStrength: number;
  trust: 'A' | 'B' | 'C';
}

export interface WearableDeviceSnapshot {
  id: string;
  role: string;
  label: string;
  paired: boolean;
  streaming: boolean;
  battery: number;
  firmware?: string;
}

export interface WearableInsightRequest {
  athleteId?: string;
  metrics: WearableInsightMetrics;
  devices: WearableDeviceSnapshot[];
}

export interface WearableInsightResponse {
  summary: string;
  cues: string[];
  statusChip: string;
  confidence: number;
  watchouts?: string[];
  generatedAt: string;
}

export interface NotificationRecord {
  id: string;
  athleteId: string;
  title: string;
  body: string;
  category?: string | null;
  channel: string;
  payload?: Record<string, unknown> | null;
  status: string;
  lastError?: string | null;
  sentAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AthleteProgressMetrics {
  movementTrend: Array<{
    id: string;
    createdAt: string;
    verdict?: string | null;
    verdictScore: number;
    riskRating?: number | null;
    cueCount: number;
    fixAssigned: boolean;
    microPlanCompleted: boolean;
  }>;
  riskTrend: Array<{
    id: string;
    createdAt: string;
    riskLevel: string;
    riskScore: number;
    riskTrend?: string | null;
    uncertainty0to1?: number | null;
    adherence0to1?: number | null;
    sourcePlanId?: string | null;
    sourceSimulationId?: string | null;
  }>;
  microPlanStats: {
    assigned: number;
    completed: number;
    completionRate: number;
  };
  verificationStats: {
    better: number;
    same: number;
    worse: number;
    pending: number;
  };
  plannerImpacts: Array<{
    snapshotId: string;
    planId: string;
    simulationId?: string | null;
    beforeScore: number;
    afterScore: number;
    delta: number;
    createdAt: string;
  }>;
}

export type RehabTestType = 'single_leg_hop' | 'triple_hop' | 'squat' | 'lunge';

export type Phase = 'menstrual' | 'follicular' | 'ovulatory' | 'luteal' | 'unsure';
export type ShareScope = 'off' | 'private' | 'share_label';

export interface CycleSignals {
  lastPeriodISO?: string;
  avgCycleDays?: number;
  symptoms?: Array<'cramp' | 'fatigue' | 'migraine' | 'heavy_flow' | 'none'>;
  hrvTrend?: 'up' | 'down' | 'flat';
  tempTrend?: 'up' | 'down' | 'flat';
  contraception?: 'none' | 'combined_ocp' | 'iud' | 'implant' | 'other';
}

export interface PhaseEstimate {
  phase: Phase;
  confidence0to1: number;
  reasons: string[];
}

export interface PhasePolicy {
  warmupExtraMin: number;
  cutDensityDelta: number;
  landingFocus: boolean;
  cueVigilance: 'normal' | 'high';
}

export interface SharePayload {
  athleteId?: string;
  phase: Phase;
  confidenceBucket: 'low' | 'med' | 'high';
}

export interface CyclePrivacySetting {
  shareScope: ShareScope;
  lastSharedPhase?: Phase | null;
  lastSharedConfidence?: 'low' | 'med' | 'high' | null;
  lastSharedAt?: string | null;
}

export interface WarmupSummary {
  title: string;
  description: string;
  nudges: string[];
  cta?: string | null;
}

export type RtsGateCategory = 'hop' | 'strength' | 'balance' | 'psych';
export type RtsTrustGrade = 'A' | 'B' | 'C';

export interface RtsGateMetric {
  id: string;
  label: string;
  category: RtsGateCategory;
  units: string;
  scale: 'percent' | 'ratio';
  latest: number;
  best: number;
  monthAgo: number;
  target: number;
  trust: RtsTrustGrade;
  variance: number;
  notes: string;
  status: 'pass' | 'fail';
  driftLocked: boolean;
  driftPercent: number;
}

export interface RtsGateSummary {
  athleteId: string;
  sport: 'pivot' | 'non_pivot';
  sex: 'female' | 'male';
  age: number;
  ready: boolean;
  progressPct: number;
  gatesRemaining: number;
  explanation: string;
  cameraHint: string;
  receiptUrl: string | null;
  gates: RtsGateMetric[];
}

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
  formGrade?: 'A' | 'B' | 'C';
  formCue?: string;
}

export interface RehabAssessmentResultDTO {
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
  formGrade: 'A' | 'B' | 'C';
  formCue: string;
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
  crossoverHop?: {
    injuredDistance: number;
    healthyDistance: number;
  };
  yBalance?: {
    injuredComposite: number;
    healthyComposite: number;
  };
  psychological?: {
    aclRsiScore: number;
  };
  strengthToBw?: number;
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
