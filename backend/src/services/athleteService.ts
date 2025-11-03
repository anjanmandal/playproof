import { prisma } from "../db/prisma";

export const ensureAthlete = async (athleteId: string, displayName?: string) => {
  const existing = await prisma.athlete.findUnique({ where: { id: athleteId } });

  if (existing) {
    if (displayName && existing.displayName === existing.id) {
      return prisma.athlete.update({ where: { id: athleteId }, data: { displayName } });
    }
    return existing;
  }

  return prisma.athlete.create({
    data: {
      id: athleteId,
      displayName: displayName ?? athleteId,
    },
  });
};

export const listAthletes = () =>
  prisma.athlete.findMany({
    orderBy: { displayName: "asc" },
    include: {
      movementSessions: { take: 5, orderBy: { createdAt: "desc" } },
      riskSnapshots: { take: 5, orderBy: { createdAt: "desc" } },
      rehabAssessments: { take: 3, orderBy: { createdAt: "desc" } },
    },
  });

export const getAthleteDashboard = (athleteId: string) =>
  prisma.athlete.findUnique({
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
