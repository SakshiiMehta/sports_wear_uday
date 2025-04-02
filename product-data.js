/**
 * Product Data
 * This file contains all the product data for the website
 */

// Product database
const products = {
  1: {
    id: "1",
    name: "Essential Gym Tank Top",
    price: "₹314",
    originalPrice: "₹349",
    description:
      "A lightweight and comfortable gym tank top for everyday workouts. Features moisture-wicking fabric and anti-microbial technology to keep you fresh during intense sessions.",
    image: "img/home/tanktops.jpg",
    category: "men",
    subcategory: "tanktops",
    sizes: ["S", "M", "L"],
    colors: ["red", "blue", "black"],
  },
  2: {
    id: "2",
    name: "Performance Panelled T-Shirt",
    price: "₹404",
    originalPrice: "₹449",
    description:
      "High-performance t-shirt designed for athletes. Made with breathable, quick-dry fabric that keeps you comfortable during any activity. Features a modern fit with stylish panelling.",
    image: "img/home/tshirts.jpg",
    category: "men",
    subcategory: "tshirts",
    sizes: ["M", "L", "XL"],
    colors: ["green", "black", "blue"],
  },
  3: {
    id: "3",
    name: "Flex-Fit Joggers",
    price: "₹599",
    originalPrice: "₹649",
    description:
      "Premium joggers with 4-way stretch technology for maximum comfort and flexibility. Perfect for workouts or casual wear with moisture-wicking fabric and stylish design.",
    image: "img/home/joggers.jpg",
    category: "men",
    subcategory: "joggers",
    sizes: ["S", "M", "L", "XL"],
    colors: ["black", "gray", "navy"],
  },
  4: {
    id: "4",
    name: "Quick-Dry Workout Shorts",
    price: "₹449",
    originalPrice: "₹499",
    description:
      "Lightweight, breathable shorts designed for intense workouts. Features quick-dry technology, built-in liner, and side pockets for convenience.",
    image: "img/home/shorts.jpg",
    category: "men",
    subcategory: "shorts",
    sizes: ["S", "M", "L", "XL"],
    colors: ["black", "blue", "red"],
  },
  5: {
    id: "5",
    name: "Premium Track Pants",
    price: "₹695",
    originalPrice: "₹799",
    description:
      "High-quality track pants with sleek design and comfortable fit. Perfect for running, training, or casual wear with elastic waistband and zippered pockets.",
    image: "img/home/ZHP_5072.jpg",
    category: "men",
    subcategory: "trackpants",
    sizes: ["S", "M", "L", "XL"],
    colors: ["black", "navy", "gray"],
  },
  6: {
    id: "6",
    name: "Stylish Cord Set",
    price: "₹999",
    originalPrice: "₹1299",
    description:
      "Premium matching set featuring a comfortable top and bottom in coordinated design. Perfect for workouts or lounging with soft, breathable fabric.",
    image: "img/home/cordsets.jpg",
    category: "men",
    subcategory: "cordsets",
    sizes: ["S", "M", "L", "XL"],
    colors: ["black", "gray", "blue"],
  },
  7: {
    id: "7",
    name: "Women's Performance T-Shirt",
    price: "₹399",
    originalPrice: "₹449",
    description:
      "Women's high-performance t-shirt with moisture-wicking technology. Designed for maximum comfort during workouts with a flattering fit.",
    image: "img/home/tshirts.jpg",
    category: "women",
    subcategory: "tshirts",
    sizes: ["XS", "S", "M", "L"],
    colors: ["pink", "purple", "black"],
  },
  8: {
    id: "8",
    name: "Women's Yoga Pants",
    price: "₹649",
    originalPrice: "₹699",
    description:
      "Premium yoga pants with 4-way stretch and high waistband. Perfect for yoga, gym, or casual wear with flattering fit and hidden pocket.",
    image: "img/home/joggers.jpg",
    category: "women",
    subcategory: "joggers",
    sizes: ["XS", "S", "M", "L"],
    colors: ["black", "navy", "gray"],
  },
  9: {
    id: "9",
    name: "Women's Training Shorts",
    price: "₹399",
    originalPrice: "₹449",
    description:
      "Lightweight training shorts designed specifically for women. Features quick-dry fabric, comfortable fit, and side pockets.",
    image: "img/home/shorts.jpg",
    category: "women",
    subcategory: "shorts",
    sizes: ["XS", "S", "M", "L"],
    colors: ["black", "pink", "blue"],
  },
  10: {
    id: "10",
    name: "Women's Workout Tank",
    price: "₹299",
    originalPrice: "₹349",
    description:
      "Stylish and functional workout tank with racerback design. Perfect for gym sessions with moisture-wicking and breathable fabric.",
    image: "img/home/tanktops.jpg",
    category: "women",
    subcategory: "tanktops",
    sizes: ["XS", "S", "M", "L"],
    colors: ["white", "black", "pink"],
  },
}

// Function to get product by ID
function getProduct(productId) {
  return products[productId] || null
}

// Function to get products by category
function getProductsByCategory(category) {
  return Object.values(products).filter((product) => product.category === category)
}

// Function to get products by subcategory
function getProductsBySubcategory(subcategory) {
  return Object.values(products).filter((product) => product.subcategory === subcategory)
}

// Function to get all products
function getAllProducts() {
  return Object.values(products)
}

// Function to get new arrivals (for demo, just return all products)
function getNewArrivals() {
  return Object.values(products)
}

