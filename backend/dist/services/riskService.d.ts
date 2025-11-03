import { DailyRiskInput, DailyRiskRecommendation } from "../types/risk";
export declare const buildDailyRiskRecommendation: (input: DailyRiskInput) => Promise<DailyRiskRecommendation>;
export declare const listRiskSnapshots: (athleteId: string, limit?: number) => import("../generated/prisma/internal/prismaNamespace").PrismaPromise<{
    id: string;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
    athleteId: string;
    surface: string;
    temperatureF: number;
    humidityPct: number;
    rawModelOutput: string | null;
    exposureMinutes: number;
    priorLowerExtremityInjury: boolean;
    sorenessLevel: number;
    fatigueLevel: number;
    bodyWeightTrend: string | null;
    menstrualPhase: string | null;
    recordedFor: Date | null;
    riskLevel: string;
    rationale: string;
    changeToday: string;
    recommendationAcknowledged: boolean;
}[]>;
export declare const acknowledgeRiskSnapshot: (snapshotId: string) => import("../generated/prisma/models").Prisma__RiskSnapshotClient<{
    id: string;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
    athleteId: string;
    surface: string;
    temperatureF: number;
    humidityPct: number;
    rawModelOutput: string | null;
    exposureMinutes: number;
    priorLowerExtremityInjury: boolean;
    sorenessLevel: number;
    fatigueLevel: number;
    bodyWeightTrend: string | null;
    menstrualPhase: string | null;
    recordedFor: Date | null;
    riskLevel: string;
    rationale: string;
    changeToday: string;
    recommendationAcknowledged: boolean;
}, never, import("@prisma/client/runtime/library").DefaultArgs, {
    omit: import("../generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined;
}>;
//# sourceMappingURL=riskService.d.ts.map