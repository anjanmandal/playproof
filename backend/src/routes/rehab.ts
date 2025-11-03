import { Router } from "express";
import { postRehabAssessment, getRehabHistory, getRehabDetail } from "../controllers/rehabController";
import { authenticate } from "../middleware/auth";

export const rehabRouter = Router();

rehabRouter.use(authenticate);

rehabRouter.post("/", postRehabAssessment);
rehabRouter.get("/athlete/:athleteId", getRehabHistory);
rehabRouter.get("/:rehabAssessmentId", getRehabDetail);
