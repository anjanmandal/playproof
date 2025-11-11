import { Router } from "express";
import { authenticate } from "../middleware/auth";
import {
  getEvidenceDownload,
  getEvidenceViews,
  postEvidencePack,
} from "../controllers/evidenceController";

export const evidenceRouter = Router();

// Public signed download (signature already verifies access)
evidenceRouter.get("/pdf/:id", getEvidenceDownload);

// Authenticated routes
evidenceRouter.post("/pdf", authenticate, postEvidencePack);
evidenceRouter.get("/pdf/:id/views", authenticate, getEvidenceViews);
