const mongoose = require("mongoose")
const dotenv = require("dotenv")
const colors = require("colors")
const connectDB = require("../config/db")
const Product = require("../models/productModel")
const User = require("../models/userModel")

// Sample data
const products = [
  {
    name: "Essential Gym Tank Top",
    price: 314,
    originalPrice: 349,
    description:
      "A lightweight and comfortable gym tank top for everyday workouts. Features moisture-wicking fabric and anti-microbial technology to keep you fresh during intense sessions.",
    image: "/uploads/tank-top.jpg",
    category: "men",
    subcategory: "tanktops",
    sizes: ["S", "M", "L"],
    colors: ["red", "blue", "black"],
    countInStock: 50,
    isFeatured: true,
    isNewArrival: true,
  },
  {
    name: "Performance Panelled T-Shirt",
    price: 404,
    originalPrice: 449,
    description:
      "High-performance t-shirt designed for athletes. Made with breathable, quick-dry fabric that keeps you comfortable during any activity. Features a modern fit with stylish panelling.",
    image: "/uploads/tshirt.jpg",
    category: "men",
    subcategory: "tshirts",
    sizes: ["M", "L", "XL"],
    colors: ["green", "black", "blue"],
    countInStock: 75,
    isFeatured: true,
    isNewArrival: false,
  },
  {
    name: "Flex-Fit Joggers",
    price: 599,
    originalPrice: 649,
    description:
      "Premium joggers with 4-way stretch technology for maximum comfort and flexibility. Perfect for workouts or casual wear with moisture-wicking fabric and stylish design.",
    image: "/uploads/joggers.jpg",
    category: "men",
    subcategory: "joggers",
    sizes: ["S", "M", "L", "XL"],
    colors: ["black", "gray", "navy"],
    countInStock: 60,
    isFeatured: false,
    isNewArrival: true,
  },
  {
    name: "Women's Performance T-Shirt",
    price: 399,
    originalPrice: 449,
    description:
      "Women's high-performance t-shirt with moisture-wicking technology. Designed for maximum comfort during workouts with a flattering fit.",
    image: "/uploads/women-tshirt.jpg",
    category: "women",
    subcategory: "tshirts",
    sizes: ["XS", "S", "M", "L"],
    colors: ["pink", "purple", "black"],
    countInStock: 45,
    isFeatured: true,
    isNewArrival: true,
  },
  {
    name: "Women's Yoga Pants",
    price: 649,
    originalPrice: 699,
    description:
      "Premium yoga pants with 4-way stretch and high waistband. Perfect for yoga, gym, or casual wear with flattering fit and hidden pocket.",
    image: "/uploads/yoga-pants.jpg",
    category: "women",
    subcategory: "joggers",
    sizes: ["XS", "S", "M", "L"],
    colors: ["black", "navy", "gray"],
    countInStock: 55,
    isFeatured: false,
    isNewArrival: true,
  },
]

// Admin user
const adminUser = {
  firstName: "Admin",
  lastName: "User",
  email: "admin@example.com",
  phone: "1234567890",
  password: "123456",
  isAdmin: true,
}

// Import data
const importData = async () => {
  try {
    // Load environment variables
    dotenv.config()

    // Connect to database
    await connectDB()

    // Clear existing data
    await Product.deleteMany()
    await User.deleteMany()

    // Create admin user
    const createdAdmin = await User.create(adminUser)
    console.log(`Admin user created: ${createdAdmin.email}`.green.inverse)

    // Create products
    await Product.insertMany(products)
    console.log(`${products.length} products imported`.green.inverse)

    console.log("Data import complete!".green.inverse)
    process.exit()
  } catch (error) {
    console.error(`${error}`.red.inverse)
    process.exit(1)
  }
}

// Delete data
const destroyData = async () => {
  try {
    // Load environment variables
    dotenv.config()

    // Connect to database
    await connectDB()

    // Clear existing data
    await Product.deleteMany()
    await User.deleteMany()

    console.log("Data destroyed!".red.inverse)
    process.exit()
  } catch (error) {
    console.error(`${error}`.red.inverse)
    process.exit(1)
  }
}

// Run script
if (process.argv[2] === "-d") {
  destroyData()
} else {
  importData()
}

