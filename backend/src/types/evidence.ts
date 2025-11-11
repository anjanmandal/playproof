export interface EvidenceRequestBody {
  athleteId: string;
  rehabAssessmentId?: string;
  riskSnapshotId?: string;
  planId?: string;
  notes?: string;
}

export interface EvidenceResponse {
  evidenceId: string;
  downloadUrl: string;
  viewerLogUrl: string;
  expiresAt: string;
}

export interface EvidenceViewLogEntry {
  id: string;
  viewer: string;
  viewedAt: string;
}
