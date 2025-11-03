export type Audience = "coach" | "athlete" | "parent" | "at_pt";

export interface AudienceRewriteInput {
  assessmentId: string;
  baselineMessage: string;
  audience: Audience;
  tone?: "technical" | "supportive" | "motivational";
}

export interface AudienceRewriteResult {
  rewriteId: string;
  assessmentId: string;
  audience: Audience;
  message: string;
  generatedAt: string;
  rawModelOutput?: unknown;
}
