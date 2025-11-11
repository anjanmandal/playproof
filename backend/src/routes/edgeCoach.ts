import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { postEdgeCoachInsight } from "../controllers/edgeCoachController";

export const edgeCoachRouter = Router();

edgeCoachRouter.use(authenticate);
edgeCoachRouter.post("/insight", postEdgeCoachInsight);
