const express = require("express")
const router = express.Router()
const { createRazorpayOrder, verifyRazorpayPayment, getRazorpayKey } = require("../controllers/paymentController")
const { protect } = require("../middleware/authMiddleware")

// Public routes
router.get("/razorpay/key", getRazorpayKey)

// Protected routes
router.post("/razorpay", protect, createRazorpayOrder)
router.post("/razorpay/verify", protect, verifyRazorpayPayment)

module.exports = router

