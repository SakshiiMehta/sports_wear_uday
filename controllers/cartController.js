const asyncHandler = require("express-async-handler")
const Cart = require("../models/cartModel")
const Product = require("../models/productModel")

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id }).populate("items.product")

  if (!cart) {
    // Create empty cart if it doesn't exist
    cart = await Cart.create({
      user: req.user._id,
      items: [],
    })
  }

  res.json(cart)
})

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity, size, color } = req.body

  // Validate input
  if (!productId || !quantity || !size || !color) {
    res.status(400)
    throw new Error("Please provide all required fields")
  }

  // Validate product
  const product = await Product.findById(productId)

  if (!product) {
    res.status(404)
    throw new Error("Product not found")
  }

  // Check if size is valid
  if (!product.sizes.includes(size)) {
    res.status(400)
    throw new Error("Invalid size")
  }

  // Check if color is valid
  if (!product.colors.includes(color)) {
    res.status(400)
    throw new Error("Invalid color")
  }

  // Find user's cart
  let cart = await Cart.findOne({ user: req.user._id })

  if (!cart) {
    // Create new cart if it doesn't exist
    cart = new Cart({
      user: req.user._id,
      items: [],
    })
  }

  // Check if item already exists in cart
  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId && item.size === size && item.color === color,
  )

  if (itemIndex > -1) {
    // Update quantity if item exists
    cart.items[itemIndex].quantity += Number(quantity)
  } else {
    // Add new item
    cart.items.push({
      product: productId,
      quantity: Number(quantity),
      size,
      color,
      price: product.price,
    })
  }

  // Save cart
  await cart.save()

  // Return updated cart
  const updatedCart = await Cart.findById(cart._id).populate("items.product")

  res.status(201).json(updatedCart)
})

// @desc    Update cart item quantity
// @route   PUT /api/cart/:itemId
// @access  Private
const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body
  const { itemId } = req.params

  // Validate input
  if (!quantity || quantity < 1) {
    res.status(400)
    throw new Error("Quantity must be at least 1")
  }

  // Find user's cart
  const cart = await Cart.findOne({ user: req.user._id })

  if (!cart) {
    res.status(404)
    throw new Error("Cart not found")
  }

  // Find item in cart
  const itemIndex = cart.items.findIndex((item) => item._id.toString() === itemId)

  if (itemIndex === -1) {
    res.status(404)
    throw new Error("Item not found in cart")
  }

  // Update quantity
  cart.items[itemIndex].quantity = Number(quantity)

  // Save cart
  await cart.save()

  // Return updated cart
  const updatedCart = await Cart.findById(cart._id).populate("items.product")

  res.json(updatedCart)
})

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
const removeCartItem = asyncHandler(async (req, res) => {
  const { itemId } = req.params

  // Find user's cart
  const cart = await Cart.findOne({ user: req.user._id })

  if (!cart) {
    res.status(404)
    throw new Error("Cart not found")
  }

  // Remove item from cart
  cart.items = cart.items.filter((item) => item._id.toString() !== itemId)

  // Save cart
  await cart.save()

  // Return updated cart
  const updatedCart = await Cart.findById(cart._id).populate("items.product")

  res.json(updatedCart)
})

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = asyncHandler(async (req, res) => {
  // Find user's cart
  const cart = await Cart.findOne({ user: req.user._id })

  if (!cart) {
    res.status(404)
    throw new Error("Cart not found")
  }

  // Clear items
  cart.items = []

  // Save cart
  await cart.save()

  res.json({ message: "Cart cleared" })
})

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
}

