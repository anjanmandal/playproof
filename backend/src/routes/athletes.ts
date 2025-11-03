import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { getAthletes, getAthleteDetail } from "../controllers/athleteController";

export const athleteRouter = Router();

athleteRouter.use(authenticate);

athleteRouter.get("/", getAthletes);
athleteRouter.get("/:athleteId", getAthleteDetail);
