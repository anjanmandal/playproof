import { Request, Response } from "express";
import { z } from "zod";
import { generateEdgeCoachInsight } from "../services/edgeCoachService";

const insightSchema = z.object({
  trustScore: z.number().min(0).max(1),
  kamScore: z.number().min(0).max(1),
  decelStatus: z.enum(["Normal", "High"]),
  footPlantPerMin: z.number().min(0).max(60),
  cues: z.array(z.string()).max(3).optional(),
});

export const postEdgeCoachInsight = async (req: Request, res: Response) => {
  const body = insightSchema.safeParse(req.body);
  if (!body.success) {
    return res.status(400).json({ error: body.error.flatten() });
  }
  const summary = await generateEdgeCoachInsight(body.data);
  return res.json({ summary });
};
