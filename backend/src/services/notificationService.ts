import { prisma } from "../db/prisma";
import { env } from "../config/env";

export interface NotificationInput {
  athleteId: string;
  title: string;
  body: string;
  category?: string;
  payload?: Record<string, unknown>;
  channel?: "push" | "email" | "sms";
}

const hasFetch = typeof fetch === "function";

export const notifyAthlete = async (input: NotificationInput) => {
  const record = await prisma.notification.create({
    data: {
      athleteId: input.athleteId,
      title: input.title,
      body: input.body,
      category: input.category ?? null,
      channel: input.channel ?? "push",
      payload: input.payload ? (input.payload as any) : undefined,
      status: env.NOTIFICATIONS_WEBHOOK_URL ? "pending" : "queued",
    },
  });

  if (!env.NOTIFICATIONS_WEBHOOK_URL || !hasFetch) {
    return record;
  }

  try {
    const response = await fetch(env.NOTIFICATIONS_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        notificationId: record.id,
        athleteId: input.athleteId,
        title: input.title,
        body: input.body,
        category: input.category ?? "general",
        channel: input.channel ?? "push",
        payload: input.payload ?? {},
      }),
    });

    if (!response.ok) {
      throw new Error(`Notification webhook responded with ${response.status}`);
    }

    await prisma.notification.update({
      where: { id: record.id },
      data: {
        status: "sent",
        sentAt: new Date(),
      },
    });
  } catch (error) {
    console.error("Failed to dispatch notification", error);
    await prisma.notification.update({
      where: { id: record.id },
      data: {
        status: "failed",
        lastError: error instanceof Error ? error.message : "Unknown error",
      },
    });
  }

  return record;
};
