import { apiClient, unwrap } from './client';
import type { HomeSessionPlanResponse, WearableInsightRequest, WearableInsightResponse } from '@/types';

export const fetchHomeSessionPlan = (athleteId: string, params: { minutes: number; soreness: number }) =>
  unwrap(
    apiClient.get<{ plan: HomeSessionPlanResponse }>(`/home/session/${athleteId}`, {
      params,
    }),
  ).then((res) => res.plan);

export const submitHomeSessionProof = (athleteId: string, payload: { blockKey: string; clipUrl: string; minutes?: number }) =>
  unwrap(apiClient.post(`/home/session/${athleteId}/proof`, payload));

export const requestWearableInsight = (payload: WearableInsightRequest) =>
  unwrap(apiClient.post<{ insight: WearableInsightResponse }>(`/home/wearables/insight`, payload)).then(
    (res) => res.insight,
  );
