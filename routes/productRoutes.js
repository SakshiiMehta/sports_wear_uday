const express = require("express")
const router = express.Router()
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
} = require("../controllers/productController")
const { protect, admin } = require("../middleware/authMiddleware")
const upload = require("../middleware/uploadMiddleware")

// Public routes
router.route("/").get(getProducts).post(protect, admin, upload.single("image"), createProduct)

router.get("/top", getTopProducts)

router
  .route("/:id")
  .get(getProductById)
  .put(protect, admin, upload.single("image"), updateProduct)
  .delete(protect, admin, deleteProduct)

router.route("/:id/reviews").post(protect, createProductReview)

module.exports = router

