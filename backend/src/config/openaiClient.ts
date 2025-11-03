import OpenAI from "openai";
import { env } from "./env";

let client: OpenAI | null = null;

export const getOpenAIClient = (): OpenAI | null => {
  if (!env.OPENAI_API_KEY) {
    return null;
  }

  if (!client) {
    client = new OpenAI({
      apiKey: env.OPENAI_API_KEY,
    });
  }

  return client;
};
