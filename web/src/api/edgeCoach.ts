import { apiClient, unwrap } from './client';

export const generateEdgeCoachInsight = (payload: {
  trustScore: number;
  kamScore: number;
  decelStatus: 'Normal' | 'High';
  footPlantPerMin: number;
  cues?: string[];
}) =>
  unwrap(apiClient.post<{ summary: string }>('/edge-coach/insight', payload)).then((res) => res.summary);
