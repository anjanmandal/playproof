import { apiClient, unwrap } from './client';
import type {
  TeamPlannerSimulationInput,
  TeamPlannerSimulationResult,
  TeamPlanRecord,
} from '@/types';

export const simulateTeamPlan = (payload: TeamPlannerSimulationInput) =>
  unwrap(apiClient.post<{ simulation: TeamPlannerSimulationResult }>('/planner/simulate', payload)).then(
    (res) => res.simulation,
  );

export const applyTeamPlan = (payload: {
  simulation: TeamPlannerSimulationResult;
  selectedTweaks: string[];
}) =>
  unwrap(apiClient.post<{ plan: TeamPlanRecord }>('/planner/apply', {
    simulation: payload.simulation,
    selectedTweaks: payload.selectedTweaks,
  })).then((res) => res.plan);

export const fetchLatestTeamPlan = (team: string) =>
  unwrap(
    apiClient.get<{ plan: TeamPlanRecord }>('/planner/latest', {
      params: { team },
    }),
  ).then((res) => res.plan);
