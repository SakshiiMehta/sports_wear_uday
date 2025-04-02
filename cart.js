/**
 * Shopping Cart Functionality
 * This file contains all the functionality for the shopping cart and checkout process
 */

// Initialize cart in localStorage if it doesn't exist
function initCart() {
  if (!localStorage.getItem("cart")) {
    localStorage.setItem("cart", JSON.stringify([]))
  }
}

// Get cart items from localStorage
function getCartItems() {
  return JSON.parse(localStorage.getItem("cart")) || []
}

// Save cart items to localStorage
function saveCartItems(items) {
  localStorage.setItem("cart", JSON.stringify(items))
}

// Add item to cart
function addToCart(product) {
  const cartItems = getCartItems()

  // Check if product with same ID, size and color already exists
  const existingItemIndex = cartItems.findIndex(
    (item) => item.id === product.id && item.size === product.size && item.color === product.color,
  )

  if (existingItemIndex > -1) {
    // Update quantity if item already exists
    cartItems[existingItemIndex].quantity += product.quantity
  } else {
    // Add new item
    cartItems.push(product)
  }

  saveCartItems(cartItems)
  updateCartCount()

  return cartItems.length
}

// Remove item from cart
function removeFromCart(index) {
  const cartItems = getCartItems()
  cartItems.splice(index, 1)
  saveCartItems(cartItems)
  updateCartCount()
  return cartItems
}

// Update item quantity in cart
function updateCartItemQuantity(index, quantity) {
  const cartItems = getCartItems()
  cartItems[index].quantity = quantity
  saveCartItems(cartItems)
  return cartItems
}

// Calculate cart total
function calculateCartTotal() {
  const cartItems = getCartItems()
  return cartItems.reduce((total, item) => {
    // Remove currency symbol and commas, convert to number
    const price = Number.parseFloat(item.price.replace(/[₹,]/g, ""))
    return total + price * item.quantity
  }, 0)
}

// Update cart count in the header
function updateCartCount() {
  const cartItems = getCartItems()
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0)

  // Update cart count badge if it exists
  const cartCountBadge = document.getElementById("cartCountBadge")
  if (cartCountBadge) {
    cartCountBadge.textContent = cartCount
    cartCountBadge.style.display = cartCount > 0 ? "inline-block" : "none"
  }
}

// Clear cart
function clearCart() {
  localStorage.removeItem("cart")
  initCart()
  updateCartCount()
}

// Format price with currency symbol
function formatPrice(price) {
  return (
    "₹" +
    price
      .toFixed(2)
      .replace(/\d(?=(\d{3})+\.)/g, "$&,")
      .replace(".00", "")
  )
}

// Initialize cart when page loads
document.addEventListener("DOMContentLoaded", () => {
  initCart()
  updateCartCount()
})

// Save shipping address to localStorage
function saveShippingAddress(address) {
  localStorage.setItem("shippingAddress", JSON.stringify(address))
}

// Get shipping address from localStorage
function getShippingAddress() {
  return JSON.parse(localStorage.getItem("shippingAddress")) || {}
}

// Save order to localStorage (for demo purposes)
function saveOrder(order) {
  // Get existing orders or initialize empty array
  const orders = JSON.parse(localStorage.getItem("orders")) || []

  // Add new order
  orders.push(order)

  // Save orders
  localStorage.setItem("orders", JSON.stringify(orders))

  // Return order ID (for demo, just use timestamp)
  return order.id
}

// Create a new order
function createOrder(cartItems, shippingAddress, paymentMethod) {
  const order = {
    id: "ORD" + Date.now(),
    date: new Date().toISOString(),
    items: cartItems,
    shippingAddress: shippingAddress,
    paymentMethod: paymentMethod,
    total: calculateCartTotal(),
    status: "Confirmed",
  }

  return saveOrder(order)
}

// Process checkout
function processCheckout(shippingAddress, paymentMethod) {
  const cartItems = getCartItems()

  if (cartItems.length === 0) {
    return { success: false, message: "Your cart is empty" }
  }

  // Save shipping address
  saveShippingAddress(shippingAddress)

  // Create order
  const orderId = createOrder(cartItems, shippingAddress, paymentMethod)

  // Clear cart after successful order
  clearCart()

  return {
    success: true,
    message: "Order placed successfully",
    orderId: orderId,
  }
}

// Validate checkout form
function validateCheckoutForm(form) {
  const requiredFields = ["fullName", "email", "phone", "address", "city", "state", "pincode"]

  const errors = {}

  requiredFields.forEach((field) => {
    if (!form[field] || form[field].trim() === "") {
      errors[field] = "This field is required"
    }
  })

  // Validate email format
  if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) {
    errors.email = "Please enter a valid email address"
  }

  // Validate phone number (10 digits)
  if (form.phone && !/^\d{10}$/.test(form.phone)) {
    errors.phone = "Please enter a valid 10-digit phone number"
  }

  // Validate pincode (6 digits)
  if (form.pincode && !/^\d{6}$/.test(form.pincode)) {
    errors.pincode = "Please enter a valid 6-digit pincode"
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors: errors,
  }
}

