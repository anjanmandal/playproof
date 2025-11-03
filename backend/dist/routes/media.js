"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mediaRouter = void 0;
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const storage_1 = require("../config/storage");
const mediaController_1 = require("../controllers/mediaController");
exports.mediaRouter = (0, express_1.Router)();
exports.mediaRouter.post("/upload", auth_1.authenticate, storage_1.mediaUploader.single("file"), mediaController_1.postMediaUpload);
//# sourceMappingURL=media.js.map