const { default: mongoose } = require("mongoose");
const Gallery = require("../models/galleryModels");

// Gallery Get
const getGallery = async (req, res) => {
  try {
    const photoDetails = await Gallery.find();
    const imageData = photoDetails.map((image) => ({
      _id: image._id,
      filename: image.filename,
      fileId: image.photos,
      photos: `${req.protocol}://${req.get("host")}/api/gallery/file/${image.photos}`,
    }));
    res.status(200).json({ message: "Gallery fetched successfully", data: imageData });
  } catch (error) {
    res.status(500).json({ message: "Error fetching gallery", error });
  }
};

// product images get by varaint Id
const getImagesByProductVaraintId = async (req, res) => {
  const { productVariantId } = req.params;

  console.log("Received productVariantId:", productVariantId); // Debugging log

  try {
    const productImageDetails = await Gallery.find({
      varientId: productVariantId,
    });
    console.log("Query Result:", productImageDetails); // Debugging log

    if (!productImageDetails.length) {
      return res
        .status(404)
        .json({ message: "Product Images not found with the given ID." });
    }

    const imageData = productImageDetails.map((image) => ({
      _id: image._id,
      filename: image.filename,
      fileId: image.photos,
      photos: `${req.protocol}://${req.get("host")}/api/gallery/file/${image.photos}`,
    }));

    res.status(200).json({
      message: "Product Images fetched successfully",
      data: imageData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching product Images", error });
  }
};

// Gallery Post

const createGallery = async (req, res) => {
  try {
    const { productVariantId } = req.body;

    if (!productVariantId) {
      console.error("Missing productVariantId");
      return res.status(400).json({ error: "Product Variant ID is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(productVariantId)) {
      console.error(`Invalid ObjectId: ${productVariantId}`);
      return res.status(400).json({ error: "Invalid Product Variant ID" });
    }

    if (!req.files || req.files.length === 0) {
      console.error("No files in req.files");
      return res.status(400).json({ error: "No valid images uploaded" });
    }

    console.log("Raw req.files:", req.files); // Debug raw files
    console.log("Processing files:", req.files.map(f => ({
      filename: f.filename || 'undefined',
      mime: f.mimetype || 'undefined',
      size: f.size || 'undefined',
      id: f.id || 'undefined'
    })));

    const uploadedImages = [];

    for (const file of req.files) {
      if (!file || !file.id || !file.filename) {
        console.error("Invalid file:", file);
        continue;
      }

      try {
        const newImage = new Gallery({
          varientId: new mongoose.Types.ObjectId(productVariantId),
          photos: file.id,
          filename: file.filename,
        });

        await newImage.save();
        console.log(`Saved Gallery document: ${newImage._id}`);
        uploadedImages.push({
          _id: newImage._id,
          filename: newImage.filename,
          fileId: newImage.photos,
          url: `${req.protocol}://${req.get("host")}/api/storage/file/${newImage.photos}`,
        });
      } catch (saveError) {
        console.error(`Error saving Gallery document for ${file.filename}:`, saveError);
        continue;
      }
    }

    if (uploadedImages.length === 0) {
      console.error("No Gallery documents saved");
      return res.status(400).json({ error: "No valid images were saved" });
    }

    console.log("Upload completed:", uploadedImages);
    res.status(201).json({
      message: "Images uploaded successfully",
      images: uploadedImages,
    });
  } catch (error) {
    console.error("Error in createGallery:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};

module.exports = {
  createGallery,
  getGallery,
  getImagesByProductVaraintId,
};