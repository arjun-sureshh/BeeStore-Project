const { default: mongoose } = require("mongoose");
const Gallery = require("../models/galleryModels");

// Gallery Get
const getGallery = async (req, res) => {
  try {
    const photoDetails = await Gallery.find();
    res.status(200).json(photoDetails);
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
      // Fix condition
      return res
        .status(404)
        .json({ message: "Product Images not found with the given ID." });
    }

    res.status(200).json({
      message: "Product Images fetched successfully",
      data: productImageDetails,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching product Images", error });
  }
};

// Gallery Post

const createGallery = async (req, res) => {
  try {
    let { productVariantId } = req.body; // Ensure it's a let variable

    if (!productVariantId) {
      return res.status(400).json({ error: "Product Variant ID is required" });
    }

    productVariantId = new mongoose.Types.ObjectId(String(productVariantId)); // Convert properly

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No images uploaded" });
    }

    let uploadedImages = [];

    for (let file of req.files) {
      const newImage = new Gallery({
        varientId: productVariantId, // Ensure this matches your schema
        photos: `/images/${file.filename}`,
      });

      await newImage.save();
      uploadedImages.push(newImage);
    }

    res
      .status(201)
      .json({
        message: "Images uploaded successfully",
        images: uploadedImages,
      });
  } catch (error) {
    console.error("Error saving images:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createGallery,
  getGallery,
  getImagesByProductVaraintId,
};
