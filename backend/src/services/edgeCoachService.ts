import { getOpenAIClient } from "../config/openaiClient";

type InsightPayload = {
  trustScore: number;
  kamScore: number;
  decelStatus: "Normal" | "High";
  footPlantPerMin: number;
  cues?: string[];
};

export const generateEdgeCoachInsight = async (payload: InsightPayload) => {
  const client = getOpenAIClient();
  const fallback = buildFallback(payload);
  if (!client) return fallback;
  try {
    const response = await (client.responses as any).create({
      model: "gpt-4o-mini",
      input: [
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text: "You are a biomechanics sidekick. Summarize real-time cues succinctly (<=3 sentences).",
            },
          ],
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: JSON.stringify(payload),
            },
          ],
        },
      ],
      text: { format: { type: "text" } },
    });
    return (
      response.output?.[0]?.content?.[0]?.text ??
      fallback
    );
  } catch (error) {
    console.warn("Edge coach insight failed", error);
    return fallback;
  }
};

const buildFallback = (payload: InsightPayload) => {
  const cues = payload.cues?.length ? `Focus: ${payload.cues.join(", ")}.` : "";
  const kamLabel = payload.kamScore > 0.6 ? "valgus is trending up" : "valgus remains stable";
  const decelLabel =
    payload.decelStatus === "High"
      ? "Decel looks abrupt—reinforce hips-back + soft landings."
      : "Decel rate is within range.";
  const plantLabel =
    payload.footPlantPerMin >= 10
      ? `Foot plant cadence ${Math.round(payload.footPlantPerMin)}/min.`
      : `Only ${Math.round(payload.footPlantPerMin)}/min foot plants—add repeatable reps.`;
  return `${kamLabel}. ${decelLabel} ${plantLabel} ${cues}`.trim();
};
