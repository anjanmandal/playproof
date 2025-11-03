export type DrillType = "drop_jump" | "planned_cut" | "unplanned_cut";
export interface FrameSnapshot {
    id: string;
    url: string;
    label?: string;
    capturedAt: string;
}
export interface MovementAssessmentInput {
    athleteId: string;
    drillType: DrillType;
    sessionId?: string;
    context?: {
        surface?: string;
        environment?: string;
        temperatureF?: number;
        humidityPct?: number;
        notes?: string;
        athleteProfile?: {
            name?: string;
            sex?: "male" | "female" | "nonbinary";
            position?: string;
            level?: string;
            age?: number;
        };
    };
    frames: FrameSnapshot[];
}
export interface MovementAssessmentResult {
    assessmentId: string;
    athleteId: string;
    drillType: DrillType;
    riskRating: number;
    cues: string[];
    metrics: {
        kneeValgusScore: number;
        trunkLeanOutsideBOS: boolean;
        footPlantOutsideCOM: boolean;
    };
    overview?: {
        headline: string;
        summary: string;
        confidence?: number;
    };
    riskSignals?: Array<{
        label: string;
        severity: "low" | "moderate" | "high";
        evidence: string;
    }>;
    coachingPlan?: {
        immediateCue: string;
        practiceFocus: string;
        monitoring: string;
    };
    phaseScores?: {
        prep?: PhaseScore;
        takeoff?: PhaseScore;
        firstContact?: PhaseScore;
        stabilization?: PhaseScore;
    };
    timeToStableMs?: number;
    groundContactTimeMs?: number;
    peakRiskPhase?: string;
    viewQuality?: ViewQualityAssessment;
    counterfactual?: CounterfactualPlan;
    asymmetryIndex0to100?: number;
    deltaFromBaseline?: Record<string, number> | null;
    overlays?: Array<OverlayInstruction>;
    frames?: FrameSnapshot[];
    context?: MovementAssessmentInput["context"];
    generatedAt: string;
    rawModelOutput?: unknown;
}
export interface PhaseScore {
    quality0to3?: number | null;
    notes?: string | null;
    riskDriver?: string | null;
    timeToStableMs?: number | null;
}
export interface ViewQualityAssessment {
    score0to1: number;
    fixInstructions?: string | null;
    retryRecommended?: boolean;
}
export interface CounterfactualPlan {
    tweak: string;
    predictedRiskDrop: number;
    nextRepVerify: boolean;
    summary?: string;
}
export interface OverlayInstruction {
    overlayType: string;
    description?: string;
    instructions?: string;
    severity?: "low" | "moderate" | "high";
}
//# sourceMappingURL=assessments.d.ts.map