import { Router } from "express";
import { postAudienceRewrite } from "../controllers/audienceController";
import { authenticate } from "../middleware/auth";

export const audienceRouter = Router();

audienceRouter.use(authenticate);

audienceRouter.post("/", postAudienceRewrite);
