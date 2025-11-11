import { apiClient, unwrap } from './client';
import type { CaseChannelResponse, CaseEvent } from '@/types';

export const fetchCaseChannel = (
  athleteId: string,
  params?: { eventType?: string; role?: string; limit?: number },
) =>
  unwrap(
    apiClient.get<{ caseChannel: CaseChannelResponse }>(`/case-channel/${athleteId}`, {
      params,
    }),
  ).then((res) => res.caseChannel);

export const createCaseEvent = (athleteId: string, payload: Partial<CaseEvent> & { eventType: string; title: string }) =>
  unwrap(
    apiClient.post<{ event: CaseEvent }>(`/case-channel/${athleteId}`, {
      eventType: payload.eventType,
      title: payload.title,
      summary: payload.summary,
      trustGrade: payload.trustGrade,
      role: payload.role,
      pinned: payload.pinned,
      nextAction: payload.nextAction,
      attachments: payload.attachments,
      metadata: payload.metadata,
      mentions: payload.mentions,
      consentFlag: payload.consentFlag,
      visibility: payload.visibility,
    }),
  ).then((res) => res.event);
