const asyncHandler = require("express-async-handler")
const Order = require("../models/orderModel")
const Cart = require("../models/cartModel")
const Product = require("../models/productModel")

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  const { shippingAddress, paymentMethod } = req.body

  // Validate input
  if (!shippingAddress || !paymentMethod) {
    res.status(400)
    throw new Error("Please provide shipping address and payment method")
  }

  // Get user's cart
  const cart = await Cart.findOne({ user: req.user._id }).populate("items.product")

  if (!cart || cart.items.length === 0) {
    res.status(400)
    throw new Error("No items in cart")
  }

  // Create order items
  const orderItems = cart.items.map((item) => {
    return {
      product: item.product._id,
      name: item.product.name,
      image: item.product.image,
      price: item.price,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
    }
  })

  // Calculate prices
  const itemsPrice = cart.totalPrice

  // Free shipping for orders over ₹999
  const shippingPrice = itemsPrice >= 999 ? 0 : 99

  const totalPrice = itemsPrice + shippingPrice

  // Create order
  const order = new Order({
    user: req.user._id,
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    totalPrice,
    status: paymentMethod === "cod" ? "Processing" : "Pending",
  })

  const createdOrder = await order.save()

  // Clear cart after order is created
  cart.items = []
  await cart.save()

  res.status(201).json(createdOrder)
})

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate("user", "firstName lastName email")

  if (order) {
    // Check if order belongs to user or user is admin
    if (order.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      res.status(403)
      throw new Error("Not authorized to view this order")
    }

    res.json(order)
  } else {
    res.status(404)
    throw new Error("Order not found")
  }
})

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort("-createdAt")

  res.json(orders)
})

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)

  if (order) {
    // Check if order belongs to user or user is admin
    if (order.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      res.status(403)
      throw new Error("Not authorized to update this order")
    }

    order.isPaid = true
    order.paidAt = Date.now()
    order.status = "Processing"
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer?.email_address || req.user.email,
    }

    const updatedOrder = await order.save()

    res.json(updatedOrder)
  } else {
    res.status(404)
    throw new Error("Order not found")
  }
})

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)

  if (order) {
    order.isDelivered = true
    order.deliveredAt = Date.now()
    order.status = "Delivered"

    if (req.body.trackingNumber) {
      order.trackingNumber = req.body.trackingNumber
    }

    const updatedOrder = await order.save()

    res.json(updatedOrder)
  } else {
    res.status(404)
    throw new Error("Order not found")
  }
})

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body

  if (!status) {
    res.status(400)
    throw new Error("Please provide status")
  }

  const order = await Order.findById(req.params.id)

  if (order) {
    order.status = status

    // Update related fields based on status
    if (status === "Delivered") {
      order.isDelivered = true
      order.deliveredAt = Date.now()
    } else if (status === "Shipped" && req.body.trackingNumber) {
      order.trackingNumber = req.body.trackingNumber
    }

    const updatedOrder = await order.save()

    res.json(updatedOrder)
  } else {
    res.status(404)
    throw new Error("Order not found")
  }
})

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate("user", "firstName lastName email").sort("-createdAt")

  res.json(orders)
})

module.exports = {
  createOrder,
  getOrderById,
  getMyOrders,
  updateOrderToPaid,
  updateOrderToDelivered,
  updateOrderStatus,
  getOrders,
}

