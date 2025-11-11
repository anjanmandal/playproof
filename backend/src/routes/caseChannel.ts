import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { getCaseChannel, postCaseChannelEvent } from "../controllers/caseChannelController";

export const caseChannelRouter = Router();

caseChannelRouter.use(authenticate);

caseChannelRouter.get("/:athleteId", getCaseChannel);
caseChannelRouter.post("/:athleteId", postCaseChannelEvent);
