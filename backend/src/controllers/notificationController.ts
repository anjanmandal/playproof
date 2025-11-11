import { Request, Response } from "express";
import { prisma } from "../db/prisma";

export const listNotifications = async (req: Request, res: Response) => {
  const athleteId = req.user?.athleteId;
  if (!athleteId) {
    return res.status(403).json({ error: "Athlete account required" });
  }

  const limit = Math.min(Number(req.query.limit ?? 25), 50);
  const notifications = await prisma.notification.findMany({
    where: { athleteId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return res.json({ notifications });
};
