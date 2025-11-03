import { Request, Response } from "express";
import { z } from "zod";
import { registerUser, loginUser } from "../services/authService";
import { Role } from "../generated/prisma/client";

const registerSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(6),
    role: z.nativeEnum(Role),
    athleteId: z.string().optional(),
    athleteDisplayName: z.string().optional(),
    teams: z.array(z.string()).optional(),
  })
  .refine(
    (payload) =>
      payload.role === Role.COACH || payload.teams === undefined || payload.teams.length === 0,
    {
      path: ["teams"],
      message: "Only coaches may provide team assignments.",
    },
  );

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const postRegister = async (req: Request, res: Response) => {
  const parsed = registerSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  try {
    const result = await registerUser(parsed.data);
    return res.status(201).json(result);
  } catch (error) {
    return res.status(400).json({ error: (error as Error).message });
  }
};

export const postLogin = async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  try {
    const result = await loginUser(parsed.data.email, parsed.data.password);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ error: (error as Error).message });
  }
};

export const getProfile = (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  return res.json({ user: req.user });
};
