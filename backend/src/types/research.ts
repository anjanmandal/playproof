export interface EvidenceCard {
  id: string;
  title: string;
  takeaway: string;
  bullets: string[];
  limitations: string[];
  citations: Array<{
    title: string;
    authors: string;
    year: number;
    doi?: string;
    url?: string;
    levelOfEvidence: string;
  }>;
}

export interface ResearchPaper {
  paperId: string;
  title: string;
  journal: string;
  year: number;
  authors: string;
  abstract: string;
  doi?: string;
  tags: string[];
  levelOfEvidence: string;
  impactTag: string;
}
