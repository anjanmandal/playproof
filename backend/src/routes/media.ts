import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { mediaUploader } from "../config/storage";
import { postMediaUpload } from "../controllers/mediaController";

export const mediaRouter = Router();

mediaRouter.post("/upload", authenticate, mediaUploader.single("file"), postMediaUpload);
