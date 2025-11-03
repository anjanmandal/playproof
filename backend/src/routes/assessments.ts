import { Router } from "express";
import {
  postMovementAssessment,
  getAthleteAssessments,
  getAssessmentDetail,
  patchMovementProof,
} from "../controllers/assessmentController";
import { authenticate } from "../middleware/auth";

export const assessmentRouter = Router();

assessmentRouter.use(authenticate);

assessmentRouter.post("/", postMovementAssessment);
assessmentRouter.get("/athlete/:athleteId", getAthleteAssessments);
assessmentRouter.get("/:assessmentId", getAssessmentDetail);
assessmentRouter.patch("/:assessmentId/proof", patchMovementProof);
