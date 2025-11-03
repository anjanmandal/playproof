"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfile = exports.postLogin = exports.postRegister = void 0;
const zod_1 = require("zod");
const authService_1 = require("../services/authService");
const client_1 = require("../generated/prisma/client");
const registerSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    role: zod_1.z.nativeEnum(client_1.Role),
    athleteId: zod_1.z.string().optional(),
    athleteDisplayName: zod_1.z.string().optional(),
});
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
});
const postRegister = async (req, res) => {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.flatten() });
    }
    try {
        const result = await (0, authService_1.registerUser)(parsed.data);
        return res.status(201).json(result);
    }
    catch (error) {
        return res.status(400).json({ error: error.message });
    }
};
exports.postRegister = postRegister;
const postLogin = async (req, res) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.flatten() });
    }
    try {
        const result = await (0, authService_1.loginUser)(parsed.data.email, parsed.data.password);
        return res.status(200).json(result);
    }
    catch (error) {
        return res.status(400).json({ error: error.message });
    }
};
exports.postLogin = postLogin;
const getProfile = (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    return res.json({ user: req.user });
};
exports.getProfile = getProfile;
//# sourceMappingURL=authController.js.map