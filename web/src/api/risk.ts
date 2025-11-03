import { apiClient, unwrap } from './client';
import type {
  DailyRiskInput,
  DailyRiskResponse,
  MicroPlan,
  NextRepCheck,
  RiskSnapshot,
  TeamRiskSnapshot,
} from '@/types';

const normalizeMicroPlan = (plan?: MicroPlan): MicroPlan | undefined => {
  if (!plan || !Array.isArray(plan.drills)) return undefined;
  const drills = plan.drills
    .map((drill) => ({
      name: drill.name,
      sets: drill.sets,
      reps: drill.reps,
      rest_s: drill.rest_s,
    }))
    .filter((drill) => drill.name);
  return drills.length ? { drills } : undefined;
};

const normalizeSnapshot = <T extends RiskSnapshot>(snapshot: T): T => ({
  ...snapshot,
  drivers: snapshot.drivers ?? [],
  driverScores: snapshot.driverScores ?? undefined,
  microPlan: normalizeMicroPlan(snapshot.microPlan),
  environmentPolicyFlags: snapshot.environmentPolicyFlags ?? [],
}) as T;

export const submitDailyRisk = (payload: DailyRiskInput) =>
  unwrap(apiClient.post<DailyRiskResponse>('/risk', payload)).then((response) => ({
    ...response,
    drivers: response.drivers ?? [],
    driverScores: response.driverScores ?? undefined,
    microPlan: normalizeMicroPlan(response.microPlan),
    environmentPolicyFlags: response.environmentPolicyFlags ?? [],
  }));

export const fetchRiskSnapshots = (athleteId: string, limit = 30) =>
  unwrap(
    apiClient.get<{ snapshots: RiskSnapshot[] }>(`/risk/athlete/${athleteId}`, {
      params: { limit },
    }),
  ).then((res) => ({
    snapshots: res.snapshots.map(normalizeSnapshot),
  }));

export const fetchTeamRiskSnapshots = (teamId: string, date?: string) =>
  unwrap(
    apiClient.get<{ snapshots: TeamRiskSnapshot[] }>(`/risk/team/${teamId}`, {
      params: date ? { date } : undefined,
    }),
  ).then((res) => res.snapshots.map(normalizeSnapshot));

export const acknowledgeRisk = (snapshotId: string) =>
  unwrap(apiClient.patch<{ acknowledged: boolean }>(`/risk/${snapshotId}/acknowledge`, {}));

export const updateRiskAdherence = (
  snapshotId: string,
  payload: { adherence0to1?: number; nextRepCheck?: Partial<NextRepCheck> },
) =>
  unwrap(
    apiClient.patch<{ snapshot: RiskSnapshot }>(`/risk/${snapshotId}/adherence`, {
      adherence_0_1: payload.adherence0to1,
      next_rep_check: payload.nextRepCheck
        ? {
            required: payload.nextRepCheck.required,
            received: payload.nextRepCheck.received,
            result: payload.nextRepCheck.result,
          }
        : undefined,
    }),
  ).then((res) => normalizeSnapshot(res.snapshot));

export const postRiskVideoFeatures = (athleteId: string, features: Record<string, unknown>) =>
  unwrap(
    apiClient.post('/risk/features/video', {
      athleteId,
      features,
    }),
  );
