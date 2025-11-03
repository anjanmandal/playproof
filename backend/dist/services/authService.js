"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.issueToken = exports.loginUser = exports.registerUser = void 0;
const crypto_1 = require("crypto");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../db/prisma");
const env_1 = require("../config/env");
const athleteService_1 = require("./athleteService");
const JWT_SECRET = env_1.env.JWT_SECRET ?? "dev-secret";
const TOKEN_EXPIRY = "12h";
const SALT_ROUNDS = 10;
const registerUser = async (input) => {
    const existing = await prisma_1.prisma.user.findUnique({ where: { email: input.email.toLowerCase() } });
    if (existing) {
        throw new Error("An account already exists with this email.");
    }
    let athleteId = input.athleteId;
    if (input.role === "ATHLETE" || input.role === "PARENT") {
        const id = input.athleteId ?? (0, crypto_1.randomUUID)();
        await (0, athleteService_1.ensureAthlete)(id, input.athleteDisplayName ?? id);
        athleteId = id;
    }
    const passwordHash = await bcryptjs_1.default.hash(input.password, SALT_ROUNDS);
    const user = await prisma_1.prisma.user.create({
        data: {
            email: input.email.toLowerCase(),
            passwordHash,
            role: input.role,
            athleteId,
        },
    });
    const token = (0, exports.issueToken)(user.id, user.role, user.email, user.athleteId);
    return {
        token,
        user: {
            id: user.id,
            email: user.email,
            role: user.role,
            athleteId: user.athleteId,
        },
    };
};
exports.registerUser = registerUser;
const loginUser = async (email, password) => {
    const user = await prisma_1.prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user) {
        throw new Error("Invalid email or password.");
    }
    const valid = await bcryptjs_1.default.compare(password, user.passwordHash);
    if (!valid) {
        throw new Error("Invalid email or password.");
    }
    const token = (0, exports.issueToken)(user.id, user.role, user.email, user.athleteId);
    return {
        token,
        user: {
            id: user.id,
            email: user.email,
            role: user.role,
            athleteId: user.athleteId,
        },
    };
};
exports.loginUser = loginUser;
const issueToken = (userId, role, email, athleteId) => jsonwebtoken_1.default.sign({
    sub: userId,
    role,
    email,
    athleteId,
}, JWT_SECRET, {
    expiresIn: TOKEN_EXPIRY,
});
exports.issueToken = issueToken;
const verifyToken = (token) => {
    return jsonwebtoken_1.default.verify(token, JWT_SECRET);
};
exports.verifyToken = verifyToken;
//# sourceMappingURL=authService.js.map