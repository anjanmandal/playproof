"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAssessmentDetail = exports.getAthleteAssessments = exports.postMovementAssessment = void 0;
const zod_1 = require("zod");
const assessmentService_1 = require("../services/assessmentService");
const movementAssessmentSchema = zod_1.z.object({
    athleteId: zod_1.z.string(),
    drillType: zod_1.z.enum(["drop_jump", "planned_cut", "unplanned_cut"]),
    sessionId: zod_1.z.string().optional(),
    context: zod_1.z
        .object({
        surface: zod_1.z.string().optional(),
        environment: zod_1.z.string().optional(),
        temperatureF: zod_1.z.number().optional(),
        humidityPct: zod_1.z.number().optional(),
        notes: zod_1.z.string().optional(),
        athleteProfile: zod_1.z
            .object({
            name: zod_1.z.string().optional(),
            sex: zod_1.z.enum(["male", "female", "nonbinary"]).optional(),
            position: zod_1.z.string().optional(),
            level: zod_1.z.string().optional(),
            age: zod_1.z.number().optional(),
        })
            .optional(),
    })
        .optional(),
    frames: zod_1.z
        .array(zod_1.z.object({
        id: zod_1.z.string(),
        url: zod_1.z.string().url(),
        label: zod_1.z.string().optional(),
        capturedAt: zod_1.z.string(),
    }))
        .min(1, "At least one frame is required"),
});
const postMovementAssessment = async (req, res) => {
    const parsed = movementAssessmentSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.flatten() });
    }
    const result = await (0, assessmentService_1.createMovementAssessment)(parsed.data);
    return res.status(201).json(result);
};
exports.postMovementAssessment = postMovementAssessment;
const listQuerySchema = zod_1.z.object({
    limit: zod_1.z.coerce.number().min(1).max(100).optional(),
});
const getAthleteAssessments = async (req, res) => {
    const { athleteId } = req.params;
    if (!athleteId) {
        return res.status(400).json({ error: "athleteId is required" });
    }
    const query = listQuerySchema.safeParse(req.query);
    if (!query.success) {
        return res.status(400).json({ error: query.error.flatten() });
    }
    const assessments = await (0, assessmentService_1.listMovementAssessments)(athleteId, query.data.limit ?? 20);
    return res.json({ assessments: assessments.map(serializeAssessment) });
};
exports.getAthleteAssessments = getAthleteAssessments;
const getAssessmentDetail = async (req, res) => {
    const { assessmentId } = req.params;
    if (!assessmentId) {
        return res.status(400).json({ error: "assessmentId is required" });
    }
    const assessment = await (0, assessmentService_1.getMovementAssessment)(assessmentId);
    if (!assessment) {
        return res.status(404).json({ error: "Assessment not found" });
    }
    return res.json({ assessment: serializeAssessment(assessment) });
};
exports.getAssessmentDetail = getAssessmentDetail;
const serializeAssessment = (assessment) => {
    const raw = parseRawModelOutput(assessment.rawModelOutput);
    const overview = assessment.overview ?? raw?.overview ?? null;
    const riskSignals = assessment.riskSignals ?? parseRiskSignalsFromRaw(raw);
    const coachingPlan = assessment.coachingPlan ?? raw?.coachingPlan ?? raw?.coaching_plan ?? null;
    const phaseScores = assessment.phaseScores ?? parsePhaseScoresFromRaw(raw);
    const viewQuality = assessment.viewQuality ?? parseViewQualityFromRaw(raw);
    const counterfactual = assessment.counterfactual ?? parseCounterfactualFromRaw(raw);
    const asymmetryIndex0to100 = assessment.asymmetryIndex0to100 ?? raw?.asymmetry_index_0_100 ?? null;
    const deltaFromBaseline = assessment.deltaFromBaseline ?? raw?.delta_from_baseline ?? null;
    const overlays = assessment.overlays ?? parseOverlaysFromRaw(raw);
    const timeToStableMs = assessment.timeToStableMs ??
        raw?.time_to_stable_ms ??
        raw?.phase_scores?.stabilization?.time_to_stable_ms ??
        null;
    const groundContactTimeMs = assessment.groundContactTimeMs ?? raw?.ground_contact_time_ms ?? null;
    const peakRiskPhase = assessment.peakRiskPhase ?? raw?.peak_risk_phase ?? null;
    return {
        ...assessment,
        cues: JSON.parse(assessment.cues ?? "[]"),
        metrics: JSON.parse(assessment.metrics ?? "{}"),
        context: assessment.context ? JSON.parse(assessment.context) : null,
        rawModelOutput: raw,
        overview,
        riskSignals,
        coachingPlan,
        phaseScores,
        viewQuality,
        counterfactual,
        asymmetryIndex0to100,
        deltaFromBaseline,
        overlays,
        timeToStableMs,
        groundContactTimeMs,
        peakRiskPhase,
        createdAt: assessment.createdAt?.toISOString?.() ?? assessment.createdAt,
        updatedAt: assessment.updatedAt?.toISOString?.() ?? assessment.updatedAt,
        frames: assessment.frames?.map((frame) => ({
            ...frame,
            capturedAt: frame.capturedAt?.toISOString?.() ?? frame.capturedAt,
            createdAt: frame.createdAt?.toISOString?.() ?? frame.createdAt,
        })),
    };
};
const parseRawModelOutput = (raw) => {
    if (!raw)
        return null;
    try {
        const parsed = JSON.parse(raw);
        return parsed && typeof parsed === "object" ? parsed : null;
    }
    catch {
        return null;
    }
};
const parseRiskSignalsFromRaw = (raw) => {
    const source = raw?.riskSignals ?? raw?.risk_signals;
    if (!Array.isArray(source))
        return undefined;
    return source.map((signal) => ({
        label: signal?.label ?? "",
        severity: signal?.severity === "low" || signal?.severity === "high" ? signal.severity : "moderate",
        evidence: signal?.evidence ?? "",
    })).filter((signal) => signal.label);
};
const parsePhaseScoresFromRaw = (raw) => {
    const source = raw?.phase_scores;
    if (!source || typeof source !== "object")
        return undefined;
    const map = (phase) => phase && typeof phase === "object"
        ? {
            quality0to3: phase.quality_0_3 ?? phase.quality ?? null,
            notes: phase.notes ?? null,
            riskDriver: phase.risk_driver ?? phase.riskDriver ?? null,
            timeToStableMs: phase.time_to_stable_ms ?? phase.timeToStableMs ?? null,
        }
        : undefined;
    return {
        prep: map(source.prep),
        takeoff: map(source.takeoff),
        firstContact: map(source.first_contact ?? source.firstContact),
        stabilization: map(source.stabilization),
    };
};
const parseViewQualityFromRaw = (raw) => {
    const source = raw?.view_quality ?? raw?.viewQuality;
    if (!source || typeof source !== "object")
        return undefined;
    if (typeof source.score_0_1 !== "number")
        return undefined;
    return {
        score0to1: source.score_0_1,
        fixInstructions: source.fix_instructions ?? source.fixInstructions ?? null,
        retryRecommended: source.retry_recommended ?? source.retryRecommended ?? source.score_0_1 < 0.6,
    };
};
const parseCounterfactualFromRaw = (raw) => {
    const source = raw?.counterfactual;
    if (!source || typeof source !== "object" || !source.tweak)
        return undefined;
    return {
        tweak: source.tweak,
        predictedRiskDrop: typeof source.predicted_risk_drop === "number" ? source.predicted_risk_drop : 0,
        nextRepVerify: Boolean(source.next_rep_verify ?? source.nextRepVerify),
        summary: source.summary ?? undefined,
    };
};
const parseOverlaysFromRaw = (raw) => {
    const source = raw?.overlays;
    if (!Array.isArray(source))
        return undefined;
    return source
        .map((overlay) => ({
        overlayType: overlay?.overlay_type ?? overlay?.overlayType ?? "",
        description: overlay?.description ?? undefined,
        instructions: overlay?.instructions ?? undefined,
        severity: overlay?.severity,
    }))
        .filter((overlay) => overlay.overlayType);
};
//# sourceMappingURL=assessmentController.js.map