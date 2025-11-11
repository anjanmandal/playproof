import { apiClient, unwrap } from './client';
import type {
  RehabAssessmentInput,
  RehabAssessmentRecord,
  RehabAssessmentResultDTO,
  RtsGateSummary,
} from '@/types';

const normalizeRehab = (assessment: RehabAssessmentRecord): RehabAssessmentRecord => ({
  ...assessment,
  concerns: assessment.concerns ?? [],
  recommendedExercises: assessment.recommendedExercises ?? [],
  videos: assessment.videos ?? [],
});

export const submitRehabAssessment = (payload: RehabAssessmentInput) =>
  unwrap(apiClient.post<RehabAssessmentRecord>('/rehab', payload)).then(normalizeRehab);

export const fetchRehabHistory = (athleteId: string, limit = 10) =>
  unwrap(
    apiClient.get<{ assessments: RehabAssessmentRecord[] }>(`/rehab/athlete/${athleteId}`, {
      params: { limit },
    }),
  ).then((res) => ({
    assessments: res.assessments.map(normalizeRehab),
  }));

export const fetchRehabAssessment = (rehabAssessmentId: string) =>
  unwrap(apiClient.get<{ assessment: RehabAssessmentRecord }>(`/rehab/${rehabAssessmentId}`)).then(
    (res) => ({
      assessment: normalizeRehab(res.assessment),
    }),
  );

export const fetchRtsGateSummary = (
  athleteId: string,
  params: { sport: 'pivot' | 'non_pivot'; sex: 'female' | 'male'; age: number },
) =>
  unwrap(
    apiClient.get<{ summary: RtsGateSummary }>(`/rehab/athlete/${athleteId}/rts`, {
      params,
    }),
  ).then((res) => res.summary);

export const submitLiveCaptureSession = (payload: {
  athleteId: string;
  surgicalSide: 'left' | 'right';
  sessionDate?: string;
  videos: RehabAssessmentInput['videos'];
}) =>
  unwrap(
    apiClient.post<{ assessment: RehabAssessmentResultDTO; derivedInput: RehabAssessmentInput }>(
      '/rehab/live-capture',
      payload,
    ),
  );
