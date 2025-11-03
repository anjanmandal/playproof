export declare const ensureAthlete: (athleteId: string, displayName?: string) => Promise<{
    id: string;
    displayName: string;
    jerseyNumber: string | null;
    sport: string | null;
    position: string | null;
    team: string | null;
    sex: string | null;
    dateOfBirth: Date | null;
    heightCm: number | null;
    weightKg: number | null;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
}>;
export declare const listAthletes: () => import("../generated/prisma/internal/prismaNamespace").PrismaPromise<({
    movementSessions: {
        context: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        riskRating: number;
        cues: string;
        metrics: string;
        athleteId: string;
        drillType: string;
        sessionId: string | null;
        rawModelOutput: string | null;
    }[];
    riskSnapshots: {
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
    }[];
    rehabAssessments: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        athleteId: string;
        rawModelOutput: string | null;
        cleared: boolean;
        concerns: string;
        surgicalSide: string;
        sessionDate: Date | null;
        limbSymmetryScore: number;
        recommendedExercises: string;
        athleteSummary: string;
        parentSummary: string;
        clinicianNotes: string;
    }[];
} & {
    id: string;
    displayName: string;
    jerseyNumber: string | null;
    sport: string | null;
    position: string | null;
    team: string | null;
    sex: string | null;
    dateOfBirth: Date | null;
    heightCm: number | null;
    weightKg: number | null;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
})[]>;
export declare const getAthleteDashboard: (athleteId: string) => import("../generated/prisma/models").Prisma__AthleteClient<({
    movementSessions: ({
        frames: {
            id: string;
            createdAt: Date;
            label: string | null;
            frameIndex: number;
            capturedAt: Date;
            assessmentId: string;
            snapshotUrl: string;
        }[];
        recommendations: {
            message: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            assessmentId: string;
            audience: string;
            focusArea: string;
            acknowledged: boolean;
        }[];
    } & {
        context: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        riskRating: number;
        cues: string;
        metrics: string;
        athleteId: string;
        drillType: string;
        sessionId: string | null;
        rawModelOutput: string | null;
    })[];
    riskSnapshots: {
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
    }[];
    rehabAssessments: ({
        videos: {
            id: string;
            createdAt: Date;
            url: string;
            capturedAt: Date;
            testType: string;
            rehabAssessmentId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        athleteId: string;
        rawModelOutput: string | null;
        cleared: boolean;
        concerns: string;
        surgicalSide: string;
        sessionDate: Date | null;
        limbSymmetryScore: number;
        recommendedExercises: string;
        athleteSummary: string;
        parentSummary: string;
        clinicianNotes: string;
    })[];
} & {
    id: string;
    displayName: string;
    jerseyNumber: string | null;
    sport: string | null;
    position: string | null;
    team: string | null;
    sex: string | null;
    dateOfBirth: Date | null;
    heightCm: number | null;
    weightKg: number | null;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
}) | null, null, import("@prisma/client/runtime/library").DefaultArgs, {
    omit: import("../generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined;
}>;
//# sourceMappingURL=athleteService.d.ts.map