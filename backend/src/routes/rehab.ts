import { Router } from "express";
import {
  postRehabAssessment,
  getRehabHistory,
  getRehabDetail,
  getRtsGateSummaryHandler,
  postRehabLiveCapture,
} from "../controllers/rehabController";
import { authenticate } from "../middleware/auth";

export const rehabRouter = Router();

rehabRouter.use(authenticate);

rehabRouter.post("/", postRehabAssessment);
rehabRouter.post("/live-capture", postRehabLiveCapture);
rehabRouter.get("/athlete/:athleteId", getRehabHistory);
rehabRouter.get("/athlete/:athleteId/rts", getRtsGateSummaryHandler);
rehabRouter.get("/:rehabAssessmentId", getRehabDetail);
