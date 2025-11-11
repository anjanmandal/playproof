import { apiClient, unwrap } from './client';

export interface WearableSession {
  id: string;
  athleteId: string;
  drillType: string;
  surface?: string | null;
  tempF?: number | null;
  humidityPct?: number | null;
  startedAt: string;
  endedAt?: string | null;
}

export interface WearableSample {
  ts: number;
  ax: number;
  ay: number;
  az: number;
  gx: number;
  gy: number;
  gz: number;
  side?: 'left' | 'right';
}

export interface WearableSampleWindowPayload {
  windowTs: string;
  side?: 'left' | 'right';
  samples: WearableSample[];
}

export interface WearableFeatureWindow {
  id?: string;
  windowTs: string;
  contactMs?: number;
  stabilityMs?: number;
  valgusIdx0to3?: number;
  asymmetryPct?: number;
  yawSpike?: number;
  confidence0to1?: number;
  meta?: Record<string, unknown>;
}

interface CreateSessionResponse {
  sessionId: string;
  session: WearableSession;
}

export const createWearableSession = (payload: {
  athleteId: string;
  drillType: string;
  deviceIds?: string[];
  surface?: string;
  tempF?: number;
  humidityPct?: number;
}) => unwrap(apiClient.post<CreateSessionResponse>('/wearables/session', payload));

export const streamWearableSamples = (sessionId: string, windows: WearableSampleWindowPayload[]) =>
  unwrap(apiClient.post<{ features: WearableFeatureWindow[] }>(`/wearables/${sessionId}/samples`, { windows }));

export const flushWearableSession = (sessionId: string) =>
  unwrap(apiClient.post<{ session: WearableSession }>(`/wearables/${sessionId}/flush`, {}));

export const fetchWearableFeatures = (sessionId: string) =>
  unwrap(apiClient.get<{ features: WearableFeatureWindow[] }>(`/wearables/${sessionId}/features`));

export const sendWearableFeaturesToRisk = (
  athleteId: string,
  features: Array<{
    contactMs?: number;
    stabilityMs?: number;
    valgusIdx0to3?: number;
    asymmetryPct?: number;
    confidence0to1?: number;
  }>,
) =>
  unwrap(
    apiClient.post<{ stored: number }>('/risk/features/wearable', {
      athleteId,
      features,
    }),
  );
