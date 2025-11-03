import { RehabAssessmentInput, RehabAssessmentResult } from "../types/rehab";
import { Prisma } from "../generated/prisma/client";
export declare const evaluateRehabClearance: (input: RehabAssessmentInput) => Promise<RehabAssessmentResult>;
export declare const listRehabAssessments: (athleteId: string, limit?: number) => Prisma.PrismaPromise<({
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
})[]>;
export declare const getRehabAssessmentDetail: (assessmentId: string) => Prisma.Prisma__RehabAssessmentClient<({
    athlete: {
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
    };
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
}) | null, null, import("@prisma/client/runtime/library").DefaultArgs, {
    omit: Prisma.GlobalOmitConfig | undefined;
}>;
//# sourceMappingURL=rehabService.d.ts.map