/**
 * This script updates all product pages to make products clickable
 * and adds functionality to add products to cart
 */

// Assuming addToCart is defined elsewhere or imported
// For example:
// import { addToCart } from './cart-utils.js';
// Or:
function addToCart(item) {
  // Placeholder implementation - replace with your actual cart logic
  console.log("Adding to cart:", item)
  const cart = JSON.parse(localStorage.getItem("cart")) || []
  cart.push(item)
  localStorage.setItem("cart", JSON.stringify(cart))
}

document.addEventListener("DOMContentLoaded", () => {
  // Make all products clickable in category pages (men, women, new arrivals)
  const productItems = document.querySelectorAll(".product-item")

  productItems.forEach((item, index) => {
    // Get product ID from data attribute or use index + 1 as fallback
    const productId = item.getAttribute("data-product-id") || (index + 1).toString()

    // Make the entire product item clickable
    item.style.cursor = "pointer"
    item.addEventListener("click", (e) => {
      // Don't redirect if clicking on a button or size/color option
      if (
        e.target.tagName === "BUTTON" ||
        e.target.classList.contains("size-option") ||
        e.target.classList.contains("color-option")
      ) {
        return
      }

      // Redirect to product page with ID
      window.location.href = `product.html?id=${productId}`
    })

    // Handle add to cart button click
    const addButton = item.querySelector(".btn-primary")
    if (addButton) {
      addButton.addEventListener("click", (e) => {
        e.stopPropagation() // Prevent redirection

        // Get selected size and color
        let selectedSize = "M" // Default size
        let selectedColor = "black" // Default color

        // Try to get selected size
        const sizeOptions = item.querySelectorAll(".size-option")
        for (const sizeOption of sizeOptions) {
          if (sizeOption.classList.contains("active")) {
            selectedSize = sizeOption.textContent.trim()
            break
          }
        }

        // Try to get selected color
        const colorOptions = item.querySelectorAll(".color-option")
        for (const colorOption of colorOptions) {
          if (colorOption.classList.contains("active")) {
            // Get color from background or data attribute
            selectedColor = colorOption.getAttribute("data-color") || colorOption.style.background || "black"
            break
          }
        }

        // Get product details
        const productName = item.querySelector("p:first-of-type").textContent
        const priceText = item.querySelector("p:nth-of-type(2)").textContent
        const price = priceText.split(" ")[0] // Get the first part (₹314)
        const image = item.querySelector("img").src

        // Create cart item
        const cartItem = {
          id: productId,
          name: productName,
          price: price,
          image: image,
          size: selectedSize,
          color: selectedColor,
          quantity: 1,
        }

        // Add to cart
        addToCart(cartItem)

        // Show success message
        showAddToCartMessage(productName)
      })
    }

    // Add event listeners for size and color selection
    const sizeOptions = item.querySelectorAll(".size-option")
    sizeOptions.forEach((option) => {
      option.addEventListener("click", function (e) {
        e.stopPropagation() // Prevent redirection

        // Remove active class from all size options
        sizeOptions.forEach((opt) => opt.classList.remove("active"))

        // Add active class to selected option
        this.classList.add("active")
      })
    })

    const colorOptions = item.querySelectorAll(".color-option")
    colorOptions.forEach((option) => {
      option.addEventListener("click", function (e) {
        e.stopPropagation() // Prevent redirection

        // Remove active class from all color options
        colorOptions.forEach((opt) => opt.classList.remove("active"))

        // Add active class to selected option
        this.classList.add("active")
      })
    })
  })
})

// Function to show add to cart message
function showAddToCartMessage(productName) {
  // Create message element
  const messageDiv = document.createElement("div")
  messageDiv.className = "add-to-cart-message"
  messageDiv.innerHTML = `
        <div class="alert alert-success alert-dismissible fade show" role="alert">
            <i class="fas fa-check-circle me-2"></i> <strong>${productName}</strong> has been added to your cart!
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `

  // Add styles
  const style = document.createElement("style")
  style.textContent = `
        .add-to-cart-message {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            max-width: 300px;
        }
    `
  document.head.appendChild(style)

  // Add to document
  document.body.appendChild(messageDiv)

  // Remove after 3 seconds
  setTimeout(() => {
    messageDiv.remove()
  }, 3000)
}

