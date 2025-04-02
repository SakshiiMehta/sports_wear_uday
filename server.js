const express = require("express")
const dotenv = require("dotenv")
const cors = require("cors")
const path = require("path")
const helmet = require("helmet")
const xss = require("xss-clean")
const rateLimit = require("express-rate-limit")
const morgan = require("morgan")

// Load environment variables
dotenv.config()

// Import database connection
const connectDB = require("./config/db")

// Import routes
const authRoutes = require("./routes/authRoutes")
const productRoutes = require("./routes/productRoutes")
const cartRoutes = require("./routes/cartRoutes")
const orderRoutes = require("./routes/orderRoutes")
const paymentRoutes = require("./routes/paymentRoutes")

// Import error middleware
const { notFound, errorHandler } = require("./middleware/errorMiddleware")

// Connect to database
connectDB()

// Initialize Express
const app = express()

// Security middleware
app.use(helmet()) // Set security HTTP headers
app.use(xss()) // Sanitize user input

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes",
})
app.use("/api/", limiter)

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Logging in development mode
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"))
}

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// API Routes
app.use("/api/auth", authRoutes)
app.use("/api/products", productRoutes)
app.use("/api/cart", cartRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/payments", paymentRoutes)

// API health check
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "success", message: "API is running" })
})

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend")))

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend", "index.html"))
  })
} else {
  app.get("/", (req, res) => {
    res.send("API is running...")
  })
}

// Error handling middleware
app.use(notFound)
app.use(errorHandler)

// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
})

require('dotenv').config();
console.log(process.env.NODE_ENV); // This should now print 'development'
