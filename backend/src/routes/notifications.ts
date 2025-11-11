import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { listNotifications } from "../controllers/notificationController";

export const notificationRouter = Router();

notificationRouter.use(authenticate);
notificationRouter.get("/", listNotifications);
