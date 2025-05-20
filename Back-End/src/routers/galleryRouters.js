const express = require("express");
const {
  createGallery,
  getGallery,
  getImagesByProductVaraintId,
} = require("../controllers/galleryControllers");
const upload = require("../config/multerConfig");

const router = express.Router();

// ✅ Ensure "images" matches the Multer field name
router.post("/gallery", upload.array("photos", 5), createGallery);
router.get("/", getGallery);
router.get(
  "/fetchImagesBYProductVaraintId/:productVariantId",
  getImagesByProductVaraintId,
);

module.exports = router;
