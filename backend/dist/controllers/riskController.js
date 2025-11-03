"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.acknowledgeRisk = exports.getRiskHistory = exports.postDailyRisk = void 0;
const zod_1 = require("zod");
const riskService_1 = require("../services/riskService");
const riskSchema = zod_1.z.object({
    athleteId: zod_1.z.string(),
    athleteName: zod_1.z.string().optional(),
    recordedFor: zod_1.z.string().optional(),
    exposureMinutes: zod_1.z.number().min(0),
    surface: zod_1.z.enum(["turf", "grass", "wet_grass", "indoor", "court"]),
    temperatureF: zod_1.z.number(),
    humidityPct: zod_1.z.number(),
    priorLowerExtremityInjury: zod_1.z.boolean(),
    sorenessLevel: zod_1.z.union([zod_1.z.literal(0), zod_1.z.literal(1), zod_1.z.literal(2), zod_1.z.literal(3)]),
    fatigueLevel: zod_1.z.union([zod_1.z.literal(0), zod_1.z.literal(1), zod_1.z.literal(2), zod_1.z.literal(3)]),
    bodyWeightTrend: zod_1.z.enum(["up", "down", "stable"]).optional(),
    menstrualPhase: zod_1.z.enum(["follicular", "ovulatory", "luteal", "menstrual", "unspecified"]).optional(),
    notes: zod_1.z.string().optional(),
});
const postDailyRisk = async (req, res) => {
    const parsed = riskSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.flatten() });
    }
    const recommendation = await (0, riskService_1.buildDailyRiskRecommendation)(parsed.data);
    return res.status(201).json(recommendation);
};
exports.postDailyRisk = postDailyRisk;
const listQuerySchema = zod_1.z.object({ limit: zod_1.z.coerce.number().min(1).max(60).optional() });
const getRiskHistory = async (req, res) => {
    const { athleteId } = req.params;
    if (!athleteId) {
        return res.status(400).json({ error: "athleteId is required" });
    }
    const query = listQuerySchema.safeParse(req.query);
    if (!query.success) {
        return res.status(400).json({ error: query.error.flatten() });
    }
    const snapshots = await (0, riskService_1.listRiskSnapshots)(athleteId, query.data.limit ?? 30);
    return res.json({
        snapshots: snapshots.map((snapshot) => ({
            ...snapshot,
            recordedFor: snapshot.recordedFor?.toISOString?.() ?? snapshot.recordedFor,
            createdAt: snapshot.createdAt?.toISOString?.() ?? snapshot.createdAt,
            updatedAt: snapshot.updatedAt?.toISOString?.() ?? snapshot.updatedAt,
            rawModelOutput: snapshot.rawModelOutput ? JSON.parse(snapshot.rawModelOutput) : null,
        })),
    });
};
exports.getRiskHistory = getRiskHistory;
const acknowledgeRisk = async (req, res) => {
    const { snapshotId } = req.params;
    if (!snapshotId) {
        return res.status(400).json({ error: "snapshotId is required" });
    }
    try {
        await (0, riskService_1.acknowledgeRiskSnapshot)(snapshotId);
        return res.status(200).json({ acknowledged: true });
    }
    catch (error) {
        return res.status(404).json({ error: error.message });
    }
};
exports.acknowledgeRisk = acknowledgeRisk;
//# sourceMappingURL=riskController.js.map