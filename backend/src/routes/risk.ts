import { Router } from "express";
import {
  postDailyRisk,
  getRiskHistory,
  acknowledgeRisk,
  updateAdherence,
  simulateRisk,
  ingestRiskVideoFeatures,
  getRiskAudit,
  getTeamRiskSnapshots,
} from "../controllers/riskController";
import { authenticate } from "../middleware/auth";

export const riskRouter = Router();

riskRouter.use(authenticate);

riskRouter.post("/", postDailyRisk);
riskRouter.get("/athlete/:athleteId", getRiskHistory);
riskRouter.get("/team/:teamId", getTeamRiskSnapshots);
riskRouter.post("/simulate", simulateRisk);
riskRouter.post("/features/video", ingestRiskVideoFeatures);
riskRouter.get("/:snapshotId/audit", getRiskAudit);
riskRouter.patch("/:snapshotId/acknowledge", acknowledgeRisk);
riskRouter.patch("/:snapshotId/adherence", updateAdherence);
