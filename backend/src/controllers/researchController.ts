import { Request, Response } from "express";
import { listEvidenceCards, searchResearchPapers } from "../services/researchService";

export const getEvidenceCards = async (_req: Request, res: Response) => {
  const cards = await listEvidenceCards();
  return res.json({ cards });
};

export const getResearchPapers = async (req: Request, res: Response) => {
  const { q, tag, level } = req.query;
  const tags = typeof tag === "string" ? tag.split(",").map((item) => item.trim().toLowerCase()) : [];
  const papers = await searchResearchPapers(
    typeof q === "string" ? q : undefined,
    {
      tags: tags.length ? tags : undefined,
      level: typeof level === "string" ? level : undefined,
    },
  );
  return res.json({ papers });
};
