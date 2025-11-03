"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAthleteDetail = exports.getAthletes = void 0;
const athleteService_1 = require("../services/athleteService");
const getAthletes = async (_req, res) => {
    const athletes = await (0, athleteService_1.listAthletes)();
    return res.json({ athletes: athletes.map(serializeAthleteSummary) });
};
exports.getAthletes = getAthletes;
const getAthleteDetail = async (req, res) => {
    const { athleteId } = req.params;
    if (!athleteId) {
        return res.status(400).json({ error: "athleteId is required" });
    }
    const athlete = await (0, athleteService_1.getAthleteDashboard)(athleteId);
    if (!athlete) {
        return res.status(404).json({ error: "Athlete not found" });
    }
    return res.json({ athlete: serializeAthleteDetail(athlete) });
};
exports.getAthleteDetail = getAthleteDetail;
const serializeAthleteSummary = (athlete) => ({
    ...athlete,
    createdAt: athlete.createdAt?.toISOString?.() ?? athlete.createdAt,
    updatedAt: athlete.updatedAt?.toISOString?.() ?? athlete.updatedAt,
});
const serializeAthleteDetail = (athlete) => ({
    ...serializeAthleteSummary(athlete),
    movementSessions: athlete.movementSessions?.map((session) => ({
        ...session,
        createdAt: session.createdAt?.toISOString?.() ?? session.createdAt,
        updatedAt: session.updatedAt?.toISOString?.() ?? session.updatedAt,
        cues: JSON.parse(session.cues ?? "[]"),
        metrics: JSON.parse(session.metrics ?? "{}"),
        context: session.context ? JSON.parse(session.context) : null,
        frames: session.frames?.map((frame) => ({
            ...frame,
            capturedAt: frame.capturedAt?.toISOString?.() ?? frame.capturedAt,
        })),
        recommendations: session.recommendations ?? [],
    })),
    riskSnapshots: athlete.riskSnapshots?.map((snapshot) => ({
        ...snapshot,
        recordedFor: snapshot.recordedFor?.toISOString?.() ?? snapshot.recordedFor,
        createdAt: snapshot.createdAt?.toISOString?.() ?? snapshot.createdAt,
        rawModelOutput: snapshot.rawModelOutput ? JSON.parse(snapshot.rawModelOutput) : null,
    })),
    rehabAssessments: athlete.rehabAssessments?.map((assessment) => ({
        ...assessment,
        sessionDate: assessment.sessionDate?.toISOString?.() ?? assessment.sessionDate,
        concerns: assessment.concerns ? JSON.parse(assessment.concerns) : [],
        recommendedExercises: assessment.recommendedExercises
            ? JSON.parse(assessment.recommendedExercises)
            : [],
        rawModelOutput: assessment.rawModelOutput ? JSON.parse(assessment.rawModelOutput) : null,
    })),
});
//# sourceMappingURL=athleteController.js.map