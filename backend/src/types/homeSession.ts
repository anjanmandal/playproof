export interface HomeSessionBlock {
  key: string;
  title: string;
  focus: string;
  sets: number;
  reps: number;
  minutes: number;
  intensity: string;
  cues: string;
}

export interface HomeSessionPlan {
  athleteId: string;
  blocks: HomeSessionBlock[];
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
  firmware?: string | null;
}

export interface WearableInsightInput {
  athleteId?: string;
  metrics: WearableInsightMetrics;
  devices: WearableDeviceSnapshot[];
}

export interface WearableInsight {
  summary: string;
  cues: string[];
  statusChip: string;
  confidence: number;
  watchouts?: string[];
  generatedAt: string;
}
