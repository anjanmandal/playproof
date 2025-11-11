import { randomUUID } from "crypto";
import { Prisma } from "../generated/prisma/client";
import { prisma } from "../db/prisma";
import { env } from "../config/env";

export interface WearableSample {
  ts: number;
  ax: number;
  ay: number;
  az: number;
  gx: number;
  gy: number;
  gz: number;
  side?: "left" | "right";
}

export interface WearableSampleWindow {
  windowTs?: string;
  side?: "left" | "right";
  samples: WearableSample[];
}

export interface WearableFeatureOut {
  windowTs: string;
  contactMs?: number;
  stabilityMs?: number;
  valgusIdx0to3?: number;
  asymmetryPct?: number;
  yawSpike?: number;
  confidence0to1?: number;
  meta?: Record<string, unknown>;
}

const ensureWearablesEnabled = () => {
  if (!env.WEARABLES_ENABLED || env.WEARABLES_MODE === "off") {
    const error = new Error("Wearables integration is disabled");
    (error as Error & { status?: number }).status = 404;
    throw error;
  }
};

export const createWearableSession = async (input: {
  athleteId: string;
  drillType: string;
  deviceIds?: string[];
  surface?: string;
  tempF?: number;
  humidityPct?: number;
}) => {
  ensureWearablesEnabled();

  const session = await prisma.wearableSession.create({
    data: {
      athleteId: input.athleteId,
      drillType: input.drillType,
        deviceIds: input.deviceIds ? (input.deviceIds as Prisma.InputJsonValue) : undefined,
      surface: input.surface,
      tempF: input.tempF,
      humidityPct: input.humidityPct,
      startedAt: new Date(),
    },
  });

  return session;
};

const toNumeric = (value: number | undefined | null) =>
  Number.isFinite(value) ? Number(value) : undefined;

const computeFeatureForWindow = (window: WearableSampleWindow): WearableFeatureOut | null => {
  if (!window.samples || window.samples.length === 0) return null;

  const samples = [...window.samples].sort((a, b) => a.ts - b.ts);
  const baseTs = samples[0]?.ts ?? Date.now();
  const durationMs = (samples[samples.length - 1]?.ts ?? baseTs) - baseTs || 1;
  const sampleInterval =
    samples.length > 1 ? durationMs / (samples.length - 1 || 1) : 16;

  const magnitude = samples.map((s) => Math.sqrt(s.ax ** 2 + s.ay ** 2 + s.az ** 2));
  const lateral = samples.map((s) => s.ay);
  const yaw = samples.map((s) => Math.abs(s.gz));

  const landingThreshold = 18;
  const contactIdx = magnitude.findIndex((mag) => mag >= landingThreshold);
  const contactMs =
    contactIdx >= 0 ? Math.round(contactIdx * sampleInterval) : undefined;

  const stabilizationThreshold = 5;
  let stabilityMs: number | undefined;
  if (contactIdx >= 0) {
    for (let i = contactIdx; i < magnitude.length; i += 1) {
      const windowMag = magnitude.slice(i, i + 6);
      const avgMag =
        windowMag.reduce((acc, curr) => acc + curr, 0) / (windowMag.length || 1);
      if (avgMag < stabilizationThreshold) {
        stabilityMs = Math.round((i - contactIdx) * sampleInterval);
        break;
      }
    }
  }

  const lateralRms =
    Math.sqrt(lateral.reduce((acc, curr) => acc + curr ** 2, 0) / lateral.length) || 0;
  const valgusIdx0to3 =
    lateralRms < 6 ? 0 : lateralRms < 10 ? 1 : lateralRms < 14 ? 2 : 3;

  let asymmetryPct: number | undefined;
  const sides = new Set(samples.map((s) => s.side).filter(Boolean));
  if (sides.size >= 2) {
    const leftRms =
      Math.sqrt(
        samples
          .filter((s) => s.side === "left")
          .reduce((acc, curr) => acc + curr.ay ** 2, 0) /
          (samples.filter((s) => s.side === "left").length || 1),
      ) || 0;
    const rightRms =
      Math.sqrt(
        samples
          .filter((s) => s.side === "right")
          .reduce((acc, curr) => acc + curr.ay ** 2, 0) /
          (samples.filter((s) => s.side === "right").length || 1),
      ) || 0;
    if (leftRms + rightRms > 0) {
      asymmetryPct = Number(
        (
          (Math.abs(leftRms - rightRms) / Math.max(leftRms, rightRms)) *
          100
        ).toFixed(1),
      );
    }
  }

  const yawSpike = Math.max(...yaw);
  const signalEnergy = magnitude.reduce((acc, curr) => acc + curr ** 2, 0);
  const noiseEnergy =
    lateral.reduce((acc, curr) => acc + curr ** 2, 0) +
    yaw.reduce((acc, curr) => acc + curr ** 2, 0);
  const snr = signalEnergy > 0 ? signalEnergy / (noiseEnergy || 1) : 0;
  const completeness = Math.min(1, samples.length / 128);
  const confidence0to1 = Number(Math.max(0, Math.min(1, (snr / 25) * completeness)).toFixed(3));

  const windowTs =
    window.windowTs ??
    new Date(samples[Math.floor(samples.length / 2)]?.ts ?? Date.now()).toISOString();

  return {
    windowTs,
    contactMs: toNumeric(contactMs),
    stabilityMs: toNumeric(stabilityMs),
    valgusIdx0to3,
    asymmetryPct,
    yawSpike: Number(yawSpike.toFixed(3)),
    confidence0to1,
    meta: {
      sampleIntervalMs: Number(sampleInterval.toFixed(2)),
      windowDurationMs: Number(durationMs.toFixed(2)),
      sampleCount: samples.length,
      side: window.side ?? null,
    },
  };
};

const normaliseWindowsPayload = (body: unknown): WearableSampleWindow[] => {
  if (!body) return [];
  if (Array.isArray(body)) {
    return body as WearableSampleWindow[];
  }
  if (typeof body === "object") {
    const record = body as Record<string, unknown>;
    if (Array.isArray(record.windows)) {
      return record.windows as WearableSampleWindow[];
    }
    if (Array.isArray(record.samples)) {
      return [
        {
          windowTs: record.windowTs as string | undefined,
          side: record.side as "left" | "right" | undefined,
          samples: record.samples as WearableSample[],
        },
      ];
    }
    if (typeof record.raw === "string") {
      const lines = record.raw
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
      return lines
        .map((line) => {
          try {
            const parsed = JSON.parse(line) as WearableSampleWindow;
            return parsed;
          } catch {
            return null;
          }
        })
        .filter((item): item is WearableSampleWindow => Boolean(item));
    }
  }
  return [];
};

export const appendWearableSamples = async (
  sessionId: string,
  body: unknown,
) => {
  ensureWearablesEnabled();

  const session = await prisma.wearableSession.findUnique({
    where: { id: sessionId },
  });
  if (!session) {
    const error = new Error("Wearable session not found");
    (error as Error & { status?: number }).status = 404;
    throw error;
  }

  const windows = normaliseWindowsPayload(body);
  if (!windows.length) {
    return { features: [] as WearableFeatureOut[] };
  }

  const features: WearableFeatureOut[] = [];

  for (const window of windows) {
    const feature = computeFeatureForWindow(window);
    if (!feature) continue;

    await prisma.wearableFeature.create({
      data: {
        sessionId,
        windowTs: feature.windowTs,
        contactMs: feature.contactMs ?? null,
        stabilityMs: feature.stabilityMs ?? null,
        valgusIdx0to3: feature.valgusIdx0to3 ?? null,
        asymmetryPct: feature.asymmetryPct ?? null,
        yawSpike: feature.yawSpike ?? null,
        confidence0to1: feature.confidence0to1 ?? null,
        meta: feature.meta ? (feature.meta as Prisma.InputJsonValue) : undefined,
      },
    });

    features.push(feature);
  }

  await prisma.wearableSession.update({
    where: { id: sessionId },
    data: { updatedAt: new Date() },
  });

  return { features };
};

export const flushWearableSession = async (sessionId: string) => {
  ensureWearablesEnabled();
  const now = new Date();
  const session = await prisma.wearableSession.update({
    where: { id: sessionId },
    data: { endedAt: now, updatedAt: now },
  });
  return session;
};

export const listWearableFeatures = async (sessionId: string) => {
  ensureWearablesEnabled();
  const features = await prisma.wearableFeature.findMany({
    where: { sessionId },
    orderBy: { windowTs: "asc" },
  });
  return features.map((item) => ({
    id: item.id,
    windowTs: item.windowTs.toISOString(),
    contactMs: item.contactMs ?? undefined,
    stabilityMs: item.stabilityMs ?? undefined,
    valgusIdx0to3: item.valgusIdx0to3 ?? undefined,
    asymmetryPct: item.asymmetryPct ?? undefined,
    yawSpike: item.yawSpike ?? undefined,
    confidence0to1: item.confidence0to1 ?? undefined,
    meta: item.meta ?? undefined,
  }));
};

export const upsertWearableDevices = async (devicePayloads: Array<{ id?: string; type: string; side?: string; nickname?: string; athleteId?: string }>) => {
  ensureWearablesEnabled();
  if (!devicePayloads.length) return;
  const now = new Date();

  await Promise.all(
    devicePayloads.map(async (device) => {
      const id = device.id ?? randomUUID();
      await prisma.wearableDevice.upsert({
        where: { id },
        update: {
          type: device.type,
          side: device.side,
          nickname: device.nickname,
          athleteId: device.athleteId,
          lastSeenAt: now,
        },
        create: {
          id,
          type: device.type,
          side: device.side,
          nickname: device.nickname,
          athleteId: device.athleteId,
          lastSeenAt: now,
        },
      });
      return id;
    }),
  );
};
