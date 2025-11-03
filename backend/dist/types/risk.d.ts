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
}
export type RiskLevel = "green" | "yellow" | "red";
export interface DailyRiskRecommendation {
    snapshotId: string;
    athleteId: string;
    riskLevel: RiskLevel;
    rationale: string;
    changeToday: string;
    generatedAt: string;
    rawModelOutput?: unknown;
}
//# sourceMappingURL=risk.d.ts.map