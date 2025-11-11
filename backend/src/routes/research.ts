import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { getEvidenceCards, getResearchPapers } from "../controllers/researchController";

export const researchRouter = Router();

researchRouter.use(authenticate);

researchRouter.get("/cards", getEvidenceCards);
researchRouter.get("/papers", getResearchPapers);
