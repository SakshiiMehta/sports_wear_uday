/**
 * This script handles authentication checks during checkout
 */

// Mock functions for isLoggedIn, setRedirectUrl, and getCurrentUser
// In a real application, these would be implemented properly
function isLoggedIn() {
  // Replace with actual authentication logic
  return localStorage.getItem("isLoggedIn") === "true"
}

function setRedirectUrl(url) {
  // Replace with actual redirect URL storage logic
  localStorage.setItem("redirectUrl", url)
}

function getCurrentUser() {
  // Replace with actual user retrieval logic
  const userString = localStorage.getItem("currentUser")
  return userString ? JSON.parse(userString) : null
}

document.addEventListener("DOMContentLoaded", () => {
  // Check if we're on the checkout page
  if (window.location.pathname.includes("checkout.html")) {
    // Check if user is logged in
    if (!isLoggedIn()) {
      // Save current URL for redirect after login
      setRedirectUrl(window.location.href)

      // Show alert
      alert("Please log in to continue with checkout.")

      // Redirect to login page
      window.location.href = "login.html"
    }
  }

  // Check if we're on the shopping cart page
  if (window.location.pathname.includes("shoppingcart.html")) {
    // Add event listener to checkout button
    const checkoutButton = document.querySelector('button[onclick="proceedToCheckout()"]')
    if (checkoutButton) {
      // Override the onclick attribute
      checkoutButton.removeAttribute("onclick")

      // Add new event listener
      checkoutButton.addEventListener("click", () => {
        // Check if user is logged in
        if (!isLoggedIn()) {
          // Save current URL for redirect after login
          setRedirectUrl("checkout.html")

          // Show alert
          alert("Please log in to continue with checkout.")

          // Redirect to login page
          window.location.href = "login.html"
        } else {
          // User is logged in, proceed to checkout
          window.location.href = "checkout.html"
        }
      })
    }
  }

  // Update account link in navbar
  updateAccountLink()
})

// Function to update account link in navbar
function updateAccountLink() {
  const accountLink = document.querySelector('.nav-item a[href="login.html"], .nav-item a[href="account.html"]')

  if (accountLink) {
    if (isLoggedIn()) {
      accountLink.href = "account.html"
      accountLink.innerHTML = '<i class="fa-solid fa-user"></i>'

      // Add username next to icon for larger screens
      const user = getCurrentUser()
      if (user) {
        const navItem = accountLink.closest(".nav-item")

        // Check if we already added the username
        if (!navItem.querySelector(".user-name")) {
          const userName = document.createElement("span")
          userName.className = "user-name d-none d-lg-inline ms-1"
          userName.textContent = user.firstName
          accountLink.appendChild(userName)
        }
      }
    } else {
      accountLink.href = "login.html"
      accountLink.innerHTML = '<i class="fa-solid fa-user"></i>'
    }
  }
}

