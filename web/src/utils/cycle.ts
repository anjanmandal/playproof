import type { CycleSignals, Phase, PhaseEstimate, PhasePolicy } from '@/types';

export const DEFAULT_CYCLE_SIGNALS: CycleSignals = {
  lastPeriodISO: '',
  avgCycleDays: 28,
  symptoms: [],
  hrvTrend: 'flat',
  tempTrend: 'flat',
  contraception: 'none',
};

export const inferPhase = (signals: CycleSignals = DEFAULT_CYCLE_SIGNALS): PhaseEstimate => {
  const today = new Date();
  const lastStart = signals.lastPeriodISO ? new Date(signals.lastPeriodISO) : null;
  const daysSince =
    lastStart && !Number.isNaN(lastStart.getTime())
      ? Math.max(0, Math.round((today.getTime() - lastStart.getTime()) / (1000 * 60 * 60 * 24)))
      : null;
  const cycleLength = signals.avgCycleDays || 28;
  let phase: Phase = 'unsure';
  if (daysSince !== null) {
    const normalized = daysSince % cycleLength;
    if (normalized <= 4) phase = 'menstrual';
    else if (normalized <= cycleLength * 0.45) phase = 'follicular';
    else if (normalized <= cycleLength * 0.65) phase = 'ovulatory';
    else phase = 'luteal';
  }
  let confidence = lastStart ? 0.8 : 0.45;
  if (signals.contraception === 'combined_ocp') confidence *= 0.6;
  if (signals.symptoms?.includes('heavy_flow')) confidence = Math.max(confidence, 0.7);
  return {
    phase,
    confidence0to1: Math.min(1, Math.max(0.2, confidence)),
    reasons: [
      lastStart ? `Logged ${daysSince}d ago` : 'No recent period log',
      `Cycle length ${cycleLength}d`,
    ],
  };
};

export const derivePhasePolicy = (
  estimate: PhaseEstimate,
  signals: CycleSignals = DEFAULT_CYCLE_SIGNALS,
): PhasePolicy => {
  const overrides = signals.symptoms?.some((symptom) => symptom && symptom !== 'none');
  const base: PhasePolicy = {
    warmupExtraMin: 4,
    cutDensityDelta: -0.1,
    landingFocus: true,
    cueVigilance: 'normal',
  };
  if (estimate.phase === 'menstrual' || overrides) {
    base.warmupExtraMin = 6;
    base.cutDensityDelta = -0.2;
    base.cueVigilance = 'high';
  } else if (estimate.phase === 'ovulatory') {
    base.cutDensityDelta = -0.05;
    base.cueVigilance = 'high';
  }
  if (estimate.confidence0to1 < 0.7) {
    base.cutDensityDelta /= 2;
  }
  if (signals.contraception === 'combined_ocp') {
    base.cutDensityDelta *= 0.6;
    base.warmupExtraMin = Math.max(2, base.warmupExtraMin - 2);
  }
  return base;
};

export const confidenceBucket = (value: number): 'low' | 'med' | 'high' => {
  if (value >= 0.75) return 'high';
  if (value >= 0.5) return 'med';
  return 'low';
};
