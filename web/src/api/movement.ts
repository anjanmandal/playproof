import { apiClient, unwrap } from './client';
import type { MovementAssessment, MovementAssessmentInput, MovementOverlayInstruction } from '@/types';

const normalizeOverlay = (overlay?: MovementOverlayInstruction | null) => {
  if (!overlay) return undefined;
  return {
    ...overlay,
    metrics: overlay.metrics ? { ...overlay.metrics } : undefined,
    visualization: Array.isArray(overlay.visualization)
      ? overlay.visualization.map((item) => ({ ...(item ?? {}) }))
      : undefined,
  };
};

const normalizeOverlays = (overlays?: MovementAssessment['overlays']) => {
  if (!Array.isArray(overlays)) return [];
  return overlays
    .map((overlay) => normalizeOverlay(overlay))
    .filter((item): item is NonNullable<ReturnType<typeof normalizeOverlay>> => Boolean(item));
};

const normalizeMicroPlan = (plan?: MovementAssessment['microPlan']) => {
  if (!plan) return undefined;
  return {
    ...plan,
    drills: Array.isArray(plan.drills) ? plan.drills.map((drill) => ({ ...drill })) : [],
    completion: plan.completion ? { ...plan.completion } : undefined,
  };
};

const normalizeProof = (proof?: MovementAssessment['proof']) => {
  if (!proof) return undefined;
  return {
    ...proof,
    band: proof.band ?? undefined,
    completion: proof.completion ? { ...proof.completion } : undefined,
    microPlan: normalizeMicroPlan(proof.microPlan),
  };
};

const normalizeAssessment = (assessment: MovementAssessment): MovementAssessment => ({
  ...assessment,
  cues: assessment.cues ?? [],
  metrics: assessment.metrics ?? {
    kneeValgusScore: 0,
    trunkLeanOutsideBOS: false,
    footPlantOutsideCOM: false,
  },
  frames: assessment.frames ?? [],
  microPlan: normalizeMicroPlan(assessment.microPlan ?? undefined) ?? null,
  proof: normalizeProof(assessment.proof),
  overlays: normalizeOverlays(assessment.overlays ?? undefined),
  bandSummary: assessment.bandSummary ?? assessment.proof?.band ?? undefined,
});

export const createMovementAssessment = (payload: MovementAssessmentInput) =>
  unwrap(apiClient.post<MovementAssessment>('/assessments', payload)).then(normalizeAssessment);

export const fetchMovementAssessments = (athleteId: string, limit = 20) =>
  unwrap(apiClient.get<{ assessments: MovementAssessment[] }>(`/assessments/athlete/${athleteId}`, { params: { limit } }))
    .then((res) => ({
      assessments: res.assessments.map(normalizeAssessment),
    }));

export const fetchMovementAssessment = (assessmentId: string) =>
  unwrap(apiClient.get<{ assessment: MovementAssessment }>(`/assessments/${assessmentId}`)).then((res) => ({
    assessment: normalizeAssessment(res.assessment),
  }));

export const updateMovementProof = (
  assessmentId: string,
  payload: { fixAssigned?: boolean; completed?: boolean; rpe?: number; pain?: number },
) =>
  unwrap(
    apiClient.patch<{ proof?: MovementAssessment['proof'] }>(`/assessments/${assessmentId}/proof`, payload),
  ).then((res) => normalizeProof(res.proof));
