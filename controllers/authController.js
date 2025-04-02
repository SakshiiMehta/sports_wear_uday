const asyncHandler = require("express-async-handler")
const jwt = require("jsonwebtoken")
const User = require("../models/userModel")

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  })
}

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, phone, password } = req.body

  // Validate input
  if (!firstName || !lastName || !email || !phone || !password) {
    res.status(400)
    throw new Error("Please provide all required fields")
  }

  // Check if user already exists
  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400)
    throw new Error("User already exists")
  }

  // Create user
  const user = await User.create({
    firstName,
    lastName,
    email,
    phone,
    password,
  })

  if (user) {
    res.status(201).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    })
  } else {
    res.status(400)
    throw new Error("Invalid user data")
  }
})

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  // Validate input
  if (!email || !password) {
    res.status(400)
    throw new Error("Please provide email and password")
  }

  // Find user by email
  const user = await User.findOne({ email })

  // Check if user exists and password matches
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    })
  } else {
    res.status(401)
    throw new Error("Invalid email or password")
  }
})

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password")

  if (user) {
    res.json(user)
  } else {
    res.status(404)
    throw new Error("User not found")
  }
})

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (user) {
    user.firstName = req.body.firstName || user.firstName
    user.lastName = req.body.lastName || user.lastName
    user.phone = req.body.phone || user.phone

    if (req.body.email && req.body.email !== user.email) {
      // Check if email is already in use
      const emailExists = await User.findOne({ email: req.body.email })

      if (emailExists) {
        res.status(400)
        throw new Error("Email already in use")
      }

      user.email = req.body.email
    }

    if (req.body.password) {
      user.password = req.body.password
    }

    const updatedUser = await user.save()

    res.json({
      _id: updatedUser._id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      phone: updatedUser.phone,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    })
  } else {
    res.status(404)
    throw new Error("User not found")
  }
})

// @desc    Add user address
// @route   POST /api/auth/address
// @access  Private
const addUserAddress = asyncHandler(async (req, res) => {
  const { name, phone, line1, line2, city, state, pincode, type, isDefault } = req.body

  // Validate input
  if (!name || !phone || !line1 || !city || !state || !pincode || !type) {
    res.status(400)
    throw new Error("Please provide all required fields")
  }

  const user = await User.findById(req.user._id)

  if (user) {
    const newAddress = {
      name,
      phone,
      line1,
      line2,
      city,
      state,
      pincode,
      type,
      isDefault: isDefault || false,
    }

    // If this is set as default, unset default for all other addresses
    if (newAddress.isDefault) {
      user.addresses.forEach((addr) => {
        addr.isDefault = false
      })
    }

    user.addresses.push(newAddress)

    const updatedUser = await user.save()

    res.status(201).json(updatedUser.addresses)
  } else {
    res.status(404)
    throw new Error("User not found")
  }
})

// @desc    Update user address
// @route   PUT /api/auth/address/:addressId
// @access  Private
const updateUserAddress = asyncHandler(async (req, res) => {
  const { addressId } = req.params
  const { name, phone, line1, line2, city, state, pincode, type, isDefault } = req.body

  const user = await User.findById(req.user._id)

  if (!user) {
    res.status(404)
    throw new Error("User not found")
  }

  // Find address index
  const addressIndex = user.addresses.findIndex((addr) => addr._id.toString() === addressId)

  if (addressIndex === -1) {
    res.status(404)
    throw new Error("Address not found")
  }

  // Update address
  if (name) user.addresses[addressIndex].name = name
  if (phone) user.addresses[addressIndex].phone = phone
  if (line1) user.addresses[addressIndex].line1 = line1
  if (line2 !== undefined) user.addresses[addressIndex].line2 = line2
  if (city) user.addresses[addressIndex].city = city
  if (state) user.addresses[addressIndex].state = state
  if (pincode) user.addresses[addressIndex].pincode = pincode
  if (type) user.addresses[addressIndex].type = type

  // Handle default address
  if (isDefault) {
    // Unset default for all other addresses
    user.addresses.forEach((addr) => {
      addr.isDefault = false
    })

    // Set this address as default
    user.addresses[addressIndex].isDefault = true
  }

  const updatedUser = await user.save()

  res.json(updatedUser.addresses)
})

// @desc    Delete user address
// @route   DELETE /api/auth/address/:addressId
// @access  Private
const deleteUserAddress = asyncHandler(async (req, res) => {
  const { addressId } = req.params

  const user = await User.findById(req.user._id)

  if (!user) {
    res.status(404)
    throw new Error("User not found")
  }

  // Filter out the address to delete
  user.addresses = user.addresses.filter((addr) => addr._id.toString() !== addressId)

  const updatedUser = await user.save()

  res.json(updatedUser.addresses)
})

// @desc    Get all users
// @route   GET /api/auth/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select("-password")
  res.json(users)
})

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  addUserAddress,
  updateUserAddress,
  deleteUserAddress,
  getUsers,
}

