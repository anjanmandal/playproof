import { Request, Response } from "express";
import { z } from "zod";
import { createCaseEvent, listCaseEvents } from "../services/caseChannelService";

const createEventSchema = z.object({
  eventType: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().optional(),
  trustGrade: z.enum(["A", "B", "C"]).optional(),
  role: z.string().optional(),
  pinned: z.boolean().optional(),
  nextAction: z.string().optional(),
  attachments: z.any().optional(),
  metadata: z.any().optional(),
  mentions: z.array(z.string()).optional(),
  consentFlag: z.string().optional(),
  visibility: z.string().optional(),
});

export const getCaseChannel = async (req: Request, res: Response) => {
  const { athleteId } = req.params;
  if (!athleteId) {
    return res.status(400).json({ error: "athleteId is required" });
  }
  const { eventType, role, limit } = req.query;
  const response = await listCaseEvents(athleteId, {
    eventType: typeof eventType === "string" ? eventType : undefined,
    role: typeof role === "string" ? role : undefined,
    limit: typeof limit === "string" ? Number(limit) : undefined,
  });
  return res.json({ caseChannel: response });
};

export const postCaseChannelEvent = async (req: Request, res: Response) => {
  const { athleteId } = req.params;
  if (!athleteId) {
    return res.status(400).json({ error: "athleteId is required" });
  }
  const parsed = createEventSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const event = await createCaseEvent(
    athleteId,
    parsed.data,
    {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role,
    },
    req.user.teams?.[0],
  );
  return res.status(201).json({ event });
};
