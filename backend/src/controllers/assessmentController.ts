import { Request, Response } from "express";
import { z } from "zod";
import {
  createMovementAssessment,
  listMovementAssessments,
  getMovementAssessment,
  updateMovementProofAssignment,
  updateMovementProofCompletion,
} from "../services/assessmentService";
import type {
  MovementBandWindow,
  MovementMicroPlan,
  MovementProofSummary,
  MovementVerdict,
  OverlayInstruction,
} from "../types/assessments";

const movementAssessmentSchema = z.object({
  athleteId: z.string(),
  drillType: z.enum(["drop_jump", "planned_cut", "unplanned_cut"]),
  sessionId: z.string().optional(),
  context: z
    .object({
      surface: z.string().optional(),
      environment: z.string().optional(),
      temperatureF: z.number().optional(),
      humidityPct: z.number().optional(),
      notes: z.string().optional(),
      athleteProfile: z
        .object({
          name: z.string().optional(),
          sex: z.enum(["male", "female", "nonbinary"]).optional(),
          position: z.string().optional(),
          level: z.string().optional(),
          age: z.number().optional(),
        })
        .optional(),
    })
    .optional(),
  frames: z
    .array(
      z.object({
        id: z.string(),
        url: z.string().url(),
        label: z.string().optional(),
        capturedAt: z.string(),
      }),
    )
    .min(1, "At least one frame is required"),
});

const parseJsonField = <T>(value: unknown): T | undefined => {
  if (!value) return undefined;
  if (typeof value === "string") {
    try {
      return JSON.parse(value) as T;
    } catch {
      return undefined;
    }
  }
  if (typeof value === "object") {
    return value as T;
  }
  return undefined;
};

const safeNumber = (value: unknown): number | null => {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
};

const classifyViewQualityLabel = (score?: number | null): "low" | "medium" | "high" | undefined => {
  if (score === undefined || score === null) return undefined;
  if (score >= 0.75) return "high";
  if (score >= 0.55) return "medium";
  return "low";
};

const computeBandSummary = (baseline?: Record<string, unknown> | null): MovementBandWindow[] | undefined => {
  if (!baseline || typeof baseline !== "object") return undefined;
  const summary: MovementBandWindow[] = [];

  const addWindow = (
    metric: string,
    label: string,
    value: number,
    threshold: number,
    units?: string,
    absolute = true,
  ) => {
    const magnitude = absolute ? Math.abs(value) : Math.abs(value);
    summary.push({
      metric,
      label,
      delta: Number(value.toFixed(3)),
      units,
      status: magnitude <= threshold ? "inside" : "outside",
      zScore: metric.endsWith("sigma") ? Number(value.toFixed(3)) : undefined,
    });
  };

  const attempt = (keys: string[], label: string, threshold: number, units?: string) => {
    const raw = keys
      .map((key) => baseline[key])
      .find((value) => value !== undefined && value !== null);
    const value = safeNumber(raw);
    if (value === null) return;
    addWindow(keys[0] ?? label, label, value, threshold, units);
  };

  attempt(["knee_valgus_sigma", "valgus_sigma", "kneeValgusSigma"], "Knee valgus (σ)", 1);
  attempt(["valgus_angle_deg", "knee_valgus_deg"], "Peak valgus (°)", 5, "deg");
  attempt(["time_to_stable_ms", "timeToStableMs"], "Time to stable (ms)", 100, "ms");

  Object.entries(baseline).forEach(([key, raw]) => {
    if (summary.some((band) => band.metric === key)) return;
    const value = safeNumber(raw);
    if (value === null) return;
    if (key.endsWith("_sigma")) addWindow(key, key.replace(/_/g, " "), value, 1, undefined);
    else if (key.endsWith("_deg")) addWindow(key, key.replace(/_/g, " "), value, 5, "deg");
    else if (key.endsWith("_ms")) addWindow(key, key.replace(/_/g, " "), value, 120, "ms");
  });

  return summary.length ? summary : undefined;
};

const cloneMicroPlan = (plan?: MovementMicroPlan | undefined, quickAssign?: boolean): MovementMicroPlan | undefined => {
  if (!plan) return undefined;
  return {
    ...plan,
    quickAssignAvailable: quickAssign ?? plan.quickAssignAvailable,
    drills: Array.isArray(plan.drills) ? plan.drills.map((drill) => ({ ...drill })) : [],
    completion: plan.completion
      ? {
          ...plan.completion,
        }
      : plan.completion,
  };
};

const formatProofRecord = (
  proof: any,
  viewQuality?: ReturnType<typeof parseViewQualityFromRaw>,
  fallbackMicroPlan?: MovementMicroPlan,
): MovementProofSummary | undefined => {
  if (!proof) return undefined;

  const band = parseJsonField<MovementBandWindow[]>(proof.bandDelta) ?? undefined;
  const metrics = parseJsonField<Record<string, number | boolean | null>>(proof.metrics) ?? undefined;
  const baselineBand = parseJsonField<Record<string, unknown>>(proof.baselineBand) ?? null;
  const microPlanSource = parseJsonField<MovementMicroPlan>(proof.microPlan) ?? fallbackMicroPlan;
  const microPlan = cloneMicroPlan(microPlanSource, !proof.fixAssigned);

  const completion = {
    completed: Boolean(proof.microPlanCompleted),
    completedAt: proof.microPlanCompletedAt
      ? proof.microPlanCompletedAt instanceof Date
        ? proof.microPlanCompletedAt.toISOString()
        : new Date(proof.microPlanCompletedAt).toISOString()
      : undefined,
    rpe: proof.microPlanRpe ?? null,
    pain: proof.microPlanPain ?? null,
  };

  if (microPlan) {
    microPlan.completion = completion;
    if (completion.completed) {
      microPlan.quickAssignAvailable = false;
    }
  }

  const score = proof.viewQualityScore ?? viewQuality?.score0to1 ?? null;
  const summary: MovementProofSummary = {
    id: proof.id,
    verdict: proof.verdict as MovementVerdict,
    verdictReason: proof.verdictReason ?? undefined,
    withinBand: proof.withinBand ?? undefined,
    band,
    viewQuality: {
      score0to1: score,
      label: proof.viewQualityLabel ?? classifyViewQualityLabel(score),
      fixInstructions: viewQuality?.fixInstructions ?? undefined,
      retryRecommended: viewQuality?.retryRecommended,
    },
    cue: proof.cue ?? null,
    metrics,
    baselineBand,
    uncertainty0to1: proof.uncertainty0to1 ?? undefined,
    microPlan,
    fixAssigned: proof.fixAssigned ?? false,
    completion,
    proofAt: proof.proofAt?.toISOString?.() ?? new Date(proof.proofAt).toISOString(),
  };

  return summary;
};

export const postMovementAssessment = async (req: Request, res: Response) => {
  const parsed = movementAssessmentSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const result = await createMovementAssessment(parsed.data);

  return res.status(201).json(result);
};

const listQuerySchema = z.object({
  limit: z.coerce.number().min(1).max(100).optional(),
});

const proofPatchSchema = z
  .object({
    fixAssigned: z.boolean().optional(),
    completed: z.boolean().optional(),
    rpe: z.number().min(0).max(10).optional(),
    pain: z.number().min(0).max(10).optional(),
  })
  .refine(
    (value) => {
      if (value.rpe !== undefined || value.pain !== undefined) {
        return value.completed === true;
      }
      return true;
    },
    { message: "Provide completed: true when logging RPE or pain." },
  );

export const getAthleteAssessments = async (req: Request, res: Response) => {
  const { athleteId } = req.params;
  if (!athleteId) {
    return res.status(400).json({ error: "athleteId is required" });
  }
  const query = listQuerySchema.safeParse(req.query);

  if (!query.success) {
    return res.status(400).json({ error: query.error.flatten() });
  }

  const assessments = await listMovementAssessments(athleteId, query.data.limit ?? 20);

  return res.json({ assessments: assessments.map(serializeAssessment) });
};

export const getAssessmentDetail = async (req: Request, res: Response) => {
  const { assessmentId } = req.params;
  if (!assessmentId) {
    return res.status(400).json({ error: "assessmentId is required" });
  }

  const assessment = await getMovementAssessment(assessmentId);

  if (!assessment) {
    return res.status(404).json({ error: "Assessment not found" });
  }

  return res.json({ assessment: serializeAssessment(assessment) });
};

export const patchMovementProof = async (req: Request, res: Response) => {
  const { assessmentId } = req.params;
  if (!assessmentId) {
    return res.status(400).json({ error: "assessmentId is required" });
  }

  const parsed = proofPatchSchema.safeParse(req.body ?? {});
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  try {
    let latest: Awaited<ReturnType<typeof updateMovementProofAssignment>> | undefined;

    if (parsed.data.fixAssigned !== undefined) {
      latest = await updateMovementProofAssignment(assessmentId, parsed.data.fixAssigned);
    }

    if (parsed.data.completed !== undefined) {
      latest = await updateMovementProofCompletion(assessmentId, {
        completed: parsed.data.completed,
        rpe: parsed.data.rpe,
        pain: parsed.data.pain,
      });
    }

    if (!latest) {
      return res.status(400).json({ error: "No changes supplied." });
    }

    const assessmentRecord = latest.assessment ?? null;
    const viewQualityFromAssessment =
      parseJsonField<any>(assessmentRecord?.viewQuality) ??
      parseViewQualityFromRaw(parseRawModelOutput(assessmentRecord?.rawModelOutput ?? null));

    const normalizedViewQuality =
      viewQualityFromAssessment && typeof viewQualityFromAssessment === "object" && typeof viewQualityFromAssessment.score0to1 === "number"
        ? {
            score0to1: viewQualityFromAssessment.score0to1,
            fixInstructions:
              viewQualityFromAssessment.fixInstructions ??
              viewQualityFromAssessment.fix_instructions ??
              null,
            retryRecommended:
              viewQualityFromAssessment.retryRecommended ??
              viewQualityFromAssessment.retry_recommended ??
              viewQualityFromAssessment.score0to1 < 0.6,
          }
        : parseViewQualityFromRaw(parseRawModelOutput(assessmentRecord?.rawModelOutput ?? null));

    const microPlan = parseJsonField<MovementMicroPlan>(assessmentRecord?.microPlan);
    const proofSummary = formatProofRecord(latest, normalizedViewQuality, microPlan ?? undefined);

    return res.json({ proof: proofSummary });
  } catch (error) {
    return res.status(404).json({ error: (error as Error).message });
  }
};

const serializeAssessment = (assessment: any) => {
  const raw = parseRawModelOutput(assessment.rawModelOutput);

  const overview = assessment.overview ?? raw?.overview ?? null;
  const riskSignals = assessment.riskSignals ?? parseRiskSignalsFromRaw(raw);
  const coachingPlan = assessment.coachingPlan ?? raw?.coachingPlan ?? raw?.coaching_plan ?? null;
  const phaseScores = assessment.phaseScores ?? parsePhaseScoresFromRaw(raw);

  const storedViewQuality = parseJsonField<any>(assessment.viewQuality);
  const viewQuality =
    storedViewQuality && typeof storedViewQuality === "object" && typeof storedViewQuality.score0to1 === "number"
      ? {
          score0to1: storedViewQuality.score0to1,
          fixInstructions: storedViewQuality.fixInstructions ?? storedViewQuality.fix_instructions ?? null,
          retryRecommended:
            storedViewQuality.retryRecommended ??
            storedViewQuality.retry_recommended ??
            storedViewQuality.score0to1 < 0.6,
        }
      : parseViewQualityFromRaw(raw);

  const counterfactual = assessment.counterfactual ?? parseCounterfactualFromRaw(raw);
  const asymmetryIndex0to100 = assessment.asymmetryIndex0to100 ?? raw?.asymmetry_index_0_100 ?? null;

  const baselineBand =
    parseJsonField<Record<string, unknown>>(assessment.baselineBand) ??
    (raw?.delta_from_baseline ?? null);

  const overlaysFromDb = overlaysFromAssessment(assessment.overlays);
  const overlays = overlaysFromDb.length ? overlaysFromDb : parseOverlaysFromRaw(raw) ?? [];
  const timeToStableMs =
    assessment.timeToStableMs ??
    raw?.time_to_stable_ms ??
    raw?.phase_scores?.stabilization?.time_to_stable_ms ??
    null;
  const groundContactTimeMs = assessment.groundContactTimeMs ?? raw?.ground_contact_time_ms ?? null;
  const peakRiskPhase = assessment.peakRiskPhase ?? raw?.peak_risk_phase ?? null;

  const storedMicroPlan = parseJsonField<MovementMicroPlan>(assessment.microPlan);
  const proofSummary = formatProofRecord(assessment.proof, viewQuality, storedMicroPlan ?? undefined);

  const microPlan = proofSummary?.microPlan
    ? cloneMicroPlan(proofSummary.microPlan, proofSummary.microPlan.quickAssignAvailable)
    : cloneMicroPlan(storedMicroPlan, storedMicroPlan?.quickAssignAvailable);

  const bandSummary = proofSummary?.band ?? computeBandSummary(baselineBand ?? undefined);
  const verdict = (assessment.verdict ?? proofSummary?.verdict) as MovementVerdict | undefined;
  const verdictReason = assessment.verdictReason ?? proofSummary?.verdictReason ?? undefined;
  const uncertainty0to1 = assessment.bandUncertainty0to1 ?? proofSummary?.uncertainty0to1 ?? undefined;

  const proof = proofSummary
    ? {
        ...proofSummary,
        completion: proofSummary.completion ? { ...proofSummary.completion } : undefined,
        microPlan: proofSummary.microPlan
          ? cloneMicroPlan(proofSummary.microPlan, proofSummary.microPlan.quickAssignAvailable)
          : undefined,
      }
    : undefined;

  return {
    ...assessment,
    cues: JSON.parse(assessment.cues ?? "[]"),
    metrics: JSON.parse(assessment.metrics ?? "{}"),
    context: assessment.context ? JSON.parse(assessment.context) : null,
    rawModelOutput: raw,
    overview,
    riskSignals,
    coachingPlan,
    phaseScores,
    viewQuality,
    counterfactual,
    asymmetryIndex0to100,
    deltaFromBaseline: baselineBand ?? null,
    overlays,
    timeToStableMs,
    groundContactTimeMs,
    peakRiskPhase,
    verdict,
    verdictReason,
    bandSummary,
    microPlan,
    uncertainty0to1,
    proof,
    createdAt: assessment.createdAt?.toISOString?.() ?? assessment.createdAt,
    updatedAt: assessment.updatedAt?.toISOString?.() ?? assessment.updatedAt,
    frames: assessment.frames?.map((frame: any) => ({
      ...frame,
      capturedAt: frame.capturedAt?.toISOString?.() ?? frame.capturedAt,
      createdAt: frame.createdAt?.toISOString?.() ?? frame.createdAt,
    })),
  };
};

const parseRawModelOutput = (raw: string | null) => {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
};

const parseRiskSignalsFromRaw = (raw: any | null) => {
  const source = raw?.riskSignals ?? raw?.risk_signals;
  if (!Array.isArray(source)) return undefined;
  return source.map((signal) => ({
    label: signal?.label ?? "",
    severity: signal?.severity === "low" || signal?.severity === "high" ? signal.severity : "moderate",
    evidence: signal?.evidence ?? "",
  })).filter((signal) => signal.label);
};

const parsePhaseScoresFromRaw = (raw: any | null) => {
  const source = raw?.phase_scores;
  if (!source || typeof source !== "object") return undefined;
  const map = (phase: any) =>
    phase && typeof phase === "object"
      ? {
          quality0to3: phase.quality_0_3 ?? phase.quality ?? null,
          notes: phase.notes ?? null,
          riskDriver: phase.risk_driver ?? phase.riskDriver ?? null,
          timeToStableMs: phase.time_to_stable_ms ?? phase.timeToStableMs ?? null,
        }
      : undefined;

  return {
    prep: map(source.prep),
    takeoff: map(source.takeoff),
    firstContact: map(source.first_contact ?? source.firstContact),
    stabilization: map(source.stabilization),
  };
};

const parseViewQualityFromRaw = (raw: any | null) => {
  const source = raw?.view_quality ?? raw?.viewQuality;
  if (!source || typeof source !== "object") return undefined;
  if (typeof source.score_0_1 !== "number") return undefined;
  return {
    score0to1: source.score_0_1,
    fixInstructions: source.fix_instructions ?? source.fixInstructions ?? null,
    retryRecommended: source.retry_recommended ?? source.retryRecommended ?? source.score_0_1 < 0.6,
  };
};

const parseCounterfactualFromRaw = (raw: any | null) => {
  const source = raw?.counterfactual;
  if (!source || typeof source !== "object" || !source.tweak) return undefined;
  return {
    tweak: source.tweak,
    predictedRiskDrop: typeof source.predicted_risk_drop === "number" ? source.predicted_risk_drop : 0,
    nextRepVerify: Boolean(source.next_rep_verify ?? source.nextRepVerify),
    summary: source.summary ?? undefined,
  };
};

const parseOverlayMetrics = (value: unknown): Record<string, number | null> | undefined => {
  if (!value || typeof value !== "object") return undefined;
  const entries: Array<[string, number | null]> = [];
  for (const [key, rawValue] of Object.entries(value as Record<string, unknown>)) {
    if (rawValue === null || rawValue === undefined) {
      entries.push([key, null]);
      continue;
    }
    const num = Number(rawValue);
    if (Number.isFinite(num)) {
      entries.push([key, num as number]);
    }
  }
  if (!entries.length) return undefined;
  return Object.fromEntries(entries);
};

const parseOverlayVisualization = (
  value: unknown,
): Array<Record<string, unknown>> | undefined => {
  if (!value) return undefined;
  if (typeof value === "string") {
    const parsed = parseJsonField<Array<Record<string, unknown>>>(value);
    return Array.isArray(parsed) ? parsed : undefined;
  }
  if (Array.isArray(value)) {
    return value.filter((item) => item && typeof item === "object") as Array<Record<string, unknown>>;
  }
  if (typeof value === "object") {
    return [value as Record<string, unknown>];
  }
  return undefined;
};

const normalizeOverlayRecord = (overlay: any): OverlayInstruction | null => {
  if (!overlay || typeof overlay !== "object") return null;
  const overlayType =
    typeof overlay.overlayType === "string"
      ? overlay.overlayType
      : typeof overlay.overlay_type === "string"
      ? overlay.overlay_type
      : "";
  if (!overlayType) return null;

  const severityRaw = overlay.severity;
  const severity =
    severityRaw === "low" || severityRaw === "moderate" || severityRaw === "high"
      ? severityRaw
      : undefined;

  const bandStatusRaw = overlay.bandStatus ?? overlay.band_status;
  const bandStatus =
    bandStatusRaw === "inside" || bandStatusRaw === "outside" ? bandStatusRaw : undefined;

  const metricsSource = overlay.metrics ?? overlay.metricsJson ?? overlay.metrics_json;
  const metricsParsed =
    typeof metricsSource === "string"
      ? parseJsonField<Record<string, unknown>>(metricsSource)
      : metricsSource;
  const metrics = parseOverlayMetrics(metricsParsed);

  const visualizationSource =
    overlay.visualization ?? overlay.visualization_json ?? overlay.visualizationJson;
  const visualization = parseOverlayVisualization(visualizationSource);

  return {
    overlayType,
    label: overlay.label ?? overlay.overlay_label ?? undefined,
    description: overlay.description ?? undefined,
    instructions: overlay.instructions ?? undefined,
    severity,
    bandStatus,
    metrics,
    visualization,
    beforeImageUrl: overlay.beforeImageUrl ?? overlay.before_image_url ?? null,
    afterImageUrl: overlay.afterImageUrl ?? overlay.after_image_url ?? null,
    comparisonLabel: overlay.comparisonLabel ?? overlay.comparison_label ?? null,
  };
};

const overlaysFromAssessment = (records: any[] | undefined): OverlayInstruction[] => {
  if (!Array.isArray(records)) return [];
  return records
    .map((record) => normalizeOverlayRecord(record))
    .filter((overlay): overlay is OverlayInstruction => Boolean(overlay));
};

const parseOverlaysFromRaw = (raw: any | null) => {
  const source = raw?.overlays;
  if (!Array.isArray(source)) return undefined;
  const overlays = source
    .map((overlay) => normalizeOverlayRecord(overlay))
    .filter((overlay): overlay is OverlayInstruction => Boolean(overlay));
  return overlays.length ? overlays : undefined;
};
