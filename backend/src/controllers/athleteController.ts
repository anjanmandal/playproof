import { Request, Response } from "express";
import {
  listAthletes,
  getAthleteDashboard,
  getAthleteProgressMetrics,
} from "../services/athleteService";

export const getAthletes = async (_req: Request, res: Response) => {
  const athletes = await listAthletes();
  return res.json({ athletes: athletes.map(serializeAthleteSummary) });
};

export const getAthleteDetail = async (req: Request, res: Response) => {
  const { athleteId } = req.params;
  if (!athleteId) {
    return res.status(400).json({ error: "athleteId is required" });
  }

  const athlete = await getAthleteDashboard(athleteId);

  if (!athlete) {
    return res.status(404).json({ error: "Athlete not found" });
  }

  return res.json({ athlete: serializeAthleteDetail(athlete) });
};

export const getAthleteProgress = async (req: Request, res: Response) => {
  const { athleteId } = req.params;
  if (!athleteId) {
    return res.status(400).json({ error: "athleteId is required" });
  }

  const metrics = await getAthleteProgressMetrics(athleteId);
  return res.json({ metrics });
};

const serializeAthleteSummary = (athlete: any) => ({
  ...athlete,
  createdAt: athlete.createdAt?.toISOString?.() ?? athlete.createdAt,
  updatedAt: athlete.updatedAt?.toISOString?.() ?? athlete.updatedAt,
});

const serializeAthleteDetail = (athlete: any) => ({
  ...serializeAthleteSummary(athlete),
  movementSessions: athlete.movementSessions?.map((session: any) => ({
    ...session,
    createdAt: session.createdAt?.toISOString?.() ?? session.createdAt,
    updatedAt: session.updatedAt?.toISOString?.() ?? session.updatedAt,
    cues: JSON.parse(session.cues ?? "[]"),
    metrics: JSON.parse(session.metrics ?? "{}"),
    context: session.context ? JSON.parse(session.context) : null,
    frames: session.frames?.map((frame: any) => ({
      ...frame,
      capturedAt: frame.capturedAt?.toISOString?.() ?? frame.capturedAt,
    })),
    recommendations: session.recommendations ?? [],
  })),
  riskSnapshots: athlete.riskSnapshots?.map((snapshot: any) => ({
    ...snapshot,
    recordedFor: snapshot.recordedFor?.toISOString?.() ?? snapshot.recordedFor,
    createdAt: snapshot.createdAt?.toISOString?.() ?? snapshot.createdAt,
    rawModelOutput: snapshot.rawModelOutput ? JSON.parse(snapshot.rawModelOutput) : null,
  })),
  rehabAssessments: athlete.rehabAssessments?.map((assessment: any) => ({
    ...assessment,
    sessionDate: assessment.sessionDate?.toISOString?.() ?? assessment.sessionDate,
    concerns: assessment.concerns ? JSON.parse(assessment.concerns) : [],
    recommendedExercises: assessment.recommendedExercises
      ? JSON.parse(assessment.recommendedExercises)
      : [],
    rawModelOutput: assessment.rawModelOutput ? JSON.parse(assessment.rawModelOutput) : null,
  })),
});
