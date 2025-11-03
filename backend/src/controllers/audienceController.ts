import { Request, Response } from "express";
import { z } from "zod";
import { rewriteForAudience } from "../services/audienceService";

const audienceSchema = z.object({
  assessmentId: z.string(),
  baselineMessage: z.string(),
  audience: z.enum(["coach", "athlete", "parent", "at_pt"]),
  tone: z.enum(["technical", "supportive", "motivational"]).optional(),
});

export const postAudienceRewrite = async (req: Request, res: Response) => {
  const parsed = audienceSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const result = await rewriteForAudience(parsed.data);

  return res.status(201).json(result);
};
