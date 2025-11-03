import { Router } from "express";
import {
  getPlannerLatest,
  postPlannerApply,
  postPlannerSimulation,
} from "../controllers/plannerController";
import { authenticate } from "../middleware/auth";

export const plannerRouter = Router();

plannerRouter.use(authenticate);

plannerRouter.post("/simulate", postPlannerSimulation);
plannerRouter.post("/apply", postPlannerApply);
plannerRouter.get("/latest", getPlannerLatest);
