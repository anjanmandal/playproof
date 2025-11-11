import { Request, Response } from "express";
import { z } from "zod";
import { buildHomeSessionPlan, generateWearableInsight, recordHomeSessionProof } from "../services/homeSessionService";

const sessionQuerySchema = z.object({
  minutes: z.coerce.number().min(5).max(45).default(18),
  soreness: z.coerce.number().min(0).max(10).default(3),
});

const proofBodySchema = z.object({
  blockKey: z.string().min(2),
  clipUrl: z.string().url(),
  minutes: z.number().min(0).max(20).optional(),
});

const wearableInsightSchema = z.object({
  athleteId: z.string().optional(),
  metrics: z.object({
    valgus: z.number().min(0).max(1),
    impact: z.number().min(0).max(20),
    decel: z.number().min(0).max(20),
    asymmetry: z.number().min(0).max(1),
    cutDensity: z.number().min(0).max(60),
    playerLoad: z.number().min(0).max(2000),
    frameRate: z.number().min(0).max(120),
    motionQuality: z.number().min(0).max(1),
    bleStrength: z.number().min(-120).max(0),
    trust: z.enum(["A", "B", "C"]),
  }),
  devices: z
    .array(
      z.object({
        id: z.string(),
        role: z.string(),
        label: z.string(),
        paired: z.boolean(),
        streaming: z.boolean(),
        battery: z.number().min(0).max(100),
        firmware: z.string().optional(),
      }),
    )
    .min(1),
});

export const getHomeSessionPlanHandler = async (req: Request, res: Response) => {
  const { athleteId } = req.params;
  if (!athleteId) {
    return res.status(400).json({ error: "athleteId is required" });
  }
  const parsed = sessionQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const plan = await buildHomeSessionPlan({
    athleteId,
    minutes: parsed.data.minutes,
    soreness: parsed.data.soreness,
  });
  return res.json({ plan });
};

export const postHomeSessionProofHandler = async (req: Request, res: Response) => {
  const { athleteId } = req.params;
  if (!athleteId) {
    return res.status(400).json({ error: "athleteId is required" });
  }
  const parsed = proofBodySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  await recordHomeSessionProof({
    athleteId,
    blockKey: parsed.data.blockKey,
    clipUrl: parsed.data.clipUrl,
    minutes: parsed.data.minutes,
  });
  return res.status(201).json({ status: "ok" });
};

export const postWearableInsightHandler = async (req: Request, res: Response) => {
  const parsed = wearableInsightSchema.safeParse(req.body ?? {});
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const insight = await generateWearableInsight(parsed.data);
  return res.json({ insight });
};
