export interface LimbSymmetryMetrics {
    hopDistance: number;
    tripleHopDistance: number;
    squatDepth?: number;
    notes?: string;
}
export interface StrengthMetrics {
    quad: number;
    hamstring: number;
    glute?: number;
    units: "lbs" | "kgs" | "n";
}
export interface RehabAssessmentInput {
    athleteId: string;
    surgicalSide: "left" | "right";
    sessionDate?: string;
    videos: Array<{
        id: string;
        testType: "single_leg_hop" | "triple_hop" | "squat" | "lunge";
        url: string;
        capturedAt: string;
    }>;
    limbSymmetry?: {
        injured: LimbSymmetryMetrics;
        healthy: LimbSymmetryMetrics;
    };
    strength?: {
        injured: StrengthMetrics;
        healthy: StrengthMetrics;
    };
}
export interface RehabAssessmentResult {
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
    rawModelOutput?: unknown;
}
//# sourceMappingURL=rehab.d.ts.map