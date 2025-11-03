import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../services/authService";
import { Role } from "../generated/prisma/client";

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Missing Authorization header" });
  }

  const [, token] = authHeader.split(" ");

  if (!token) {
    return res.status(401).json({ error: "Invalid Authorization header" });
  }

  try {
    const payload = verifyToken(token);
    req.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      athleteId: payload.athleteId ?? undefined,
      teams: payload.teams ?? [],
    };
    next();
  } catch (error) {
    console.error("Auth error", error);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

export const requireRoles =
  (...roles: Role[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden" });
    }

    return next();
  };
