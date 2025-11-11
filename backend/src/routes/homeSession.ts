import { Router } from "express";
import { authenticate } from "../middleware/auth";
import {
  getHomeSessionPlanHandler,
  postHomeSessionProofHandler,
  postWearableInsightHandler,
} from "../controllers/homeSessionController";

export const homeSessionRouter = Router();

homeSessionRouter.use(authenticate);
homeSessionRouter.get("/session/:athleteId", getHomeSessionPlanHandler);
homeSessionRouter.post("/session/:athleteId/proof", postHomeSessionProofHandler);
homeSessionRouter.post("/wearables/insight", postWearableInsightHandler);
