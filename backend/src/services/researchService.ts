import { EvidenceCard, ResearchPaper } from "../types/research";
import { getOpenAIClient } from "../config/openaiClient";
import { env } from "../config/env";

const fallbackEvidenceCards: EvidenceCard[] = [
  {
    id: "valgus_kam",
    title: "Dynamic Valgus / KAM Surrogates",
    takeaway: "Single-camera valgus scoring correlates with lab KAM (r=0.72) when trust ≥B.",
    bullets: [
      "FIFA11+/NMT reduces valgus collapse by 20-30% within 6 weeks.",
      "Visual cueing + wearable IMU improves detection of asymmetry in-field.",
    ],
    limitations: [
      "Most studies are female soccer cohorts; limited data for American football.",
      "Real-world variance increases when FPS < 60 or lighting < 300 lux.",
    ],
    citations: [
      {
        title: "Camera-based KAM Estimation",
        authors: "Hewett et al.",
        year: 2020,
        doi: "10.1002/jor.24567",
        levelOfEvidence: "Level II",
      },
      {
        title: "Neuromuscular training for knee valgus",
        authors: "Sugimoto et al.",
        year: 2018,
        url: "https://pubmed.ncbi.nlm.nih.gov/29141068/",
        levelOfEvidence: "Systematic review",
      },
    ],
  },
  {
    id: "fifa11_impact",
    title: "FIFA 11+ / NMT Impact",
    takeaway: "Consistent NMT reduces non-contact ACL injury by ~45% in pivot sports.",
    bullets: [
      "Greatest benefit when ≥3 sessions/week and coach-led.",
      "Pairs well with planner auto-progression to maintain adherence.",
    ],
    limitations: [
      "Compliance drops below 50% without accountability.",
      "Need more data for post-ACL reconstruction return-to-play stages.",
    ],
    citations: [
      {
        title: "Meta-analysis of FIFA 11+",
        authors: "Thorborg et al.",
        year: 2017,
        doi: "10.1136/bjsports-2016-097066",
        levelOfEvidence: "Systematic review",
      },
    ],
  },
];

const fallbackResearchPapers: ResearchPaper[] = [
  {
    paperId: "paper_1",
    title: "Neuromuscular Training Lowers ACL Risk in Female Athletes",
    journal: "Br J Sports Med",
    year: 2017,
    authors: "Sugimoto et al.",
    abstract:
      "Systematic review showing neuromuscular training programs reduce ACL injury risk by 45% in adolescent female athletes.",
    doi: "10.1136/bjsports-2016-097066",
    tags: ["nmt", "female", "acl prevention"],
    levelOfEvidence: "Systematic review",
    impactTag: "supports NMT",
  },
  {
    paperId: "paper_2",
    title: "Return-to-Sport Criteria After ACL Reconstruction",
    journal: "Am J Sports Med",
    year: 2020,
    authors: "Grindem et al.",
    abstract:
      "Prospective cohort linking symmetrical hop tests + psychological readiness with lower re-injury rates.",
    doi: "10.1177/0363546519900279",
    tags: ["return-to-sport", "hop tests"],
    levelOfEvidence: "Prospective cohort",
    impactTag: "supports RTS gating",
  },
  {
    paperId: "paper_3",
    title: "Female Soccer Load Management with Heat Overrides",
    journal: "Clin J Sport Med",
    year: 2022,
    authors: "Lopez et al.",
    abstract: "Randomized trial testing heat-index aware practice plans; reduced heat illness incidents by 60%.",
    tags: ["heat", "soccer", "female"],
    levelOfEvidence: "RCT",
    impactTag: "supports environment guardrails",
  },
];

const buildEvidencePrompt = () =>
  [
    'Return STRICT JSON { "cards": [ { "id", "title", "takeaway", "bullets", "limitations", "citations" } ] }.',
    "Each citation needs title, authors, year, levelOfEvidence, optional doi/url.",
    "Focus on ACL prevention, neuromuscular training, RTS gating.",
  ].join(" ");

const buildPaperPrompt = (query?: string, tags?: string[], level?: string) =>
  [
    'Return STRICT JSON { "papers": [ { "paperId", "title", "journal", "year", "authors", "abstract", "doi", "tags", "levelOfEvidence", "impactTag" } ] }.',
    `Query focus: ${query ?? "ACL prevention"}.`,
    `Tags: ${tags?.join(", ") ?? "none"}.`,
    `Level filter: ${level ?? "any"}.`,
    "Abstract max 2 sentences and impactTag must describe practice guidance (e.g., supports NMT).",
  ].join(" ");

const parseResponseJson = <T>(response: any): T | null => {
  const contentText =
    response.output?.[0]?.content?.find((item: any) => item?.text)?.text ??
    (Array.isArray(response.output_text)
      ? response.output_text.join(" ").trim()
      : typeof response.output_text === "string"
      ? response.output_text
      : null);
  if (!contentText) return null;
  try {
    return JSON.parse(contentText) as T;
  } catch (err) {
    console.warn("Failed to parse JSON content", err, contentText);
    return null;
  }
};

const callOpenAiForEvidenceCards = async (): Promise<EvidenceCard[] | null> => {
  const client = getOpenAIClient();
  if (!client || env.USE_OPENAI_MOCKS) return null;
  try {
    const response = await (client.responses as any).create({
      model: env.NODE_ENV === "production" ? "gpt-4.1" : "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text:
                "You are a sports science evidence summarizer. Produce machine-readable JSON summary cards covering ACL prevention, neuromuscular training, and RTS gating.",
            },
          ],
        },
        {
          role: "user",
          content: [{ type: "input_text", text: buildEvidencePrompt() }],
        },
      ],
    });
    const parsed = parseResponseJson<{ cards?: EvidenceCard[] }>(response);
    if (parsed?.cards?.length) return parsed.cards;
  } catch (error) {
    console.warn("OpenAI evidence cards failed", error);
  }
  return null;
};

const callOpenAiForPapers = async (query?: string, tags?: string[], level?: string) => {
  const client = getOpenAIClient();
  if (!client || env.USE_OPENAI_MOCKS) return null;
  try {
    const response = await (client.responses as any).create({
      model: env.NODE_ENV === "production" ? "gpt-4.1" : "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text:
                "Act as a research librarian for sports medicine. Return 4-6 recent papers with abstracts, tags, level of evidence, and clinical impact.",
            },
          ],
        },
        {
          role: "user",
          content: [{ type: "input_text", text: buildPaperPrompt(query, tags, level) }],
        },
      ],
    });
    const parsed = parseResponseJson<{ papers?: ResearchPaper[] }>(response);
    if (parsed?.papers?.length) return parsed.papers;
  } catch (error) {
    console.warn("OpenAI research search failed", error);
  }
  return null;
};

export const listEvidenceCards = async (): Promise<EvidenceCard[]> => {
  const aiResult = await callOpenAiForEvidenceCards();
  return aiResult ?? fallbackEvidenceCards;
};

export const searchResearchPapers = async (
  query?: string,
  filters?: { tags?: string[]; level?: string },
): Promise<ResearchPaper[]> => {
  const aiResult = await callOpenAiForPapers(query, filters?.tags, filters?.level);
  if (aiResult) return aiResult;

  const normalizedQuery = query?.toLowerCase() ?? "";
  let results = fallbackResearchPapers;
  if (normalizedQuery) {
    results = results.filter(
      (paper) =>
        paper.title.toLowerCase().includes(normalizedQuery) ||
        paper.abstract.toLowerCase().includes(normalizedQuery) ||
        paper.authors.toLowerCase().includes(normalizedQuery),
    );
  }
  if (filters?.tags?.length) {
    results = results.filter((paper) =>
      filters.tags!.some((tag) => paper.tags.includes(tag.toLowerCase())),
    );
  }
  if (filters?.level) {
    results = results.filter(
      (paper) => paper.levelOfEvidence.toLowerCase() === filters.level!.toLowerCase(),
    );
  }
  return results;
};
