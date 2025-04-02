/**
 * This script handles Razorpay payment integration
 */

// Function to initialize Razorpay payment
function initializeRazorpay(orderId, amount, userInfo) {
  // Load Razorpay script if not already loaded
  if (!window.Razorpay) {
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    document.body.appendChild(script)

    // Wait for script to load
    script.onload = () => {
      createRazorpayOrder(orderId, amount, userInfo)
    }
  } else {
    createRazorpayOrder(orderId, amount, userInfo)
  }
}

// Function to create Razorpay order
function createRazorpayOrder(orderId, amount, userInfo) {
  // In a real application, this would be an API call to your backend
  // For demo purposes, we'll simulate it

  // Convert amount to paise (Razorpay uses smallest currency unit)
  const amountInPaise = Math.round(amount * 100)

  const options = {
    key: "rzp_test_YOUR_KEY_ID", // Replace with your Razorpay Key ID
    amount: amountInPaise,
    currency: "INR",
    name: "Clan India Lifestyle",
    description: `Order #${orderId}`,
    image: "img/Logo/logo.jpg",
    order_id: `order_${orderId}`, // This would come from your backend in a real app
    handler: (response) => {
      // Handle successful payment
      handlePaymentSuccess(response, orderId)
    },
    prefill: {
      name: `${userInfo.firstName} ${userInfo.lastName}`,
      email: userInfo.email,
      contact: userInfo.phone,
    },
    notes: {
      order_id: orderId,
    },
    theme: {
      color: "#007bff",
    },
  }

  const razorpayInstance = new window.Razorpay(options)
  razorpayInstance.open()
}

// Function to handle successful payment
function handlePaymentSuccess(response, orderId) {
  // In a real application, this would verify the payment with your backend
  // For demo purposes, we'll simulate it

  // Show success message
  alert("Payment successful! Your order has been placed.")

  // Redirect to order confirmation page
  window.location.href = `order-confirmation.html?orderId=${orderId}`
}

// Function to process payment during checkout
function processPayment(orderId, amount, userInfo) {
  // Get selected payment method
  const paymentMethod = document.querySelector(".payment-method.selected").getAttribute("data-method")

  if (paymentMethod === "card" || paymentMethod === "upi" || paymentMethod === "wallet") {
    // Use Razorpay for online payments
    initializeRazorpay(orderId, amount, userInfo)
  } else if (paymentMethod === "cod") {
    // For Cash on Delivery, just place the order
    alert("Your order has been placed successfully! You will pay on delivery.")
    window.location.href = `order-confirmation.html?orderId=${orderId}`
  }
}

