"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMovementAssessment = exports.listMovementAssessments = exports.createMovementAssessment = void 0;
const crypto_1 = require("crypto");
const prisma_1 = require("../db/prisma");
const openaiClient_1 = require("../config/openaiClient");
const env_1 = require("../config/env");
const athleteService_1 = require("./athleteService");
const openaiMedia_1 = require("../utils/openaiMedia");
const phaseScoreSchema = (_phase, includeRiskDriver = false, includeTimeToStable = false) => ({
    type: "object",
    properties: {
        quality_0_3: { type: "integer", minimum: 0, maximum: 3 },
        notes: { type: "string" },
        ...(includeRiskDriver ? { risk_driver: { type: "string" } } : {}),
        ...(includeTimeToStable ? { time_to_stable_ms: { type: "number" } } : {}),
    },
    required: ["quality_0_3"],
    additionalProperties: false,
});
const MOVEMENT_RESPONSE_SCHEMA = {
    type: "object",
    properties: {
        riskRating: { type: "integer", minimum: 0, maximum: 3 },
        cues: {
            type: "array",
            items: { type: "string" },
            minItems: 1,
            maxItems: 3,
        },
        metrics: {
            type: "object",
            properties: {
                kneeValgusScore: { type: "integer", minimum: 0, maximum: 3 },
                trunkLeanOutsideBOS: { type: "boolean" },
                footPlantOutsideCOM: { type: "boolean" },
            },
            required: ["kneeValgusScore", "trunkLeanOutsideBOS", "footPlantOutsideCOM"],
        },
        overview: {
            type: "object",
            properties: {
                headline: { type: "string" },
                summary: { type: "string" },
                confidence: { type: "integer", minimum: 0, maximum: 100 },
            },
            required: ["headline", "summary"],
        },
        riskSignals: {
            type: "array",
            minItems: 1,
            items: {
                type: "object",
                properties: {
                    label: { type: "string" },
                    severity: { type: "string", enum: ["low", "moderate", "high"] },
                    evidence: { type: "string" },
                },
                required: ["label", "severity", "evidence"],
            },
        },
        coachingPlan: {
            type: "object",
            properties: {
                immediateCue: { type: "string" },
                practiceFocus: { type: "string" },
                monitoring: { type: "string" },
            },
            required: ["immediateCue", "practiceFocus", "monitoring"],
        },
        phase_scores: {
            type: "object",
            properties: {
                prep: phaseScoreSchema("prep"),
                takeoff: phaseScoreSchema("takeoff"),
                first_contact: phaseScoreSchema("first_contact", true),
                stabilization: phaseScoreSchema("stabilization", false, true),
            },
            additionalProperties: false,
        },
        time_to_stable_ms: { type: "number" },
        ground_contact_time_ms: { type: "number" },
        peak_risk_phase: { type: "string" },
        view_quality: {
            type: "object",
            properties: {
                score_0_1: { type: "number", minimum: 0, maximum: 1 },
                fix_instructions: { type: "string" },
                retry_recommended: { type: "boolean" },
            },
            required: ["score_0_1"],
            additionalProperties: false,
        },
        counterfactual: {
            type: "object",
            properties: {
                tweak: { type: "string" },
                predicted_risk_drop: { type: "number" },
                next_rep_verify: { type: "boolean" },
                summary: { type: "string" },
            },
            required: ["tweak", "predicted_risk_drop", "next_rep_verify"],
            additionalProperties: false,
        },
        asymmetry_index_0_100: { type: "number", minimum: 0, maximum: 100 },
        delta_from_baseline: {
            type: "object",
            additionalProperties: { type: "number" },
        },
        overlays: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    overlay_type: { type: "string" },
                    description: { type: "string" },
                    instructions: { type: "string" },
                    severity: { type: "string", enum: ["low", "moderate", "high"] },
                },
                required: ["overlay_type"],
                additionalProperties: false,
            },
        },
    },
    required: [
        "riskRating",
        "cues",
        "metrics",
        "overview",
        "riskSignals",
        "coachingPlan",
        "phase_scores",
        "time_to_stable_ms",
        "ground_contact_time_ms",
        "peak_risk_phase",
        "view_quality",
        "counterfactual",
        "asymmetry_index_0_100",
        "delta_from_baseline",
        "overlays",
    ],
    additionalProperties: false,
};
const MOVEMENT_SYSTEM_PROMPT = `
You are an elite sports biomechanist helping field coaches reduce non-contact ACL risk.
Use the supplied context and 3–5 frames to analyse the entire action and return a JSON object that
includes:
- overview: headline + summary + confidence 0-100.
- riskSignals: label, severity (low/moderate/high), evidence text.
- phase_scores: evaluate prep, takeoff, first_contact, stabilization (quality_0_3, notes, risk driver when relevant) and report peak_risk_phase, ground_contact_time_ms, time_to_stable_ms.
- coaching cues + coachingPlan (immediate cue, practice focus, monitoring).
- view_quality (score_0_1, fix_instructions, retry_recommended when score < 0.6).
- counterfactual tweak with predicted risk drop and whether to verify next rep.
- asymmetry_index_0_100 and delta_from_baseline (numeric changes vs athlete’s best recent rep).
- overlays array describing any visual guides to render (overlay_type, description, instructions).
Only use information supported by the frames and context; make view quality suggestions if framing is poor.
`;
const MOVEMENT_USER_PROMPT = (input) => {
    const { athleteId, drillType, context, frames } = input;
    const contextLines = [
        `athlete_id: ${athleteId}`,
        `drill_type: ${drillType}`,
        context?.surface ? `surface: ${context.surface}` : null,
        context?.environment ? `environment: ${context.environment}` : null,
        context?.temperatureF ? `temperature_f: ${context.temperatureF}` : null,
        context?.humidityPct ? `humidity_pct: ${context.humidityPct}` : null,
        context?.athleteProfile?.sex ? `sex: ${context.athleteProfile.sex}` : null,
        context?.athleteProfile?.position ? `position: ${context.athleteProfile.position}` : null,
        context?.notes ? `notes: ${context.notes}` : null,
    ]
        .filter(Boolean)
        .join("\n");
    const frameLines = frames
        .map((frame, idx) => `frame_${idx + 1}: { id: ${frame.id}, captured_at: ${frame.capturedAt}, label: ${frame.label ?? "n/a"}, url: ${frame.url} }`)
        .join("\n");
    return `
Evaluate lower-extremity landing risk from the supplied frames.
Rate frontal plane knee collapse (valgus) 0–3 where 3 is severe.
Mark trunk lean outside base of support true/false.
Mark foot plant outside centre of mass true/false.
Segment the action into phases (prep, takeoff, first_contact, stabilization) and fill the phase_scores object.
Estimate time_to_stable_ms, ground_contact_time_ms, and identify peak_risk_phase.
Evaluate camera quality (score_0_1). If low, provide fix instructions and set retry_recommended true.
Provide 1–3 short coaching cues, a single counterfactual tweak with predicted_risk_drop, and monitoring guidance.
Compare to the athlete baseline when possible to compute asymmetry_index_0_100 and delta_from_baseline metrics.
List overlay instructions so the app can draw visual cues (hip-knee-ankle line, target line, etc.).

Context:
${contextLines}

Frames:
${frameLines}
`.trim();
};
const buildMockMovementAssessment = (input) => {
    const generatedAt = new Date().toISOString();
    const riskRating = input.drillType === "unplanned_cut" ? 2 : 1;
    const cues = [
        input.drillType === "drop_jump" ? "Land softly with knees tracking toes." : "Keep hips back and chest tall.",
        "Stabilize knee over ankle on landing.",
    ];
    const overview = {
        headline: riskRating >= 2 ? "Moderate valgus risk detected" : "Mechanics trending safe",
        summary: riskRating >= 2
            ? "Plant limb shows moderate valgus drift on deceleration. Reinforce hip hinge and softer knee flexion."
            : "Landing control is improving with only light valgus. Keep coaching soft hinge and stacked joints.",
        confidence: 78,
    };
    const riskSignals = [
        {
            label: riskRating >= 2 ? "Knee valgus drift" : "Controlled valgus",
            severity: riskRating >= 2 ? "moderate" : "low",
            evidence: riskRating >= 2
                ? "Frame 2 shows knee tracking inside ankle during plant."
                : "Knee stays mostly stacked during landing sequence.",
        },
        {
            label: "Foot placement",
            severity: riskRating >= 2 ? "moderate" : "low",
            evidence: riskRating >= 2
                ? "Lead foot lands wide of COM increasing hip torque."
                : "Foot strike remains near COM, reducing torque.",
        },
    ];
    const coachingPlan = {
        immediateCue: riskRating >= 2 ? "Drive knee over middle toe on plant" : "Keep soft knees and stacked ankle-knee",
        practiceFocus: riskRating >= 2 ? "Eccentric single-leg squat with mirror feedback" : "Continue pogo hops focusing on hip hinge",
        monitoring: riskRating >= 2 ? "Re-film decel drills after next session" : "Check landing mechanics after fatigue sessions",
    };
    const phaseScores = {
        prep: { quality0to3: 2, notes: "Solid hip hinge." },
        takeoff: { quality0to3: 2, notes: "Balanced drive." },
        firstContact: {
            quality0to3: riskRating >= 2 ? 1 : 2,
            riskDriver: riskRating >= 2 ? "knee_valgus" : undefined,
            notes: "Plant knee drifts inside mid-foot.",
        },
        stabilization: {
            quality0to3: riskRating >= 2 ? 1 : 2,
            timeToStableMs: riskRating >= 2 ? 420 : 290,
            notes: "Needs faster hip engagement to lock position.",
        },
    };
    const timeToStableMs = phaseScores.stabilization?.timeToStableMs ?? null;
    const groundContactTimeMs = riskRating >= 2 ? 210 : 180;
    const peakRiskPhase = riskRating >= 2 ? "first_contact" : "stabilization";
    const viewQuality = {
        score0to1: 0.72,
        fixInstructions: "Lower camera ~20cm and slide left to capture full foot strike",
        retryRecommended: false,
    };
    const counterfactual = {
        tweak: riskRating >= 2 ? "shorten_last_step_10pct" : "deeper_prep_bend",
        predictedRiskDrop: riskRating >= 2 ? 0.28 : 0.12,
        nextRepVerify: true,
        summary: riskRating >= 2 ? "Shorter last step reduces torque and valgus risk." : "Maintain deeper prep to lock in control.",
    };
    const asymmetryIndex0to100 = 23;
    const deltaFromBaseline = { valgus_angle_deg: riskRating >= 2 ? 6.4 : 1.5, time_to_stable_ms: riskRating >= 2 ? 110 : 15 };
    const overlays = [
        {
            overlayType: "hip_knee_ankle_line",
            description: "Highlight alignment vs target line",
            instructions: "Draw red wedge when knee crosses inside green toe line.",
            severity: riskRating >= 2 ? "moderate" : "low",
        },
        {
            overlayType: "com_projection",
            description: "Visualise COM over base",
            instructions: "Show COM dot and projected base to cue stacked landing.",
        },
    ];
    const rawModelOutput = {
        source: "mock",
        overview,
        riskSignals,
        coachingPlan,
        phase_scores: {
            prep: { quality_0_3: phaseScores.prep?.quality0to3, notes: phaseScores.prep?.notes },
            takeoff: { quality_0_3: phaseScores.takeoff?.quality0to3, notes: phaseScores.takeoff?.notes },
            first_contact: {
                quality_0_3: phaseScores.firstContact?.quality0to3,
                notes: phaseScores.firstContact?.notes,
                risk_driver: phaseScores.firstContact?.riskDriver,
            },
            stabilization: {
                quality_0_3: phaseScores.stabilization?.quality0to3,
                notes: phaseScores.stabilization?.notes,
                time_to_stable_ms: phaseScores.stabilization?.timeToStableMs,
            },
        },
        time_to_stable_ms: timeToStableMs,
        ground_contact_time_ms: groundContactTimeMs,
        peak_risk_phase: peakRiskPhase,
        view_quality: {
            score_0_1: viewQuality.score0to1,
            fix_instructions: viewQuality.fixInstructions,
            retry_recommended: viewQuality.retryRecommended,
        },
        counterfactual: {
            tweak: counterfactual.tweak,
            predicted_risk_drop: counterfactual.predictedRiskDrop,
            next_rep_verify: counterfactual.nextRepVerify,
            summary: counterfactual.summary,
        },
        asymmetry_index_0_100: asymmetryIndex0to100,
        delta_from_baseline: deltaFromBaseline,
        overlays: overlays.map((overlay) => ({
            overlay_type: overlay.overlayType,
            description: overlay.description,
            instructions: overlay.instructions,
            severity: overlay.severity,
        })),
    };
    return {
        assessmentId: (0, crypto_1.randomUUID)(),
        athleteId: input.athleteId,
        drillType: input.drillType,
        riskRating,
        cues,
        metrics: {
            kneeValgusScore: riskRating,
            trunkLeanOutsideBOS: input.drillType !== "drop_jump",
            footPlantOutsideCOM: input.drillType !== "drop_jump",
        },
        overview,
        riskSignals,
        coachingPlan,
        phaseScores,
        timeToStableMs: timeToStableMs ?? undefined,
        groundContactTimeMs,
        peakRiskPhase,
        viewQuality,
        counterfactual,
        asymmetryIndex0to100,
        deltaFromBaseline,
        overlays,
        frames: input.frames,
        context: input.context,
        generatedAt,
        rawModelOutput,
    };
};
const extractJson = (content) => {
    if (!content) {
        return null;
    }
    if (typeof content === "string") {
        try {
            return JSON.parse(content);
        }
        catch {
            return null;
        }
    }
    if (Array.isArray(content)) {
        for (const item of content) {
            const parsed = extractJson(item);
            if (parsed) {
                return parsed;
            }
        }
    }
    if (typeof content === "object") {
        if ("text" in content && typeof content.text === "string") {
            return extractJson(content.text);
        }
        if ("content" in content) {
            return extractJson(content.content);
        }
    }
    return null;
};
const mapPhaseScore = (phase) => {
    if (!phase || typeof phase !== "object")
        return undefined;
    return {
        quality0to3: phase.quality_0_3 ?? phase.quality ?? null,
        notes: phase.notes ?? null,
        riskDriver: phase.risk_driver ?? phase.riskDriver ?? null,
        timeToStableMs: phase.time_to_stable_ms ?? phase.timeToStableMs ?? null,
    };
};
const parsePhaseScores = (raw) => {
    if (!raw || typeof raw !== "object")
        return undefined;
    return {
        prep: mapPhaseScore(raw.prep),
        takeoff: mapPhaseScore(raw.takeoff),
        firstContact: mapPhaseScore(raw.first_contact ?? raw.firstContact),
        stabilization: mapPhaseScore(raw.stabilization),
    };
};
const ensureSeverity = (value) => {
    if (value === "low" || value === "moderate" || value === "high")
        return value;
    return "moderate";
};
const parseRiskSignals = (raw) => {
    if (!Array.isArray(raw))
        return undefined;
    return raw
        .map((signal) => ({
        label: signal?.label ?? "",
        severity: ensureSeverity(signal?.severity),
        evidence: signal?.evidence ?? "",
    }))
        .filter((signal) => !!signal.label);
};
const parseViewQuality = (raw) => {
    if (!raw || typeof raw !== "object")
        return undefined;
    if (typeof raw.score_0_1 !== "number")
        return undefined;
    return {
        score0to1: raw.score_0_1,
        fixInstructions: raw.fix_instructions ?? raw.fixInstructions ?? null,
        retryRecommended: raw.retry_recommended ?? raw.retryRecommended ?? raw.score_0_1 < 0.6,
    };
};
const parseCounterfactual = (raw) => {
    if (!raw || typeof raw !== "object")
        return undefined;
    if (!raw.tweak)
        return undefined;
    return {
        tweak: raw.tweak,
        predictedRiskDrop: typeof raw.predicted_risk_drop === "number" ? raw.predicted_risk_drop : 0,
        nextRepVerify: Boolean(raw.next_rep_verify ?? raw.nextRepVerify),
        summary: raw.summary ?? undefined,
    };
};
const parseOverlays = (raw) => {
    if (!Array.isArray(raw))
        return undefined;
    return raw
        .map((overlay) => ({
        overlayType: overlay?.overlay_type ?? overlay?.overlayType ?? "",
        description: overlay?.description ?? undefined,
        instructions: overlay?.instructions ?? undefined,
        severity: overlay?.severity ? ensureSeverity(overlay.severity) : undefined,
    }))
        .filter((overlay) => overlay.overlayType);
};
const createMovementAssessment = async (input) => {
    const client = (0, openaiClient_1.getOpenAIClient)();
    await (0, athleteService_1.ensureAthlete)(input.athleteId, input.context?.athleteProfile?.name ?? input.context?.athleteProfile?.position ?? input.athleteId);
    if (!client || env_1.env.USE_OPENAI_MOCKS) {
        const result = buildMockMovementAssessment(input);
        await persistMovementAssessment(input, result);
        return result;
    }
    try {
        const imageContents = await Promise.all(input.frames.map((frame) => (0, openaiMedia_1.buildInputImageContent)(frame.url)));
        const response = await client.responses.create({
            model: env_1.env.NODE_ENV === "production" ? "gpt-4.1" : "gpt-4.1-mini",
            input: [
                {
                    role: "system",
                    content: MOVEMENT_SYSTEM_PROMPT.trim(),
                },
                {
                    role: "user",
                    content: [
                        { type: "input_text", text: MOVEMENT_USER_PROMPT(input) },
                        ...imageContents.filter(Boolean),
                    ],
                },
            ],
            text: {
                format: {
                    type: "json_schema",
                    name: "MovementAssessment",
                    schema: MOVEMENT_RESPONSE_SCHEMA,
                    strict: false,
                },
            },
        });
        const parsed = response.output?.[0]?.content?.find((item) => item?.parsed)?.parsed ??
            extractJson(response.output ?? response);
        if (!parsed) {
            throw new Error("Unable to parse OpenAI response for movement assessment");
        }
        const phaseScores = parsePhaseScores(parsed.phase_scores);
        const riskSignals = parseRiskSignals(parsed.riskSignals ?? parsed.risk_signals);
        const viewQuality = parseViewQuality(parsed.view_quality ?? parsed.viewQuality);
        const counterfactual = parseCounterfactual(parsed.counterfactual);
        const overlays = parseOverlays(parsed.overlays);
        const timeToStableMs = parsed.time_to_stable_ms ?? parsed.phase_scores?.stabilization?.time_to_stable_ms ?? null;
        const groundContactTimeMs = parsed.ground_contact_time_ms ?? null;
        const peakRiskPhase = parsed.peak_risk_phase ?? null;
        const asymmetryIndex0to100 = parsed.asymmetry_index_0_100 ?? null;
        const deltaFromBaseline = parsed.delta_from_baseline ?? null;
        const result = {
            assessmentId: (0, crypto_1.randomUUID)(),
            athleteId: input.athleteId,
            drillType: input.drillType,
            riskRating: parsed.riskRating,
            cues: parsed.cues,
            metrics: parsed.metrics,
            overview: parsed.overview,
            riskSignals,
            coachingPlan: parsed.coachingPlan,
            phaseScores,
            timeToStableMs: timeToStableMs ?? undefined,
            groundContactTimeMs: groundContactTimeMs ?? undefined,
            peakRiskPhase: peakRiskPhase ?? undefined,
            viewQuality,
            counterfactual,
            asymmetryIndex0to100: asymmetryIndex0to100 ?? undefined,
            deltaFromBaseline,
            overlays,
            frames: input.frames,
            context: input.context,
            generatedAt: new Date().toISOString(),
            rawModelOutput: parsed,
        };
        await persistMovementAssessment(input, result);
        return result;
    }
    catch (error) {
        console.error("OpenAI movement assessment failed", error);
        const fallback = buildMockMovementAssessment(input);
        await persistMovementAssessment(input, fallback);
        return fallback;
    }
};
exports.createMovementAssessment = createMovementAssessment;
const persistMovementAssessment = async (input, result) => {
    const contextPayload = {
        ...input.context,
    };
    const framesPayload = input.frames.map((frame, index) => ({
        id: frame.id,
        snapshotUrl: frame.url,
        label: frame.label,
        capturedAt: frame.capturedAt,
        frameIndex: index,
    }));
    await prisma_1.prisma.$transaction(async (tx) => {
        await tx.movementAssessment.create({
            data: {
                id: result.assessmentId,
                athleteId: input.athleteId,
                sessionId: input.sessionId,
                drillType: input.drillType,
                riskRating: result.riskRating,
                cues: JSON.stringify(result.cues),
                metrics: JSON.stringify(result.metrics),
                context: JSON.stringify(contextPayload),
                rawModelOutput: JSON.stringify(result.rawModelOutput ?? {}),
                frames: {
                    createMany: {
                        data: framesPayload,
                    },
                },
            },
        });
    });
};
const listMovementAssessments = (athleteId, limit = 20) => prisma_1.prisma.movementAssessment.findMany({
    where: { athleteId },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
        frames: {
            orderBy: { frameIndex: "asc" },
        },
        recommendations: true,
    },
});
exports.listMovementAssessments = listMovementAssessments;
const getMovementAssessment = (assessmentId) => prisma_1.prisma.movementAssessment.findUnique({
    where: { id: assessmentId },
    include: {
        frames: {
            orderBy: { frameIndex: "asc" },
        },
        recommendations: true,
        athlete: true,
    },
});
exports.getMovementAssessment = getMovementAssessment;
//# sourceMappingURL=assessmentService.js.map