import { apiClient, unwrap } from './client';
import type { AudienceRewriteInput, AudienceRewriteResponse } from '@/types';

export const rewriteForAudience = (payload: AudienceRewriteInput) =>
  unwrap(apiClient.post<AudienceRewriteResponse>('/audience', payload));
