"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
require("dotenv/config");
const zod_1 = require("zod");
const rawEnvSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(["development", "test", "production"]).default("development"),
    PORT: zod_1.z.coerce.number().default(4000),
    OPENAI_API_KEY: zod_1.z.string().min(1).optional(),
    ALLOWED_ORIGINS: zod_1.z.string().optional(),
    DATABASE_URL: zod_1.z.string().optional(),
    STORAGE_BUCKET: zod_1.z.string().optional(),
    USE_OPENAI_MOCKS: zod_1.z.enum(["true", "false"]).optional(),
    JWT_SECRET: zod_1.z.string().min(6).optional(),
    MEDIA_UPLOAD_DIR: zod_1.z.string().optional(),
    PUBLIC_URL: zod_1.z.string().optional(),
});
const parsed = rawEnvSchema.safeParse(process.env);
if (!parsed.success) {
    console.error("Invalid environment configuration", parsed.error.flatten().fieldErrors);
    throw new Error("Invalid environment configuration");
}
const base = parsed.data;
exports.env = {
    ...base,
    USE_OPENAI_MOCKS: base.USE_OPENAI_MOCKS === "true",
};
if (!exports.env.OPENAI_API_KEY && !exports.env.USE_OPENAI_MOCKS) {
    console.warn("OPENAI_API_KEY is not set. The service will fall back to mock responses. Set USE_OPENAI_MOCKS=true to silence this warning.");
}
if (!exports.env.JWT_SECRET) {
    console.warn("JWT_SECRET is not set. Authentication tokens will be insecure; set JWT_SECRET for production.");
}
//# sourceMappingURL=env.js.map