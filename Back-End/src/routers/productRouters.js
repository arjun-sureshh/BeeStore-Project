const express = require("express");
const {
  getProduct,
  updateBrandId,
  updateSkuidAndFullfilement,
  createProduct,
  getProductById,
  getProductBySellerID,
  deleteProduct,
  getProductByProductId,
  getProductToQC,
  updateQcStatus,
  getApprovedProduct,
  getRejectedProduct,
  getProductsGroupedByTopCategory,
  getProductBasedOnTopCategory,
  searchProducts,
  searchProductSuggestions,
  getProductsBySearchKeyword,
  getCancelledProducts,
} = require("../controllers/productControllers");

const router = express.Router();

router.post("/", createProduct);

router.get("/search/suggestions", searchProductSuggestions);
router.get("/search", searchProducts);

router.put("/brandId/:productId", updateBrandId);
router.put("/skuidUpdate/:productId", updateSkuidAndFullfilement);
router.put("/approved/:productId", updateQcStatus);
router.get("/", getProduct);
router.get("/grouped-by-category", getProductsGroupedByTopCategory);

router.post("/ByTopCategory", getProductBasedOnTopCategory);
router.post("/bySearchKeyword", getProductsBySearchKeyword);
router.post("/cancelled-products", getCancelledProducts);

router.get("/fetchToQC", getProductToQC);
router.get("/ApprovedProducts", getApprovedProduct);
router.get("/RejectedProducts", getRejectedProduct);
router.get("/:productId", getProductById);
router.get("/fetchallproducts/:sellerId", getProductBySellerID);
router.get("/fetchProductData/:productId", getProductByProductId);
router.delete("/:id", deleteProduct);

module.exports = router;
