import fs from "fs";
import path from "path";
import multer from "multer";
import { env } from "./env";

export const mediaRoot = path.resolve(process.cwd(), env.MEDIA_UPLOAD_DIR ?? "uploads");

if (!fs.existsSync(mediaRoot)) {
  fs.mkdirSync(mediaRoot, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, mediaRoot);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const safeName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, safeName);
  },
});

const allowed = ["image/jpeg", "image/png", "image/webp", "video/mp4", "video/quicktime"];

export const mediaUploader = multer({
  storage,
  limits: {
    fileSize: 25 * 1024 * 1024,
  },
  fileFilter: (_req, file, cb) => {
    if (!allowed.includes(file.mimetype)) {
      cb(new Error("Unsupported file type"));
    } else {
      cb(null, true);
    }
  },
});

export const buildMediaUrl = (filename: string) => {
  const base =
    env.PUBLIC_URL ??
    (env.PORT ? `http://localhost:${env.PORT}` : undefined);

  return base ? `${base}/uploads/${filename}` : `/uploads/${filename}`;
};
