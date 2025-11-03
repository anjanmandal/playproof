"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildMediaUrl = exports.mediaUploader = exports.mediaRoot = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
const env_1 = require("./env");
exports.mediaRoot = path_1.default.resolve(process.cwd(), env_1.env.MEDIA_UPLOAD_DIR ?? "uploads");
if (!fs_1.default.existsSync(exports.mediaRoot)) {
    fs_1.default.mkdirSync(exports.mediaRoot, { recursive: true });
}
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, exports.mediaRoot);
    },
    filename: (_req, file, cb) => {
        const ext = path_1.default.extname(file.originalname);
        const safeName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
        cb(null, safeName);
    },
});
const allowed = ["image/jpeg", "image/png", "image/webp", "video/mp4", "video/quicktime"];
exports.mediaUploader = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: 25 * 1024 * 1024,
    },
    fileFilter: (_req, file, cb) => {
        if (!allowed.includes(file.mimetype)) {
            cb(new Error("Unsupported file type"));
        }
        else {
            cb(null, true);
        }
    },
});
const buildMediaUrl = (filename) => {
    const base = env_1.env.PUBLIC_URL ??
        (env_1.env.PORT ? `http://localhost:${env_1.env.PORT}` : undefined);
    return base ? `${base}/uploads/${filename}` : `/uploads/${filename}`;
};
exports.buildMediaUrl = buildMediaUrl;
//# sourceMappingURL=storage.js.map