import { apiClient, unwrap } from './client';
import type {
  AthleteDashboard,
  AthleteProgressMetrics,
  AthleteSummary,
  CyclePrivacySetting,
  SharePayload,
  ShareScope,
  CycleSignals,
  PhaseEstimate,
  PhasePolicy,
  WarmupSummary,
} from '@/types';

export const fetchAthletes = () =>
  unwrap(apiClient.get<{ athletes: AthleteSummary[] }>('/athletes')).then((res) => res.athletes);

export const fetchAthleteDetail = (athleteId: string) =>
  unwrap(apiClient.get<{ athlete: AthleteDashboard }>(`/athletes/${athleteId}`)).then(
    (res) => res.athlete,
  );

export const fetchAthleteProgress = (athleteId: string) =>
  unwrap(apiClient.get<{ metrics: AthleteProgressMetrics }>(`/athletes/${athleteId}/progress`)).then(
    (res) => res.metrics,
  );

export const fetchCyclePrivacySetting = (athleteId: string) =>
  unwrap(apiClient.get<{ setting: CyclePrivacySetting }>(`/athletes/${athleteId}/cycle/privacy`)).then(
    (res) => res.setting,
  );

export const updateCyclePrivacySetting = (athleteId: string, shareScope: ShareScope) =>
  unwrap(
    apiClient.put<{ setting: CyclePrivacySetting }>(`/athletes/${athleteId}/cycle/privacy`, {
      shareScope,
    }),
  ).then((res) => res.setting);

export const shareCyclePhaseLabel = (athleteId: string, payload: SharePayload) =>
  unwrap(
    apiClient.post<{ setting: CyclePrivacySetting }>(`/athletes/${athleteId}/cycle/share`, payload),
  ).then((res) => res.setting);

export const requestCyclePhaseEstimate = (athleteId: string, signals: CycleSignals) =>
  unwrap(
    apiClient.post<{ estimate: PhaseEstimate }>(`/athletes/${athleteId}/cycle/infer`, {
      ...signals,
    }),
  ).then((res) => res.estimate);

export const requestWarmupSummary = (
  athleteId: string,
  payload: { signals: CycleSignals; estimate: PhaseEstimate; policy: PhasePolicy },
) =>
  unwrap(
    apiClient.post<{ summary: WarmupSummary }>(`/athletes/${athleteId}/cycle/warmup`, payload),
  ).then((res) => res.summary);
