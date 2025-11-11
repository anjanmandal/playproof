import { apiClient, unwrap } from './client';
import type {
  CoachTriageQueuePayload,
  PracticeCompilerPayload,
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

export const fetchCoachTriageQueue = (team: string) =>
  unwrap(
    apiClient.get<{ queue: CoachTriageQueuePayload }>('/planner/triage', {
      params: { team },
    }),
  ).then((res) => res.queue);

export const compilePracticePlan = (team: string) =>
  unwrap(
    apiClient.get<{ compiler: PracticeCompilerPayload }>('/planner/compile', {
      params: { team },
    }),
  ).then((res) => res.compiler);
