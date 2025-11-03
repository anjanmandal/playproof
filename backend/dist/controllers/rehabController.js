"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRehabDetail = exports.getRehabHistory = exports.postRehabAssessment = void 0;
const zod_1 = require("zod");
const rehabService_1 = require("../services/rehabService");
const rehabSchema = zod_1.z.object({
    athleteId: zod_1.z.string(),
    surgicalSide: zod_1.z.enum(["left", "right"]),
    sessionDate: zod_1.z.string().optional(),
    videos: zod_1.z
        .array(zod_1.z.object({
        id: zod_1.z.string(),
        testType: zod_1.z.enum(["single_leg_hop", "triple_hop", "squat", "lunge"]),
        url: zod_1.z.string().url(),
        capturedAt: zod_1.z.string(),
    }))
        .min(1),
    limbSymmetry: zod_1.z
        .object({
        injured: zod_1.z.object({
            hopDistance: zod_1.z.number(),
            tripleHopDistance: zod_1.z.number(),
            squatDepth: zod_1.z.number().optional(),
            notes: zod_1.z.string().optional(),
        }),
        healthy: zod_1.z.object({
            hopDistance: zod_1.z.number(),
            tripleHopDistance: zod_1.z.number(),
            squatDepth: zod_1.z.number().optional(),
            notes: zod_1.z.string().optional(),
        }),
    })
        .optional(),
    strength: zod_1.z
        .object({
        injured: zod_1.z.object({
            quad: zod_1.z.number(),
            hamstring: zod_1.z.number(),
            glute: zod_1.z.number().optional(),
            units: zod_1.z.enum(["lbs", "kgs", "n"]),
        }),
        healthy: zod_1.z.object({
            quad: zod_1.z.number(),
            hamstring: zod_1.z.number(),
            glute: zod_1.z.number().optional(),
            units: zod_1.z.enum(["lbs", "kgs", "n"]),
        }),
    })
        .optional(),
});
const postRehabAssessment = async (req, res) => {
    const parsed = rehabSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.flatten() });
    }
    const result = await (0, rehabService_1.evaluateRehabClearance)(parsed.data);
    return res.status(201).json(result);
};
exports.postRehabAssessment = postRehabAssessment;
const listQuerySchema = zod_1.z.object({ limit: zod_1.z.coerce.number().min(1).max(50).optional() });
const getRehabHistory = async (req, res) => {
    const { athleteId } = req.params;
    if (!athleteId) {
        return res.status(400).json({ error: "athleteId is required" });
    }
    const query = listQuerySchema.safeParse(req.query);
    if (!query.success) {
        return res.status(400).json({ error: query.error.flatten() });
    }
    const assessments = await (0, rehabService_1.listRehabAssessments)(athleteId, query.data.limit ?? 10);
    return res.json({ assessments: assessments.map(serializeRehabAssessment) });
};
exports.getRehabHistory = getRehabHistory;
const getRehabDetail = async (req, res) => {
    const { rehabAssessmentId } = req.params;
    if (!rehabAssessmentId) {
        return res.status(400).json({ error: "rehabAssessmentId is required" });
    }
    const assessment = await (0, rehabService_1.getRehabAssessmentDetail)(rehabAssessmentId);
    if (!assessment) {
        return res.status(404).json({ error: "Rehab assessment not found" });
    }
    return res.json({ assessment: serializeRehabAssessment(assessment) });
};
exports.getRehabDetail = getRehabDetail;
const serializeRehabAssessment = (assessment) => ({
    ...assessment,
    sessionDate: assessment.sessionDate?.toISOString?.() ?? assessment.sessionDate,
    createdAt: assessment.createdAt?.toISOString?.() ?? assessment.createdAt,
    updatedAt: assessment.updatedAt?.toISOString?.() ?? assessment.updatedAt,
    concerns: assessment.concerns ? JSON.parse(assessment.concerns) : [],
    recommendedExercises: assessment.recommendedExercises
        ? JSON.parse(assessment.recommendedExercises)
        : [],
    rawModelOutput: assessment.rawModelOutput ? JSON.parse(assessment.rawModelOutput) : null,
    videos: assessment.videos?.map((video) => ({
        ...video,
        capturedAt: video.capturedAt?.toISOString?.() ?? video.capturedAt,
        createdAt: video.createdAt?.toISOString?.() ?? video.createdAt,
    })),
});
//# sourceMappingURL=rehabController.js.map