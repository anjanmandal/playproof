export type Phase = "menstrual" | "follicular" | "ovulatory" | "luteal" | "unsure";

export type CycleSymptom = "cramp" | "fatigue" | "migraine" | "heavy_flow" | "none";

export interface CycleSignals {
  lastPeriodISO?: string;
  avgCycleDays?: number;
  symptoms?: CycleSymptom[];
  hrvTrend?: "up" | "down" | "flat";
  tempTrend?: "up" | "down" | "flat";
  contraception?: "none" | "combined_ocp" | "iud" | "implant" | "other";
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
  cueVigilance: "normal" | "high";
}

export interface WarmupSummary {
  title: string;
  description: string;
  nudges: string[];
  cta?: string | null;
}
