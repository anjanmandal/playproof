import { Router } from "express";
import { postLogin, postRegister, getProfile } from "../controllers/authController";
import { authenticate } from "../middleware/auth";

export const authRouter = Router();

authRouter.post("/register", postRegister);
authRouter.post("/login", postLogin);
authRouter.get("/me", authenticate, getProfile);
