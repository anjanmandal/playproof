// src/utils/openaiImagePart.ts
import fs from "fs/promises";
import path from "path";
import { env } from "../config/env";
import { mediaRoot } from "../config/storage";

const inferMimeType = (filepath: string) => {
  const ext = path.extname(filepath).toLowerCase();
  switch (ext) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".webp":
      return "image/webp";
    case ".gif":
      return "image/gif";
    case ".heic":
    case ".heif":
      return "image/heic";
    // Videos are not valid for input_image; keep here for completeness,
    // but we won't embed them as data URLs.
    case ".mp4":
      return "video/mp4";
    case ".mov":
    case ".qt":
      return "video/quicktime";
    default:
      return "application/octet-stream";
  }
};

export type InputImageContent = {
  type: "input_image";
  image_url: string; // data URL or public URL
};

/**
 * Resolve the public base URL for the current server.
 * If PUBLIC_URL is set, it will be used. Otherwise, fallback to localhost.
 */
const getPublicBase = () => {
  if (env.PUBLIC_URL) {
    try {
      return new URL(env.PUBLIC_URL);
    } catch {
      // ignore malformed PUBLIC_URL and fallback to localhost
    }
  }
  const port = env.PORT ?? 4000;
  return new URL(`http://localhost:${port}`);
};

/**
 * Given a mediaUrl that may be a public URL or a "/uploads/..." path,
 * return the local absolute file path under mediaRoot if it points to a local upload.
 */
const resolveLocalUploadPath = (mediaUrl: string): string | null => {
  try {
    if (mediaUrl.startsWith("/uploads/")) {
      return path.join(mediaRoot, mediaUrl.replace("/uploads/", ""));
    }

    const parsed = new URL(mediaUrl);
    if (!parsed.pathname.startsWith("/uploads/")) return null;

    const publicBase = getPublicBase();
    if (parsed.host === publicBase.host) {
      return path.join(mediaRoot, parsed.pathname.replace("/uploads/", ""));
    }
  } catch {
    // Not a URL or other parsing issue; treat as non-local
    return null;
  }
  return null;
};

/**
 * Build a single OpenAI Responses API image content part.
 * If mediaUrl is a local upload, we read it and embed as a data URL.
 * Otherwise, we return the remote URL directly.
 *
 * NOTE: Only images are embedded as data URLs. Videos will be returned as-is (URL).
 */
export const buildInputImageContent = async (
  mediaUrl: string
): Promise<InputImageContent | null> => {
  if (!mediaUrl) return null;

  const localPath = resolveLocalUploadPath(mediaUrl);
  if (localPath) {
    try {
      const buffer = await fs.readFile(localPath);
      const mimeType = inferMimeType(localPath);

      // Only embed as data URL if it looks like an image/*
      if (mimeType.startsWith("image/")) {
        return {
          type: "input_image",
          image_url: `data:${mimeType};base64,${buffer.toString("base64")}`,
        };
      }

      // For non-images (e.g., videos), return the public URL instead of embedding
      // (Responses API image parts only accept images)
      const publicBase = getPublicBase();
      const relative = path.relative(mediaRoot, localPath);
      return {
        type: "input_image",
        image_url: new URL(`/uploads/${relative}`, publicBase).toString(),
      };
    } catch (error) {
      console.warn("Failed to read local media for OpenAI", localPath, error);
      // Fall through to return the original URL
    }
  }

  // remote/public URL or non-local path
  return {
    type: "input_image",
    image_url: mediaUrl,
  };
};

/**
 * Convenience: build multiple image content parts (filters out nulls).
 */
export const buildInputImageContents = async (
  mediaUrls: string[]
): Promise<InputImageContent[]> => {
  const parts = await Promise.all(mediaUrls.map((u) => buildInputImageContent(u)));
  return parts.filter((p): p is InputImageContent => Boolean(p));
};
