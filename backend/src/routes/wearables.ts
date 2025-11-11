import { Router } from "express";
import {
  ensureWearableFeatureFlag,
  getWearableFeatures,
  postWearableFlush,
  postWearableSamples,
  postWearableSession,
} from "../controllers/wearableController";
import { authenticate } from "../middleware/auth";

export const wearableRouter = Router();

wearableRouter.use(authenticate, ensureWearableFeatureFlag);

wearableRouter.post("/session", postWearableSession);
wearableRouter.post("/:sessionId/samples", postWearableSamples);
wearableRouter.post("/:sessionId/flush", postWearableFlush);
wearableRouter.get("/:sessionId/features", getWearableFeatures);
