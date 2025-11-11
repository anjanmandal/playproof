import { Request, Response } from "express";
import { CycleShareScope } from "../generated/prisma/client";
import {
  getCyclePrivacySetting,
  setCycleShareScope,
  recordCycleShare,
  inferCyclePhaseAI,
  generateWarmupSummary,
} from "../services/cycleService";
import type { CycleSignals, CycleSymptom, PhaseEstimate, PhasePolicy } from "../types/cycle";

const serializeSetting = (setting: Awaited<ReturnType<typeof getCyclePrivacySetting>>) => ({
  shareScope: (setting?.shareScope ?? CycleShareScope.OFF).toLowerCase(),
  lastSharedPhase: setting?.lastSharedPhase ?? null,
  lastSharedConfidence: setting?.lastSharedConfidence ?? null,
  lastSharedAt: setting?.lastSharedAt?.toISOString() ?? null,
});

const ensureAthleteAccess = (req: Request, athleteId: string) => {
  if (!req.user || req.user.role !== "ATHLETE" || req.user.athleteId !== athleteId) {
    return false;
  }
  return true;
};

const parseShareScope = (value: string | undefined): CycleShareScope | null => {
  if (!value) return null;
  switch (value.toLowerCase()) {
    case "off":
      return CycleShareScope.OFF;
    case "private":
      return CycleShareScope.PRIVATE;
    case "share_label":
      return CycleShareScope.SHARE_LABEL;
    default:
      return null;
  }
};

export const getCyclePrivacy = async (req: Request, res: Response) => {
  const { athleteId } = req.params;
  if (!athleteId) {
    return res.status(400).json({ error: "athleteId is required" });
  }
  if (!ensureAthleteAccess(req, athleteId)) {
    return res.status(403).json({ error: "Only the athlete can view cycle privacy settings." });
  }
  const setting = await getCyclePrivacySetting(athleteId);
  return res.json({ setting: serializeSetting(setting) });
};

export const updateCyclePrivacy = async (req: Request, res: Response) => {
  const { athleteId } = req.params;
  const { shareScope } = req.body as { shareScope?: string };
  if (!athleteId) {
    return res.status(400).json({ error: "athleteId is required" });
  }
  if (!ensureAthleteAccess(req, athleteId)) {
    return res.status(403).json({ error: "Only the athlete can update cycle privacy settings." });
  }
  const parsed = parseShareScope(shareScope);
  if (!parsed) {
    return res.status(400).json({ error: "Invalid shareScope" });
  }
  const updated = await setCycleShareScope(athleteId, parsed);
  return res.json({ setting: serializeSetting(updated) });
};

export const shareCyclePhase = async (req: Request, res: Response) => {
  const { athleteId } = req.params;
  const { phase, confidenceBucket } = req.body as {
    phase?: string;
    confidenceBucket?: "low" | "med" | "high";
  };
  if (!athleteId) {
    return res.status(400).json({ error: "athleteId is required" });
  }
  if (!ensureAthleteAccess(req, athleteId)) {
    return res.status(403).json({ error: "Only the athlete can share cycle labels." });
  }
  if (!phase || !confidenceBucket) {
    return res
      .status(400)
      .json({ error: "phase and confidenceBucket are required to share a label." });
  }
  const privacy = await getCyclePrivacySetting(athleteId);
  if (privacy?.shareScope !== CycleShareScope.SHARE_LABEL) {
    return res
      .status(403)
      .json({ error: "Sharing is disabled. Switch to 'share label' to send updates." });
  }
  const updated = await recordCycleShare(athleteId, phase, confidenceBucket);
  return res.json({ setting: serializeSetting(updated) });
};

const sanitizeSignals = (payload: unknown): CycleSignals => {
  if (!payload || typeof payload !== "object") return {};
  const source = payload as Record<string, unknown>;
  const sanitized: CycleSignals = {};
  if (typeof source.lastPeriodISO === "string") sanitized.lastPeriodISO = source.lastPeriodISO;
  if (typeof source.avgCycleDays === "number") sanitized.avgCycleDays = source.avgCycleDays;
  const allowedSymptoms = new Set<CycleSymptom>(["cramp", "fatigue", "migraine", "heavy_flow", "none"]);
  if (Array.isArray(source.symptoms)) {
    sanitized.symptoms = source.symptoms.filter(
      (value): value is CycleSymptom => typeof value === "string" && allowedSymptoms.has(value as CycleSymptom),
    );
  }
  if (source.hrvTrend === "up" || source.hrvTrend === "down" || source.hrvTrend === "flat") {
    sanitized.hrvTrend = source.hrvTrend;
  }
  if (source.tempTrend === "up" || source.tempTrend === "down" || source.tempTrend === "flat") {
    sanitized.tempTrend = source.tempTrend;
  }
  if (
    source.contraception === "none" ||
    source.contraception === "combined_ocp" ||
    source.contraception === "iud" ||
    source.contraception === "implant" ||
    source.contraception === "other"
  ) {
    sanitized.contraception = source.contraception;
  }
  return sanitized;
};

const sanitizeEstimate = (payload: unknown): PhaseEstimate | null => {
  if (!payload || typeof payload !== "object") return null;
  const record = payload as Record<string, unknown>;
  const phase = typeof record.phase === "string" ? record.phase : "unsure";
  const confidence =
    typeof record.confidence0to1 === "number" ? Math.max(0, Math.min(1, record.confidence0to1)) : 0.6;
  const reasons = Array.isArray(record.reasons)
    ? record.reasons.map((reason) => String(reason)).slice(0, 4)
    : [];
  return { phase: phase as PhaseEstimate["phase"], confidence0to1: confidence, reasons };
};

const sanitizePolicy = (payload: unknown): PhasePolicy | null => {
  if (!payload || typeof payload !== "object") return null;
  const record = payload as Record<string, unknown>;
  const warmupExtraMin =
    typeof record.warmupExtraMin === "number" ? Math.max(0, record.warmupExtraMin) : 4;
  const cutDensityDelta =
    typeof record.cutDensityDelta === "number" ? Math.max(-1, Math.min(1, record.cutDensityDelta)) : -0.1;
  const landingFocus = Boolean(record.landingFocus);
  const cueVigilance = record.cueVigilance === "high" ? "high" : "normal";
  return { warmupExtraMin, cutDensityDelta, landingFocus, cueVigilance };
};

export const inferCyclePhase = async (req: Request, res: Response) => {
  const { athleteId } = req.params;
  if (!athleteId) {
    return res.status(400).json({ error: "athleteId is required" });
  }
  if (!ensureAthleteAccess(req, athleteId)) {
    return res.status(403).json({ error: "Only the athlete can request AI inference." });
  }
  const signals = sanitizeSignals(req.body ?? {});
  const estimate = await inferCyclePhaseAI(signals);
  return res.json({ estimate });
};

export const generateCycleWarmup = async (req: Request, res: Response) => {
  const { athleteId } = req.params;
  if (!athleteId) {
    return res.status(400).json({ error: "athleteId is required" });
  }
  if (!ensureAthleteAccess(req, athleteId)) {
    return res.status(403).json({ error: "Only the athlete can request warmup guidance." });
  }
  const signals = sanitizeSignals(req.body?.signals ?? {});
  const estimate = sanitizeEstimate(req.body?.estimate) ?? (await inferCyclePhaseAI(signals));
  const policy =
    sanitizePolicy(req.body?.policy ?? {}) ?? {
      warmupExtraMin: 4,
      cutDensityDelta: -0.1,
      landingFocus: true,
      cueVigilance: "normal",
    };
  const summary = await generateWarmupSummary(signals, estimate, policy);
  return res.json({ summary });
};
