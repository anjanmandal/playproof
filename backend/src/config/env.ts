import "dotenv/config";
import { z } from "zod";

const rawEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(4000),
  OPENAI_API_KEY: z.string().min(1).optional(),
  ALLOWED_ORIGINS: z.string().optional(),
  DATABASE_URL: z.string().optional(),
  STORAGE_BUCKET: z.string().optional(),
  USE_OPENAI_MOCKS: z.enum(["true", "false"]).optional(),
  JWT_SECRET: z.string().min(6).optional(),
  MEDIA_UPLOAD_DIR: z.string().optional(),
  PUBLIC_URL: z.string().optional(),
  WEARABLES_ENABLED: z.enum(["true", "false"]).optional(),
  WEARABLES_MODE: z.enum(["mock", "ble", "off"]).optional(),
  NOTIFICATIONS_WEBHOOK_URL: z.string().url().optional(),
  EVIDENCE_SECRET: z.string().optional(),
});

const parsed = rawEnvSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment configuration", parsed.error.flatten().fieldErrors);
  throw new Error("Invalid environment configuration");
}

const base = parsed.data;

export const env = {
  ...base,
  USE_OPENAI_MOCKS: base.USE_OPENAI_MOCKS === "true",
  WEARABLES_ENABLED: base.WEARABLES_ENABLED ? base.WEARABLES_ENABLED === "true" : false,
  WEARABLES_MODE:
    base.WEARABLES_ENABLED && base.WEARABLES_ENABLED === "true" ? base.WEARABLES_MODE ?? "mock" : "off",
};

if (!env.OPENAI_API_KEY && !env.USE_OPENAI_MOCKS) {
  console.warn(
    "OPENAI_API_KEY is not set. The service will fall back to mock responses. Set USE_OPENAI_MOCKS=true to silence this warning.",
  );
}

if (!env.JWT_SECRET) {
  console.warn("JWT_SECRET is not set. Authentication tokens will be insecure; set JWT_SECRET for production.");
}
