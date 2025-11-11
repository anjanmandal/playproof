import { Request, Response } from "express";
import { z } from "zod";
import {
  generateEvidencePack,
  listEvidenceViews,
  logEvidenceView,
  resolveEvidenceDownload,
} from "../services/evidenceService";

const evidenceBodySchema = z.object({
  athleteId: z.string().min(1),
  rehabAssessmentId: z.string().optional(),
  riskSnapshotId: z.string().optional(),
  planId: z.string().optional(),
  notes: z.string().optional(),
});

export const postEvidencePack = async (req: Request, res: Response) => {
  const parsed = evidenceBodySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const evidence = await generateEvidencePack(parsed.data, {
    id: req.user.id,
    email: req.user.email,
  });
  return res.status(201).json({ evidence });
};

export const getEvidenceDownload = async (req: Request, res: Response) => {
  const { id } = req.params;
  const expiresParam = typeof req.query.expires === "string" ? Number(req.query.expires) : NaN;
  const sigParam = typeof req.query.sig === "string" ? req.query.sig : "";
  if (!id || Number.isNaN(expiresParam) || !sigParam) {
    return res.status(400).json({ error: "Invalid download parameters" });
  }
  try {
    const safeId = id as string;
    const filepath = resolveEvidenceDownload(safeId, sigParam, expiresParam);
    const viewer = (req.user?.email ?? req.ip ?? "anonymous").toString();
    logEvidenceView(safeId, viewer);
    if (req.query.inline === "true") {
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "inline");
      return res.sendFile(filepath);
    }
    return res.download(filepath);
  } catch (error) {
    return res.status(400).json({ error: (error as Error).message });
  }
};

export const getEvidenceViews = (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: "Invalid evidence id" });
  }
  const views = listEvidenceViews(id);
  return res.json({ views });
};
