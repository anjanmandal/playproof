import { MovementAssessmentInput, MovementAssessmentResult } from "../types/assessments";
import { Prisma } from "../generated/prisma/client";
export declare const createMovementAssessment: (input: MovementAssessmentInput) => Promise<MovementAssessmentResult>;
export declare const listMovementAssessments: (athleteId: string, limit?: number) => Prisma.PrismaPromise<({
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
})[]>;
export declare const getMovementAssessment: (assessmentId: string) => Prisma.Prisma__MovementAssessmentClient<({
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
}) | null, null, import("@prisma/client/runtime/library").DefaultArgs, {
    omit: Prisma.GlobalOmitConfig | undefined;
}>;
//# sourceMappingURL=assessmentService.d.ts.map