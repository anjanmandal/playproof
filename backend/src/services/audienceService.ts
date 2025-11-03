import { randomUUID } from "crypto";
import { AudienceRewriteInput, AudienceRewriteResult } from "../types/audience";
import { getOpenAIClient } from "../config/openaiClient";
import { env } from "../config/env";
import { prisma } from "../db/prisma";

const AUDIENCE_SYSTEM_PROMPT = `
You rewrite biomechanical insights for different audiences.
- Coach: technical, drill-focused, succinct.
- Athlete: motivational, clear cue, second-person voice.
- Parent: reassuring, plain language, includes safety emphasis.
- AT_PT: precise clinical language.
Keep to 2-3 sentences max.
`;

const buildMockRewrite = (input: AudienceRewriteInput): AudienceRewriteResult => {
  const templates: Record<typeof input.audience, string> = {
    coach: `Coach: ${input.baselineMessage}`,
    athlete: `Let's lock in: ${input.baselineMessage}`,
    parent: `Here's the update: ${input.baselineMessage}`,
    at_pt: `Clinical summary: ${input.baselineMessage}`,
  };

  return {
    rewriteId: randomUUID(),
    assessmentId: input.assessmentId,
    audience: input.audience,
    message: templates[input.audience],
    generatedAt: new Date().toISOString(),
    rawModelOutput: { source: "mock" },
  };
};

export const rewriteForAudience = async (
  input: AudienceRewriteInput,
): Promise<AudienceRewriteResult> => {
  const client = getOpenAIClient();

  if (!client || env.USE_OPENAI_MOCKS) {
    const mock = buildMockRewrite(input);
    await persistRewrite(input, mock);
    return mock;
  }

  try {
    const response = await (client.responses as any).create({
      model: env.NODE_ENV === "production" ? "gpt-4.1" : "gpt-4.1-mini",
      input: [
        { role: "system", content: [{ type: "input_text", text: AUDIENCE_SYSTEM_PROMPT.trim() }] },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: `Audience: ${input.audience}\nTone: ${input.tone ?? "default"}\nMessage: ${input.baselineMessage}`,
            },
          ],
        },
      ],
    });

    const outputContent = (response.output as any)?.[0]?.content;
    const content =
      outputContent?.find((item: any) => item?.text)?.text ?? response.output_text ?? outputContent?.[0]?.parsed;

    if (!content) {
      throw new Error("Unable to parse rewrite response");
    }

    const result: AudienceRewriteResult = {
      rewriteId: randomUUID(),
      assessmentId: input.assessmentId,
      audience: input.audience,
      message: content.trim(),
      generatedAt: new Date().toISOString(),
      rawModelOutput: { content },
    };

    await persistRewrite(input, {
      ...result,
      rawModelOutput: { content },
    });

    return result;
  } catch (error) {
    console.error("OpenAI rewrite failed", error);
    const fallback = buildMockRewrite(input);
    await persistRewrite(input, fallback);
    return fallback;
  }
};

const persistRewrite = async (
  input: AudienceRewriteInput,
  result: AudienceRewriteResult & { rawModelOutput?: unknown },
) => {
  await prisma.audienceRewrite.create({
    data: {
      id: result.rewriteId,
      assessmentId: result.assessmentId,
      audience: result.audience,
      tone: input.tone,
      sourceMessage: input.baselineMessage,
      rewritten: result.message,
      rawModelOutput: JSON.stringify(result.rawModelOutput ?? {}),
    },
  });
};
