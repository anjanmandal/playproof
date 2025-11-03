import { Request, Response } from "express";
import { z } from "zod";
import {
  buildDailyRiskRecommendation,
  listRiskSnapshots,
  acknowledgeRiskSnapshot,
  updateRiskSnapshotMeta,
  simulateRiskCounterfactuals,
  storeVideoRiskFeatures,
  getRiskSnapshotAudit,
  listLatestRiskSnapshotsForTeam,
} from "../services/riskService";

const parseJSON = <T>(value: unknown): T | undefined => {
  if (value === null || value === undefined) return undefined;
  if (typeof value === "string") {
    try {
      return JSON.parse(value) as T;
    } catch {
      return undefined;
    }
  }
  return value as T;
};

const serializeSnapshot = (snapshot: any) => {
  const drivers = parseJSON<string[]>(snapshot.drivers);
  const driverScores = parseJSON<Record<string, number>>(snapshot.driverScores);
  const microPlan = parseJSON<{ drills: any[] }>(snapshot.microPlan);
  const nextRepCheck = parseJSON<any>(snapshot.nextRepCheck);
  const environmentPolicyFlags = parseJSON<string[]>(snapshot.environmentPolicyFlags);
  const rawModelOutput = parseJSON<any>(snapshot.rawModelOutput ?? null) ?? null;

  return {
    ...snapshot,
    drivers: drivers ?? undefined,
    driverScores: driverScores ?? undefined,
    microPlan: microPlan ?? undefined,
    nextRepCheck: nextRepCheck ?? undefined,
    environmentPolicyFlags: environmentPolicyFlags ?? undefined,
    rawModelOutput,
    recordedFor: snapshot.recordedFor?.toISOString?.() ?? snapshot.recordedFor,
    createdAt: snapshot.createdAt?.toISOString?.() ?? snapshot.createdAt,
    updatedAt: snapshot.updatedAt?.toISOString?.() ?? snapshot.updatedAt,
  };
};

const riskSchema = z.object({
  athleteId: z.string(),
  athleteName: z.string().optional(),
  recordedFor: z.string().optional(),
  exposureMinutes: z.number().min(0),
  surface: z.enum(["turf", "grass", "wet_grass", "indoor", "court"]),
  temperatureF: z.number(),
  humidityPct: z.number(),
  priorLowerExtremityInjury: z.boolean(),
  sorenessLevel: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]),
  fatigueLevel: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]),
  bodyWeightTrend: z.enum(["up", "down", "stable"]).optional(),
  menstrualPhase: z.enum(["follicular", "ovulatory", "luteal", "menstrual", "unspecified"]).optional(),
  notes: z.string().optional(),
});

const simulateSchema = z.object({
  athleteId: z.string(),
  context: z
    .object({
      exposureMinutes: z.number().optional(),
      surface: z.enum(["turf", "grass", "wet_grass", "indoor", "court"]).optional(),
      temperatureF: z.number().optional(),
      humidityPct: z.number().optional(),
      priorLowerExtremityInjury: z.boolean().optional(),
      sorenessLevel: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]).optional(),
      fatigueLevel: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]).optional(),
      bodyWeightTrend: z.enum(["up", "down", "stable"]).optional(),
      menstrualPhase: z.enum(["follicular", "ovulatory", "luteal", "menstrual", "unspecified"]).optional(),
      notes: z.string().optional(),
    })
    .partial()
    .optional(),
  tweaks: z.array(z.string().min(1)).min(1, "Provide at least one tweak to simulate."),
});

const videoFeatureSchema = z.object({
  athleteId: z.string(),
  features: z
    .record(z.string(), z.union([z.string(), z.number(), z.boolean()]))
    .refine((record) => Object.keys(record).length > 0, "Provide at least one feature value."),
});

export const postDailyRisk = async (req: Request, res: Response) => {
  const parsed = riskSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const recommendation = await buildDailyRiskRecommendation(parsed.data);

  return res.status(201).json(recommendation);
};

const listQuerySchema = z.object({ limit: z.coerce.number().min(1).max(60).optional() });

export const getRiskHistory = async (req: Request, res: Response) => {
  const { athleteId } = req.params;
  if (!athleteId) {
    return res.status(400).json({ error: "athleteId is required" });
  }
  const query = listQuerySchema.safeParse(req.query);

  if (!query.success) {
    return res.status(400).json({ error: query.error.flatten() });
  }

  const snapshots = await listRiskSnapshots(athleteId, query.data.limit ?? 30);

  return res.json({
    snapshots: snapshots.map(serializeSnapshot),
  });
};

export const acknowledgeRisk = async (req: Request, res: Response) => {
  const { snapshotId } = req.params;
  if (!snapshotId) {
    return res.status(400).json({ error: "snapshotId is required" });
  }

  try {
    await acknowledgeRiskSnapshot(snapshotId);
    return res.status(200).json({ acknowledged: true });
  } catch (error) {
    return res.status(404).json({ error: (error as Error).message });
  }
};

const adherenceSchema = z
  .object({
    adherence_0_1: z.number().min(0).max(1).optional(),
    next_rep_check: z
      .object({
        required: z.boolean().optional(),
        received: z.boolean().optional(),
        result: z.enum(["better", "same", "worse"]).optional(),
      })
      .optional(),
  })
  .refine(
    (payload) =>
      payload.adherence_0_1 !== undefined ||
      (payload.next_rep_check !== undefined && Object.keys(payload.next_rep_check ?? {}).length > 0),
    "Provide adherence_0_1 or next_rep_check payload.",
  );

export const updateAdherence = async (req: Request, res: Response) => {
  const { snapshotId } = req.params;
  if (!snapshotId) {
    return res.status(400).json({ error: "snapshotId is required" });
  }

  const parsed = adherenceSchema.safeParse(req.body ?? {});
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  try {
    const nextRepCheck =
      parsed.data.next_rep_check !== undefined
        ? {
            required: Boolean(parsed.data.next_rep_check?.required),
            received: Boolean(parsed.data.next_rep_check?.received),
            result: parsed.data.next_rep_check?.result,
          }
        : undefined;

    const updated = await updateRiskSnapshotMeta(snapshotId, {
      adherence0to1: parsed.data.adherence_0_1,
      nextRepCheck,
    });

    return res.json({ snapshot: serializeSnapshot(updated) });
  } catch (error) {
    if ((error as Error).message.includes("No fields provided")) {
      return res.status(400).json({ error: "Provide adherence_0_1 or next_rep_check payload." });
    }
    return res.status(404).json({ error: (error as Error).message });
  }
};

export const simulateRisk = async (req: Request, res: Response) => {
  const parsed = simulateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const simulations = await simulateRiskCounterfactuals(parsed.data);
  return res.json({ simulations });
};

export const ingestRiskVideoFeatures = async (req: Request, res: Response) => {
  const parsed = videoFeatureSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  await storeVideoRiskFeatures(parsed.data.athleteId, parsed.data.features);
  return res.status(204).send();
};

export const getRiskAudit = async (req: Request, res: Response) => {
  const { snapshotId } = req.params;
  if (!snapshotId) {
    return res.status(400).json({ error: "snapshotId is required" });
  }

  try {
    const audit = await getRiskSnapshotAudit(snapshotId);
    return res.json(audit);
  } catch (error) {
    return res.status(404).json({ error: (error as Error).message });
  }
};

export const getTeamRiskSnapshots = async (req: Request, res: Response) => {
  const { teamId } = req.params;
  if (!teamId) {
    return res.status(400).json({ error: "teamId is required" });
  }

  const date = typeof req.query.date === "string" ? req.query.date : undefined;

  const entries = await listLatestRiskSnapshotsForTeam(teamId, date);

  return res.json({
    snapshots: entries.map(({ athlete, snapshot }) =>
      serializeSnapshot({
        ...snapshot,
        athlete,
      }),
    ),
  });
};
