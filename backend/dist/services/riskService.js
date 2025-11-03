"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.acknowledgeRiskSnapshot = exports.listRiskSnapshots = exports.buildDailyRiskRecommendation = void 0;
const crypto_1 = require("crypto");
const openaiClient_1 = require("../config/openaiClient");
const env_1 = require("../config/env");
const prisma_1 = require("../db/prisma");
const athleteService_1 = require("./athleteService");
const RISK_RESPONSE_SCHEMA = {
    type: "object",
    properties: {
        risk_level: { type: "string", enum: ["green", "yellow", "red"] },
        why: { type: "string" },
        change_today: { type: "string" },
    },
    required: ["risk_level", "why", "change_today"],
    additionalProperties: false,
};
const RISK_SYSTEM_PROMPT = `
You are a sports scientist assigning daily non-contact ACL risk.
Use evidence-based heuristics (fatigue, valgus exposure, surface, heat) and return one actionable change.
Keep guidance practical and field-ready.
`;
const RISK_USER_PROMPT = (input) => `
Athlete ID: ${input.athleteId}
Exposure minutes yesterday: ${input.exposureMinutes}
Surface: ${input.surface}
Temperature (F): ${input.temperatureF}
Humidity (%): ${input.humidityPct}
Prior knee/ankle injury: ${input.priorLowerExtremityInjury ? "yes" : "no"}
Soreness level (0-3): ${input.sorenessLevel}
Fatigue level (0-3): ${input.fatigueLevel}
Body weight trend: ${input.bodyWeightTrend ?? "unknown"}
Menstrual phase (if provided): ${input.menstrualPhase ?? "not provided"}
Additional notes: ${input.notes ?? "none"}

Classify risk_level as green/yellow/red.
Explain the driver(s) of risk in plain language.
Recommend ONE change the coach should make in today's session to lower risk.
Return JSON with keys risk_level, why, change_today.
`.trim();
const buildMockRiskRecommendation = (input) => {
    const fatigueWeightedScore = input.fatigueLevel + input.sorenessLevel;
    const priorInjuryPenalty = input.priorLowerExtremityInjury ? 1 : 0;
    const heatPenalty = input.temperatureF >= 90 ? 1 : 0;
    const total = fatigueWeightedScore + priorInjuryPenalty + heatPenalty;
    const riskLevel = total >= 4 ? "red" : total >= 2 ? "yellow" : "green";
    const changeTodayMap = {
        red: "Downgrade cutting drills to low-impact landing mechanics and cap max-speed reps at 6.",
        yellow: "Add extended dynamic warm-up with glute activation before aggressive cuts.",
        green: "Proceed with planned session but monitor landing mechanics in first small-sided game.",
    };
    return {
        snapshotId: (0, crypto_1.randomUUID)(),
        athleteId: input.athleteId,
        riskLevel,
        rationale: `Fatigue load score ${total} (fatigue=${input.fatigueLevel}, soreness=${input.sorenessLevel}) ${input.priorLowerExtremityInjury ? "+ prior injury history" : ""} ${heatPenalty ? "+ high heat index" : ""}`.trim(),
        changeToday: changeTodayMap[riskLevel],
        generatedAt: new Date().toISOString(),
        rawModelOutput: { source: "mock" },
    };
};
const buildDailyRiskRecommendation = async (input) => {
    await (0, athleteService_1.ensureAthlete)(input.athleteId, input.athleteName ?? input.athleteId);
    const client = (0, openaiClient_1.getOpenAIClient)();
    if (!client || env_1.env.USE_OPENAI_MOCKS) {
        const mock = buildMockRiskRecommendation(input);
        await persistRiskSnapshot(input, mock);
        return mock;
    }
    try {
        const response = await client.responses.create({
            model: env_1.env.NODE_ENV === "production" ? "gpt-4.1" : "gpt-4.1-mini",
            input: [
                { role: "system", content: [{ type: "input_text", text: RISK_SYSTEM_PROMPT.trim() }] },
                { role: "user", content: [{ type: "input_text", text: RISK_USER_PROMPT(input) }] },
            ],
            text: {
                format: {
                    type: "json_schema",
                    name: "DailyRiskRecommendation",
                    schema: RISK_RESPONSE_SCHEMA,
                    strict: false,
                },
            },
        });
        const data = response.output?.[0]?.content?.find((item) => item?.parsed)?.parsed ??
            response.parsed ??
            (response.output_text ? JSON.parse(response.output_text) : null);
        if (!data) {
            throw new Error("Unable to parse OpenAI risk response");
        }
        const result = {
            snapshotId: (0, crypto_1.randomUUID)(),
            athleteId: input.athleteId,
            riskLevel: data.risk_level,
            rationale: data.why,
            changeToday: data.change_today,
            generatedAt: new Date().toISOString(),
            rawModelOutput: data,
        };
        await persistRiskSnapshot(input, result);
        return result;
    }
    catch (error) {
        console.error("OpenAI risk classification failed", error);
        const fallback = buildMockRiskRecommendation(input);
        await persistRiskSnapshot(input, fallback);
        return fallback;
    }
};
exports.buildDailyRiskRecommendation = buildDailyRiskRecommendation;
const persistRiskSnapshot = async (input, result) => {
    await prisma_1.prisma.riskSnapshot.create({
        data: {
            id: result.snapshotId,
            athleteId: input.athleteId,
            exposureMinutes: input.exposureMinutes,
            surface: input.surface,
            temperatureF: input.temperatureF,
            humidityPct: input.humidityPct,
            priorLowerExtremityInjury: input.priorLowerExtremityInjury,
            sorenessLevel: input.sorenessLevel,
            fatigueLevel: input.fatigueLevel,
            bodyWeightTrend: input.bodyWeightTrend,
            menstrualPhase: input.menstrualPhase,
            notes: input.notes,
            recordedFor: input.recordedFor ? new Date(input.recordedFor) : new Date(),
            riskLevel: result.riskLevel,
            rationale: result.rationale,
            changeToday: result.changeToday,
            rawModelOutput: JSON.stringify(result.rawModelOutput ?? {}),
        },
    });
};
const listRiskSnapshots = (athleteId, limit = 30) => prisma_1.prisma.riskSnapshot.findMany({
    where: { athleteId },
    orderBy: [{ recordedFor: "desc" }, { createdAt: "desc" }],
    take: limit,
});
exports.listRiskSnapshots = listRiskSnapshots;
const acknowledgeRiskSnapshot = (snapshotId) => prisma_1.prisma.riskSnapshot.update({
    where: { id: snapshotId },
    data: { recommendationAcknowledged: true },
});
exports.acknowledgeRiskSnapshot = acknowledgeRiskSnapshot;
//# sourceMappingURL=riskService.js.map