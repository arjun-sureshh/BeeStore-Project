const express = require("express");
const mongoose = require("mongoose");
const {
  createGallery,
  getGallery,
  getImagesByProductVaraintId,
} = require("../controllers/galleryControllers");
const { upload, handleMulterError } = require("../config/multerConfig");

const router = express.Router();

const validateFormData = (req, res, next) => {
  if (!req.body.productVariantId) {
    console.error("Missing productVariantId in request body");
    return res.status(400).json({ error: "Product Variant ID is required" });
  }
  console.log("FormData validated, body:", req.body);
  next();
};

// POST /api/storage
router.post("/", upload, handleMulterError, createGallery);

// GET /api/storage
router.get("/", getGallery);

// GET /api/storage/fetchImagesBYProductVaraintId/:productVariantId
router.get("/fetchImagesBYProductVaraintId/:productVariantId", getImagesByProductVaraintId);

// GET /api/storage/file/:fileId
router.get("/file/:fileId", async (req, res) => {
  try {
    const gfs = req.app.get("gfs");
    if (!gfs) {
      console.error("GridFS not initialized");
      return res.status(500).json({ error: "GridFS not initialized" });
    }
    if (!mongoose.Types.ObjectId.isValid(req.params.fileId)) {
      console.error(`Invalid fileId: ${req.params.fileId}`);
      return res.status(400).json({ error: "Invalid file ID" });
    }
    const fileId = new mongoose.Types.ObjectId(req.params.fileId);
    const files = await gfs.find({ _id: fileId }).toArray();
    if (!files || files.length === 0) {
      console.error(`File not found: ${fileId}`);
      return res.status(404).json({ error: "File not found" });
    }
    console.log(`Serving file: ${files[0].filename}`);
    const readStream = gfs.openDownloadStream(fileId);
    res.set("Content-Type", files[0].contentType);
    readStream.on("error", (error) => {
      console.error("Error streaming file:", error);
      res.status(500).json({ error: "Error streaming file" });
    });
    readStream.pipe(res);
  } catch (error) {
    console.error("Error retrieving file:", error);
    res.status(500).json({ error: "Error retrieving file", details: error.message });
  }
});

console.log("Gallery routes registered: POST /api/storage, GET /api/storage/file/:fileId");

module.exports = router;