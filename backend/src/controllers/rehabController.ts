import { Request, Response } from "express";
import { z } from "zod";
import {
  evaluateRehabClearance,
  listRehabAssessments,
  getRehabAssessmentDetail,
  getRtsGateSummary,
  processLiveCapture,
} from "../services/rehabService";

const rehabSchema = z.object({
  athleteId: z.string(),
  surgicalSide: z.enum(["left", "right"]),
  sessionDate: z.string().optional(),
  videos: z
    .array(
      z.object({
        id: z.string(),
        testType: z.enum(["single_leg_hop", "triple_hop", "squat", "lunge"]),
        url: z.string().url(),
        capturedAt: z.string(),
      }),
    )
    .min(1),
  limbSymmetry: z
    .object({
      injured: z.object({
        hopDistance: z.number(),
        tripleHopDistance: z.number(),
        squatDepth: z.number().optional(),
        notes: z.string().optional(),
      }),
      healthy: z.object({
        hopDistance: z.number(),
        tripleHopDistance: z.number(),
        squatDepth: z.number().optional(),
        notes: z.string().optional(),
      }),
    })
    .optional(),
  strength: z
    .object({
      injured: z.object({
        quad: z.number(),
        hamstring: z.number(),
        glute: z.number().optional(),
        units: z.enum(["lbs", "kgs", "n"]),
      }),
      healthy: z.object({
        quad: z.number(),
        hamstring: z.number(),
        glute: z.number().optional(),
        units: z.enum(["lbs", "kgs", "n"]),
      }),
    })
    .optional(),
  crossoverHop: z
    .object({
      injuredDistance: z.number(),
      healthyDistance: z.number(),
    })
    .optional(),
  yBalance: z
    .object({
      injuredComposite: z.number(),
      healthyComposite: z.number(),
    })
    .optional(),
  psychological: z
    .object({
      aclRsiScore: z.number().min(0).max(100),
    })
    .optional(),
  strengthToBw: z.number().min(0).optional(),
});

const liveCaptureSchema = z.object({
  athleteId: z.string(),
  surgicalSide: z.enum(["left", "right"]),
  sessionDate: z.string().optional(),
  videos: z
    .array(
      z.object({
        id: z.string(),
        testType: z.enum(["single_leg_hop", "triple_hop", "squat", "lunge"]),
        url: z.string().url(),
        capturedAt: z.string(),
      }),
    )
    .min(1),
});

export const postRehabAssessment = async (req: Request, res: Response) => {
  const parsed = rehabSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const result = await evaluateRehabClearance(parsed.data);

  return res.status(201).json(result);
};

export const postRehabLiveCapture = async (req: Request, res: Response) => {
  const parsed = liveCaptureSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const result = await processLiveCapture(parsed.data);

  return res.status(201).json(result);
};

const listQuerySchema = z.object({ limit: z.coerce.number().min(1).max(50).optional() });

export const getRehabHistory = async (req: Request, res: Response) => {
  const { athleteId } = req.params;
  if (!athleteId) {
    return res.status(400).json({ error: "athleteId is required" });
  }
  const query = listQuerySchema.safeParse(req.query);

  if (!query.success) {
    return res.status(400).json({ error: query.error.flatten() });
  }

  const assessments = await listRehabAssessments(athleteId, query.data.limit ?? 10);

  return res.json({ assessments: assessments.map(serializeRehabAssessment) });
};

export const getRehabDetail = async (req: Request, res: Response) => {
  const { rehabAssessmentId } = req.params;
  if (!rehabAssessmentId) {
    return res.status(400).json({ error: "rehabAssessmentId is required" });
  }

  const assessment = await getRehabAssessmentDetail(rehabAssessmentId);

  if (!assessment) {
    return res.status(404).json({ error: "Rehab assessment not found" });
  }

  return res.json({ assessment: serializeRehabAssessment(assessment) });
};

const rtsQuerySchema = z.object({
  sport: z.enum(["pivot", "non_pivot"]).optional(),
  sex: z.enum(["female", "male"]).optional(),
  age: z.coerce.number().min(12).max(60).optional(),
});

export const getRtsGateSummaryHandler = async (req: Request, res: Response) => {
  const { athleteId } = req.params;
  if (!athleteId) {
    return res.status(400).json({ error: "athleteId is required" });
  }
  const parsed = rtsQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const summary = await getRtsGateSummary({
    athleteId,
    sport: parsed.data.sport,
    sex: parsed.data.sex,
    age: parsed.data.age,
  });
  return res.json({ summary });
};

const serializeRehabAssessment = (assessment: any) => ({
  ...assessment,
  sessionDate: assessment.sessionDate?.toISOString?.() ?? assessment.sessionDate,
  createdAt: assessment.createdAt?.toISOString?.() ?? assessment.createdAt,
  updatedAt: assessment.updatedAt?.toISOString?.() ?? assessment.updatedAt,
  concerns: assessment.concerns ? JSON.parse(assessment.concerns) : [],
  recommendedExercises: assessment.recommendedExercises
    ? JSON.parse(assessment.recommendedExercises)
    : [],
  rawModelOutput: assessment.rawModelOutput ? JSON.parse(assessment.rawModelOutput) : null,
  videos: assessment.videos?.map((video: any) => ({
    ...video,
    capturedAt: video.capturedAt?.toISOString?.() ?? video.capturedAt,
    createdAt: video.createdAt?.toISOString?.() ?? video.createdAt,
  })),
});
