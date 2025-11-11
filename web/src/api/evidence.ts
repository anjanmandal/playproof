import { apiClient, unwrap } from './client';
import type { EvidencePackResponse, EvidenceViewLogEntry } from '@/types';

export const generateEvidencePack = (payload: {
  athleteId: string;
  rehabAssessmentId?: string;
  riskSnapshotId?: string;
  planId?: string;
  notes?: string;
}) =>
  unwrap(apiClient.post<{ evidence: EvidencePackResponse }>('/evidence/pdf', payload)).then(
    (res) => res.evidence,
  );

export const fetchEvidenceViews = (id: string) =>
  unwrap(apiClient.get<{ views: EvidenceViewLogEntry[] }>(`/evidence/pdf/${id}/views`)).then(
    (res) => res.views,
  );
