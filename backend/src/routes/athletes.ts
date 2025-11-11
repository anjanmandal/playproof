import { Router } from "express";
import { authenticate } from "../middleware/auth";
import {
  getAthletes,
  getAthleteDetail,
  getAthleteProgress,
} from "../controllers/athleteController";
import {
  getCyclePrivacy,
  updateCyclePrivacy,
  shareCyclePhase,
  inferCyclePhase,
  generateCycleWarmup,
} from "../controllers/cycleController";

export const athleteRouter = Router();

athleteRouter.use(authenticate);

athleteRouter.get("/", getAthletes);
athleteRouter.get("/:athleteId/progress", getAthleteProgress);
athleteRouter.get("/:athleteId/cycle/privacy", getCyclePrivacy);
athleteRouter.put("/:athleteId/cycle/privacy", updateCyclePrivacy);
athleteRouter.post("/:athleteId/cycle/share", shareCyclePhase);
athleteRouter.post("/:athleteId/cycle/infer", inferCyclePhase);
athleteRouter.post("/:athleteId/cycle/warmup", generateCycleWarmup);
athleteRouter.get("/:athleteId", getAthleteDetail);
