import { prisma } from "../db/prisma";
import { Prisma } from "../generated/prisma/client";

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

const verdictScore = (verdict?: string | null) => {
  if (!verdict) return 1;
  switch (verdict) {
    case "pass":
      return 3;
    case "fix":
      return 2;
    case "needs_review":
      return 1;
    case "retake":
      return 0;
    default:
      return 1;
  }
};

const riskLevelScore = (riskLevel?: string | null) => {
  switch ((riskLevel ?? "green") as string) {
    case "red":
      return 3;
    case "yellow":
      return 2;
    default:
      return 1;
  }
};

const parseJSONField = <T>(value: Prisma.JsonValue | string | null | undefined): T | undefined => {
  if (value === undefined || value === null) return undefined;
  if (typeof value === "string") {
    try {
      return JSON.parse(value) as T;
    } catch {
      return undefined;
    }
  }
  return value as T;
};

export const getAthleteProgressMetrics = async (athleteId: string) => {
  const movementAssessments = await prisma.movementAssessment.findMany({
    where: { athleteId },
    orderBy: { createdAt: "desc" },
    take: 8,
    select: {
      id: true,
      createdAt: true,
      verdict: true,
      riskRating: true,
      cues: true,
      proof: {
        select: {
          fixAssigned: true,
          microPlanCompleted: true,
        },
      },
    },
  });

  const riskSnapshots = await prisma.riskSnapshot.findMany({
    where: { athleteId },
    orderBy: { createdAt: "desc" },
    take: 30,
  });

  const riskTrend = [...riskSnapshots]
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .map((snapshot) => {
      const microPlan = parseJSONField<Record<string, unknown>>(snapshot.microPlan);
      const nextRepCheck = parseJSONField<Record<string, unknown>>(snapshot.nextRepCheck);
      return {
        id: snapshot.id,
        createdAt: snapshot.createdAt.toISOString(),
        riskLevel: snapshot.riskLevel,
        riskScore: riskLevelScore(snapshot.riskLevel),
        riskTrend: snapshot.riskTrend,
        uncertainty0to1: snapshot.uncertainty0to1 ?? null,
        adherence0to1: snapshot.adherence0to1 ?? null,
        sourcePlanId: snapshot.sourcePlanId ?? null,
        sourceSimulationId: snapshot.sourceSimulationId ?? null,
        microPlanAssigned: Boolean(microPlan),
        nextRepResult: nextRepCheck?.result ?? null,
      };
    });

  const movementTrend = movementAssessments
    .map((assessment) => ({
      id: assessment.id,
      createdAt: assessment.createdAt.toISOString(),
      verdict: assessment.verdict,
      verdictScore: verdictScore(assessment.verdict),
      riskRating: assessment.riskRating ?? null,
      cueCount: (() => {
        try {
          const cues = JSON.parse(assessment.cues ?? "[]");
          return Array.isArray(cues) ? cues.length : 0;
        } catch {
          return 0;
        }
      })(),
      fixAssigned: assessment.proof?.fixAssigned ?? false,
      microPlanCompleted: assessment.proof?.microPlanCompleted ?? false,
    }))
    .reverse();

  const assignedSnapshots = riskTrend.filter((snapshot) => snapshot.microPlanAssigned);
  const completedSnapshots = riskTrend.filter(
    (snapshot) => (snapshot.adherence0to1 ?? 0) >= 0.99,
  );

  const microPlanStats = {
    assigned: assignedSnapshots.length,
    completed: completedSnapshots.length,
    completionRate:
      assignedSnapshots.length > 0
        ? Number((completedSnapshots.length / assignedSnapshots.length).toFixed(2))
        : 0,
  };

  const verificationStats = riskTrend.reduce(
    (acc, snapshot) => {
      const result = snapshot.nextRepResult;
      if (!result) {
        acc.pending += 1;
        return acc;
      }
      if (result === "better") acc.better += 1;
      else if (result === "worse") acc.worse += 1;
      else acc.same += 1;
      return acc;
    },
    { better: 0, same: 0, worse: 0, pending: 0 },
  );

  const plannerImpacts = riskTrend
    .map((snapshot, index, array) => {
      if (!snapshot.sourcePlanId) return null;
      const previous = array[index - 1];
      if (!previous) return null;
      const delta = snapshot.riskScore - previous.riskScore;
      return {
        snapshotId: snapshot.id,
        planId: snapshot.sourcePlanId,
        simulationId: snapshot.sourceSimulationId,
        beforeScore: previous.riskScore,
        afterScore: snapshot.riskScore,
        delta,
        createdAt: snapshot.createdAt,
      };
    })
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));

  return {
    movementTrend,
    riskTrend,
    microPlanStats,
    verificationStats,
    plannerImpacts,
  };
};
