import { apiClient, unwrap } from './client';
import type { RehabAssessmentInput, RehabAssessmentRecord } from '@/types';

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
