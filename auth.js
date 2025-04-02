/**
 * Authentication Functions
 * This file contains all the functionality for user authentication
 */

// Initialize users in localStorage if they don't exist
function initUsers() {
  if (!localStorage.getItem("users")) {
    localStorage.setItem("users", JSON.stringify([]))
  }
}

// Get users from localStorage
function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || []
}

// Save users to localStorage
function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users))
}

// Register a new user
function register(userData) {
  const users = getUsers()

  // Check if email already exists
  if (users.some((user) => user.email === userData.email)) {
    return {
      success: false,
      message: "Email already registered. Please use a different email or login.",
    }
  }

  // Create new user
  const newUser = {
    id: Date.now().toString(),
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    phone: userData.phone,
    password: userData.password, // In a real app, this would be hashed
    createdAt: new Date().toISOString(),
  }

  // Add user to users array
  users.push(newUser)

  // Save users
  saveUsers(users)

  return {
    success: true,
    message: "Registration successful! You can now login.",
  }
}

// Login user
function login(email, password, rememberMe = false) {
  const users = getUsers()

  // Find user by email
  const user = users.find((user) => user.email === email)

  // Check if user exists and password is correct
  if (!user || user.password !== password) {
    return {
      success: false,
      message: "Invalid email or password. Please try again.",
    }
  }

  // Set session
  const session = {
    userId: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    expiresAt: rememberMe ? null : new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
  }

  // Save session
  localStorage.setItem("session", JSON.stringify(session))

  return {
    success: true,
    message: "Login successful!",
  }
}

// Check if user is logged in
function isLoggedIn() {
  const session = JSON.parse(localStorage.getItem("session"))

  if (!session) {
    return false
  }

  // Check if session has expired
  if (session.expiresAt && new Date(session.expiresAt) < new Date()) {
    // Session expired, clear it
    localStorage.removeItem("session")
    return false
  }

  return true
}

// Get current user
function getCurrentUser() {
  if (!isLoggedIn()) {
    return null
  }

  const session = JSON.parse(localStorage.getItem("session"))
  const users = getUsers()

  return users.find((user) => user.id === session.userId)
}

// Update user
function updateUser(updatedUser) {
  const users = getUsers()

  // Find user index
  const userIndex = users.findIndex((user) => user.id === updatedUser.id)

  if (userIndex === -1) {
    return false
  }

  // Update user
  users[userIndex] = updatedUser

  // Save users
  saveUsers(users)

  return true
}

// Logout user
function logout() {
  localStorage.removeItem("session")
}

// Set redirect URL for login
function setRedirectUrl(url) {
  localStorage.setItem("redirectUrl", url)
}

// Get redirect URL for login
function getRedirectUrl() {
  const url = localStorage.getItem("redirectUrl")
  localStorage.removeItem("redirectUrl")
  return url
}

// Check if authentication is required for checkout
function requireAuthForCheckout() {
  if (!isLoggedIn()) {
    // Save current URL for redirect after login
    setRedirectUrl(window.location.href)

    // Redirect to login page
    window.location.href = "login.html"
    return false
  }

  return true
}

// Initialize users when script loads
initUsers()

