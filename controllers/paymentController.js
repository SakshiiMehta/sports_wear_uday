const asyncHandler = require("express-async-handler")
const Razorpay = require("razorpay")
const crypto = require("crypto")
const Order = require("../models/orderModel")

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
})

// @desc    Create Razorpay order
// @route   POST /api/payments/razorpay
// @access  Private
const createRazorpayOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.body

  // Validate input
  if (!orderId) {
    res.status(400)
    throw new Error("Please provide order ID")
  }

  // Get order from database
  const order = await Order.findById(orderId)

  if (!order) {
    res.status(404)
    throw new Error("Order not found")
  }

  // Check if order belongs to user
  if (order.user.toString() !== req.user._id.toString()) {
    res.status(403)
    throw new Error("Not authorized")
  }

  // Check if order is already paid
  if (order.isPaid) {
    res.status(400)
    throw new Error("Order is already paid")
  }

  // Create Razorpay order
  const payment_capture = 1
  const amount = Math.round(order.totalPrice * 100) // Convert to paise
  const currency = "INR"

  const options = {
    amount,
    currency,
    receipt: orderId,
    payment_capture,
  }

  try {
    const response = await razorpay.orders.create(options)

    // Save Razorpay order ID to our order
    order.razorpayOrderId = response.id
    await order.save()

    res.json({
      id: response.id,
      amount: response.amount,
      currency: response.currency,
      orderId: order._id,
    })
  } catch (error) {
    console.error("Razorpay Error:", error)
    res.status(500)
    throw new Error("Error creating Razorpay order")
  }
})

// @desc    Verify Razorpay payment
// @route   POST /api/payments/razorpay/verify
// @access  Private
const verifyRazorpayPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body

  // Validate input
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId) {
    res.status(400)
    throw new Error("Please provide all required fields")
  }

  // Get order from database
  const order = await Order.findById(orderId)

  if (!order) {
    res.status(404)
    throw new Error("Order not found")
  }

  // Check if order belongs to user
  if (order.user.toString() !== req.user._id.toString()) {
    res.status(403)
    throw new Error("Not authorized")
  }

  // Verify signature
  const generated_signature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex")

  if (generated_signature === razorpay_signature) {
    // Payment is successful
    order.isPaid = true
    order.paidAt = Date.now()
    order.status = "Processing"
    order.paymentResult = {
      id: razorpay_payment_id,
      status: "COMPLETED",
      update_time: Date.now(),
      email_address: req.user.email,
    }

    const updatedOrder = await order.save()

    res.json(updatedOrder)
  } else {
    res.status(400)
    throw new Error("Payment verification failed")
  }
})

// @desc    Get Razorpay key
// @route   GET /api/payments/razorpay/key
// @access  Public
const getRazorpayKey = asyncHandler(async (req, res) => {
  res.json({ key: process.env.RAZORPAY_KEY_ID })
})

module.exports = {
  createRazorpayOrder,
  verifyRazorpayPayment,
  getRazorpayKey,
}

