const mongoose = require("mongoose");
const { GridFsStorage } = require("multer-gridfs-storage");
const path = require("path");
const multer = require("multer");
require("dotenv").config();

const storage = new GridFsStorage({
  url: process.env.MONGO_URI,
  file: (req, file) => {
    if (!file || !file.originalname || !file.mimetype) {
      console.error("Invalid file object in storage:", file);
      return null; // Skip invalid files
    }
    const prefix = file.mimetype.startsWith("image") ? "image" : "video";
    return {
      filename: `${prefix}-${Date.now()}${path.extname(file.originalname)}`,
      bucketName: "Uploads",
      metadata: {
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size || 'unknown' // Fallback for missing size
      }
    };
  },
});

storage.on("connection", () => {
  console.log("GridFsStorage connected to MongoDB");
});

storage.on("connectionError", (error) => {
  console.error("GridFsStorage connection error:", error);
});

const fileFilter = (req, file, cb) => {
  console.log("fileFilter received file:", {
    fieldname: file.fieldname,
    originalname: file.originalname,
    mimetype: file.mimetype,
    size: file.size || 'unknown',
    encoding: file.encoding
  });
  if (!file || !file.originalname || !file.mimetype) {
    console.error("Invalid file object in fileFilter:", file);
    return cb(new Error("Invalid file data"), false);
  }
  // Allow any file type (customize allowedTypes if needed)
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "video/mp4",
    "image/webp",
    "image/avif",
    "image/gif",
    "image/bmp",
    "image/tiff",
    "video/mpeg",
    "video/webm"
  ];
  // Uncomment to restrict types
  // if (!allowedTypes.includes(file.mimetype)) {
  //   const error = new Error("Only JPEG, PNG, MP4, WebP, AVIF, GIF, BMP, TIFF, MPEG, and WebM files are allowed!");
  //   console.error("File rejected:", file.originalname, error.message);
  //   return cb(error, false);
  // }
  console.log(`File accepted: ${file.originalname}, type: ${file.mimetype}, size: ${file.size || 'unknown'} bytes`);
  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024, files: 5 } // 10MB, max 5 files
}).array("photos");

const handleMulterError = (err, req, res, next) => {
  console.error("Multer error:", err);
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: "One or more files exceed the 10MB limit." });
    }
    if (err.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({ error: "Too many files. Maximum is 5." });
    }
    return res.status(400).json({ error: `Multer error: ${err.message}` });
  }
  if (err.message) {
    return res.status(400).json({ error: err.message });
  }
  return res.status(400).json({
    error: "File upload error",
    details: err.message || "Unknown error"
  });
};

module.exports = { upload, handleMulterError };