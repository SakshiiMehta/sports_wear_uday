const express = require("express")
const router = express.Router()
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  addUserAddress,
  updateUserAddress,
  deleteUserAddress,
  getUsers,
} = require("../controllers/authController")
const { protect, admin } = require("../middleware/authMiddleware")

// Public routes
router.post("/register", registerUser)
router.post("/login", loginUser)

// Protected routes
router.route("/profile").get(protect, getUserProfile).put(protect, updateUserProfile)

router.route("/address").post(protect, addUserAddress)

router.route("/address/:addressId").put(protect, updateUserAddress).delete(protect, deleteUserAddress)

// Admin routes
router.route("/users").get(protect, admin, getUsers)

module.exports = router

