"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postAudienceRewrite = void 0;
const zod_1 = require("zod");
const audienceService_1 = require("../services/audienceService");
const audienceSchema = zod_1.z.object({
    assessmentId: zod_1.z.string(),
    baselineMessage: zod_1.z.string(),
    audience: zod_1.z.enum(["coach", "athlete", "parent", "at_pt"]),
    tone: zod_1.z.enum(["technical", "supportive", "motivational"]).optional(),
});
const postAudienceRewrite = async (req, res) => {
    const parsed = audienceSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.flatten() });
    }
    const result = await (0, audienceService_1.rewriteForAudience)(parsed.data);
    return res.status(201).json(result);
};
exports.postAudienceRewrite = postAudienceRewrite;
//# sourceMappingURL=audienceController.js.map