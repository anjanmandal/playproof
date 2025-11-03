import { RiskLevel } from "../types/risk";

export const estimateHeatIndex = (temperatureF: number, humidityPct: number): number => {
  if (temperatureF < 80) return temperatureF;
  const T = temperatureF;
  const R = humidityPct;
  const HI =
    -42.379 +
    2.04901523 * T +
    10.14333127 * R -
    0.22475541 * T * R -
    0.00683783 * T * T -
    0.05481717 * R * R +
    0.00122874 * T * T * R +
    0.00085282 * T * R * R -
    0.00000199 * T * T * R * R;
  return HI;
};

export const normalizeRiskLevelScore = (riskLevel: string): number => {
  switch (riskLevel as RiskLevel) {
    case "red":
      return 0.85;
    case "yellow":
      return 0.45;
    default:
      return 0.15;
  }
};

export const inferTrendFromHistory = (history: number[], current: number): "up" | "flat" | "down" => {
  if (!history.length) return "flat";
  const average = history.reduce((sum, score) => sum + score, 0) / history.length;
  const delta = current - average;
  const threshold = 0.15;
  if (delta > threshold) return "up";
  if (delta < -threshold) return "down";
  return "flat";
};
