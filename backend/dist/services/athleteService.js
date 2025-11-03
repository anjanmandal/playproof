"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAthleteDashboard = exports.listAthletes = exports.ensureAthlete = void 0;
const prisma_1 = require("../db/prisma");
const ensureAthlete = async (athleteId, displayName) => {
    const existing = await prisma_1.prisma.athlete.findUnique({ where: { id: athleteId } });
    if (existing) {
        if (displayName && existing.displayName === existing.id) {
            return prisma_1.prisma.athlete.update({ where: { id: athleteId }, data: { displayName } });
        }
        return existing;
    }
    return prisma_1.prisma.athlete.create({
        data: {
            id: athleteId,
            displayName: displayName ?? athleteId,
        },
    });
};
exports.ensureAthlete = ensureAthlete;
const listAthletes = () => prisma_1.prisma.athlete.findMany({
    orderBy: { displayName: "asc" },
    include: {
        movementSessions: { take: 5, orderBy: { createdAt: "desc" } },
        riskSnapshots: { take: 5, orderBy: { createdAt: "desc" } },
        rehabAssessments: { take: 3, orderBy: { createdAt: "desc" } },
    },
});
exports.listAthletes = listAthletes;
const getAthleteDashboard = (athleteId) => prisma_1.prisma.athlete.findUnique({
    where: { id: athleteId },
    include: {
        movementSessions: {
            orderBy: { createdAt: "desc" },
            take: 10,
            include: {
                frames: true,
                recommendations: true,
            },
        },
        riskSnapshots: {
            orderBy: { createdAt: "desc" },
            take: 14,
        },
        rehabAssessments: {
            orderBy: { createdAt: "desc" },
            take: 5,
            include: {
                videos: true,
            },
        },
    },
});
exports.getAthleteDashboard = getAthleteDashboard;
//# sourceMappingURL=athleteService.js.map