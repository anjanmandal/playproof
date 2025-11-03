import { Request, Response } from "express";
import { buildMediaUrl } from "../config/storage";

export const postMediaUpload = (req: Request, res: Response) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  return res.status(201).json({
    filename: file.filename,
    url: buildMediaUrl(file.filename),
    mimetype: file.mimetype,
    size: file.size,
  });
};
