const asyncHandler = require("express-async-handler")
const Product = require("../models/productModel")

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  // Pagination
  const pageSize = 12
  const page = Number(req.query.page) || 1

  // Build filter object
  const filter = {}

  // Filter by category
  if (req.query.category) {
    filter.category = req.query.category
  }

  // Filter by subcategory
  if (req.query.subcategory) {
    filter.subcategory = req.query.subcategory
  }

  // Filter by search term
  if (req.query.keyword) {
    filter.name = {
      $regex: req.query.keyword,
      $options: "i",
    }
  }

  // Filter by price range
  if (req.query.minPrice && req.query.maxPrice) {
    filter.price = {
      $gte: Number(req.query.minPrice),
      $lte: Number(req.query.maxPrice),
    }
  } else if (req.query.minPrice) {
    filter.price = { $gte: Number(req.query.minPrice) }
  } else if (req.query.maxPrice) {
    filter.price = { $lte: Number(req.query.maxPrice) }
  }

  // Filter by featured
  if (req.query.featured === "true") {
    filter.isFeatured = true
  }

  // Filter by new arrivals
  if (req.query.newArrival === "true") {
    filter.isNewArrival = true
  }

  // Count total documents
  const count = await Product.countDocuments(filter)

  // Get products
  const products = await Product.find(filter)
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort(req.query.sort || "-createdAt")

  // Send response
  res.json({
    products,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  })
})

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)

  if (product) {
    res.json(product)
  } else {
    res.status(404)
    throw new Error("Product not found")
  }
})

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    originalPrice,
    description,
    category,
    subcategory,
    sizes,
    colors,
    countInStock,
    isFeatured,
    isNewArrival,
  } = req.body

  // Validate required fields
  if (!name || !price || !originalPrice || !description || !category || !subcategory || !sizes || !colors) {
    res.status(400)
    throw new Error("Please fill all required fields")
  }

  // Create image path
  const image = req.file ? `/uploads/${req.file.filename}` : "/uploads/default-product.jpg"

  // Create product
  const product = new Product({
    name,
    price,
    originalPrice,
    description,
    image,
    category,
    subcategory,
    sizes: Array.isArray(sizes) ? sizes : sizes.split(","),
    colors: Array.isArray(colors) ? colors : colors.split(","),
    countInStock: countInStock || 100,
    isFeatured: isFeatured || false,
    isNewArrival: isNewArrival || false,
  })

  const createdProduct = await product.save()

  res.status(201).json(createdProduct)
})

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    originalPrice,
    description,
    category,
    subcategory,
    sizes,
    colors,
    countInStock,
    isFeatured,
    isNewArrival,
  } = req.body

  const product = await Product.findById(req.params.id)

  if (product) {
    // Update fields
    product.name = name || product.name
    product.price = price || product.price
    product.originalPrice = originalPrice || product.originalPrice
    product.description = description || product.description
    product.category = category || product.category
    product.subcategory = subcategory || product.subcategory

    if (sizes) {
      product.sizes = Array.isArray(sizes) ? sizes : sizes.split(",")
    }

    if (colors) {
      product.colors = Array.isArray(colors) ? colors : colors.split(",")
    }

    if (countInStock !== undefined) {
      product.countInStock = countInStock
    }

    if (isFeatured !== undefined) {
      product.isFeatured = isFeatured
    }

    if (isNewArrival !== undefined) {
      product.isNewArrival = isNewArrival
    }

    // Update image if provided
    if (req.file) {
      product.image = `/uploads/${req.file.filename}`
    }

    const updatedProduct = await product.save()

    res.json(updatedProduct)
  } else {
    res.status(404)
    throw new Error("Product not found")
  }
})

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)

  if (product) {
    await product.deleteOne()
    res.json({ message: "Product removed" })
  } else {
    res.status(404)
    throw new Error("Product not found")
  }
})

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body

  const product = await Product.findById(req.params.id)

  if (product) {
    // Check if user already reviewed
    const alreadyReviewed = product.reviews.find((r) => r.user.toString() === req.user._id.toString())

    if (alreadyReviewed) {
      res.status(400)
      throw new Error("Product already reviewed")
    }

    const review = {
      name: `${req.user.firstName} ${req.user.lastName}`,
      rating: Number(rating),
      comment,
      user: req.user._id,
    }

    product.reviews.push(review)

    product.numReviews = product.reviews.length

    product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length

    await product.save()
    res.status(201).json({ message: "Review added" })
  } else {
    res.status(404)
    throw new Error("Product not found")
  }
})

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(5)

  res.json(products)
})

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
}

