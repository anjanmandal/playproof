import { apiClient, unwrap } from './client';
import type { AthleteDashboard, AthleteSummary } from '@/types';

export const fetchAthletes = () =>
  unwrap(apiClient.get<{ athletes: AthleteSummary[] }>('/athletes')).then((res) => res.athletes);

export const fetchAthleteDetail = (athleteId: string) =>
  unwrap(apiClient.get<{ athlete: AthleteDashboard }>(`/athletes/${athleteId}`)).then(
    (res) => res.athlete,
  );
