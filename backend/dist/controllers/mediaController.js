"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postMediaUpload = void 0;
const storage_1 = require("../config/storage");
const postMediaUpload = (req, res) => {
    const file = req.file;
    if (!file) {
        return res.status(400).json({ error: "No file uploaded" });
    }
    return res.status(201).json({
        filename: file.filename,
        url: (0, storage_1.buildMediaUrl)(file.filename),
        mimetype: file.mimetype,
        size: file.size,
    });
};
exports.postMediaUpload = postMediaUpload;
//# sourceMappingURL=mediaController.js.map