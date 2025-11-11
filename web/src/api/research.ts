import { apiClient, unwrap } from './client';
import type { EvidenceCard, ResearchPaper } from '@/types';

export const fetchEvidenceCards = () =>
  unwrap(apiClient.get<{ cards: EvidenceCard[] }>('/research/cards')).then((res) => res.cards);

export const searchResearchPapers = (params: { q?: string; tags?: string[]; level?: string }) =>
  unwrap(
    apiClient.get<{ papers: ResearchPaper[] }>('/research/papers', {
      params: {
        q: params.q,
        tag: params.tags?.join(','),
        level: params.level,
      },
    }),
  ).then((res) => res.papers);
