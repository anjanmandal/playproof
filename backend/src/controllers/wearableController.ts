import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import {
  appendWearableSamples,
  createWearableSession,
  flushWearableSession,
  listWearableFeatures,
  upsertWearableDevices,
  WearableSampleWindow,
} from "../services/wearableService";
import { env } from "../config/env";

const sessionRequestSchema = z.object({
  athleteId: z.string().min(1, "athleteId is required"),
  drillType: z.string().min(1, "drillType is required"),
  deviceIds: z.array(z.string()).optional(),
  surface: z.string().optional(),
  tempF: z.number().int().optional(),
  humidityPct: z.number().int().optional(),
  devices: z
    .array(
      z.object({
        id: z.string().optional(),
        type: z.string().min(1),
        side: z.string().optional(),
        nickname: z.string().optional(),
      }),
    )
    .optional(),
});

const featureRequestSchema = z.object({
  sessionId: z.string().min(1),
});

export const ensureWearableFeatureFlag = (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!env.WEARABLES_ENABLED || env.WEARABLES_MODE === "off") {
    res.status(404).json({ error: "Wearable integration is disabled" });
    return;
  }
  next();
};

export const postWearableSession = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = sessionRequestSchema.parse(req.body ?? {});
    if (parsed.devices && parsed.devices.length) {
      await upsertWearableDevices(
        parsed.devices.map((device) => ({
          ...device,
          athleteId: parsed.athleteId,
        })),
      );
    }
    const session = await createWearableSession(parsed);
    res.status(201).json({ sessionId: session.id, session });
  } catch (error) {
    next(error);
  }
};

const parseWindowsFromRequest = (req: Request): WearableSampleWindow[] => {
  if (req.is("application/x-ndjson") && typeof req.body === "string") {
    return req.body
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        try {
          return JSON.parse(line) as WearableSampleWindow;
        } catch {
          return null;
        }
      })
      .filter((record): record is WearableSampleWindow => Boolean(record));
  }
  return req.body?.windows ?? req.body ?? [];
};

export const postWearableSamples = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sessionId } = featureRequestSchema.parse({
      sessionId: req.params.sessionId ?? req.body?.sessionId,
    });

    const windows = parseWindowsFromRequest(req);

    const result = await appendWearableSamples(sessionId, { windows });
    res.status(202).json(result);
  } catch (error) {
    next(error);
  }
};

export const postWearableFlush = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sessionId } = featureRequestSchema.parse({
      sessionId: req.params.sessionId ?? req.body?.sessionId,
    });
    const session = await flushWearableSession(sessionId);
    res.json({ session });
  } catch (error) {
    next(error);
  }
};

export const getWearableFeatures = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sessionId } = featureRequestSchema.parse({
      sessionId: req.params.sessionId,
    });
    const features = await listWearableFeatures(sessionId);
    res.json({ features });
  } catch (error) {
    next(error);
  }
};
