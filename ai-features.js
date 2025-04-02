/**
 * AI Features JavaScript
 * This file contains all the functionality for the AI features of the Clan India Lifestyle website
 */

// ===== COMMON UTILITIES =====

// Store user preferences in localStorage
function saveUserPreferences(preferences) {
  localStorage.setItem("userPreferences", JSON.stringify(preferences))
}

// Get user preferences from localStorage
function getUserPreferences() {
  const savedPrefs = localStorage.getItem("userPreferences")
  if (savedPrefs) {
    return JSON.parse(savedPrefs)
  }

  // Default preferences if none are saved
  return {
    gender: "male",
    bodyType: "athletic",
    occasion: "casual",
    stylePreferences: ["minimal"],
    colorPreferences: ["black", "blue", "gray"],
  }
}

// ===== AI ASSISTANT FUNCTIONALITY =====

// Initialize the AI Assistant
function initAiAssistant() {
  const sendButton = document.getElementById("sendMessage")
  const userInput = document.getElementById("userInput")
  const chatMessages = document.getElementById("chatMessages")
  const aiSearchButton = document.getElementById("aiSearchButton")
  const aiSearchInput = document.getElementById("aiSearchInput")

  // Send message when button is clicked
  if (sendButton) {
    sendButton.addEventListener("click", () => {
      sendMessage()
    })
  }

  // Send message when Enter key is pressed
  if (userInput) {
    userInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        sendMessage()
      }
    })
  }

  // AI Search functionality
  if (aiSearchButton && aiSearchInput) {
    aiSearchButton.addEventListener("click", () => {
      performAiSearch()
    })

    aiSearchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        performAiSearch()
      }
    })
  }

  // Function to send a message
  function sendMessage() {
    const message = userInput.value.trim()
    if (message === "") return

    // Add user message to chat
    addMessageToChat("user", message)

    // Clear input
    userInput.value = ""

    // Process message and get AI response
    processUserMessage(message)
  }

  // Function to add a message to the chat
  function addMessageToChat(sender, message) {
    const messageDiv = document.createElement("div")
    messageDiv.className = `message ${sender}-message`

    const avatar = document.createElement("div")
    avatar.className = "message-avatar"

    const icon = document.createElement("i")
    icon.className = sender === "user" ? "fas fa-user" : "fas fa-robot"
    avatar.appendChild(icon)

    const content = document.createElement("div")
    content.className = "message-content"
    content.innerHTML = `<p>${message}</p>`

    messageDiv.appendChild(avatar)
    messageDiv.appendChild(content)

    chatMessages.appendChild(messageDiv)

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight
  }

  // Function to process user message and generate AI response
  function processUserMessage(message) {
    // Show typing indicator
    showTypingIndicator()

    // Simulate AI thinking time
    setTimeout(() => {
      // Remove typing indicator
      removeTypingIndicator()

      // Generate response based on user message
      const response = generateAiResponse(message)

      // Add AI response to chat
      addMessageToChat("ai", response)

      // Update recommendations based on the conversation
      updateRecommendations(message)
    }, 1000)
  }

  // Function to show typing indicator
  function showTypingIndicator() {
    const typingDiv = document.createElement("div")
    typingDiv.className = "message ai-message typing-indicator"
    typingDiv.id = "typingIndicator"

    const avatar = document.createElement("div")
    avatar.className = "message-avatar"

    const icon = document.createElement("i")
    icon.className = "fas fa-robot"
    avatar.appendChild(icon)

    const content = document.createElement("div")
    content.className = "message-content"
    content.innerHTML = `<p>Typing<span class="dot">.</span><span class="dot">.</span><span class="dot">.</span></p>`

    typingDiv.appendChild(avatar)
    typingDiv.appendChild(content)

    chatMessages.appendChild(typingDiv)
    chatMessages.scrollTop = chatMessages.scrollHeight
  }

  // Function to remove typing indicator
  function removeTypingIndicator() {
    const typingIndicator = document.getElementById("typingIndicator")
    if (typingIndicator) {
      typingIndicator.remove()
    }
  }

  // Function to generate AI response based on user message
  function generateAiResponse(message) {
    message = message.toLowerCase()

    // Simple pattern matching for demo purposes
    if (message.includes("size") || message.includes("fit")) {
      return `Our sizes generally run true to size. For the most accurate fit, I recommend checking our size guide which you can find on each product page. You can also measure yourself and compare with our size chart. Would you like me to help you find the size guide for a specific product?`
    } else if (message.includes("shipping") || message.includes("delivery")) {
      return `We offer free standard shipping on all orders over ₹999. Standard delivery takes 3-5 business days, while express shipping (₹150) takes 1-2 business days. International shipping is also available for select countries. Would you like to know more about our shipping policies?`
    } else if (message.includes("return") || message.includes("refund")) {
      return `We have a 30-day return policy. If you're not satisfied with your purchase, you can return it within 30 days for a full refund. The items must be unworn and in their original packaging. Would you like me to guide you through the return process?`
    } else if (message.includes("workout") || message.includes("gym") || message.includes("exercise")) {
      return `Our performance workout collection is designed with moisture-wicking, anti-microbial fabric that keeps you comfortable during intense sessions. I'd recommend our Essential Gym Tank Top and Performance Joggers for a complete gym outfit. Would you like me to show you these products?`
    } else if (message.includes("discount") || message.includes("coupon") || message.includes("offer")) {
      return `We currently have a monsoon sale with 20% off on selected items. You can also get 10% off on your first order by subscribing to our newsletter. Would you like me to show you the products that are on sale?`
    } else if (message.includes("material") || message.includes("fabric")) {
      return `Our sportswear is made from high-quality, breathable fabrics. Most of our products use a blend of polyester and elastane for the perfect balance of comfort and stretch. Our premium line features anti-microbial and UV-protection properties. Which specific product would you like to know more about?`
    } else if (message.includes("trending") || message.includes("popular")) {
      return `Currently, our most popular items are the Performance Panelled T-Shirts and the Flex-Fit Joggers. These are trending because of their versatile style and comfort. Would you like me to show you these trending products?`
    } else if (message.includes("recommend") || message.includes("suggestion")) {
      return `Based on the current trends and your browsing history, I'd recommend our new Breathable Performance Collection. These items are perfect for both workouts and casual wear. Would you like to see some specific recommendations?`
    } else {
      return `Thank you for your message. I'd be happy to help you with information about our products, sizing, shipping, or anything else related to Clan India Lifestyle. Could you please provide more details about what you're looking for?`
    }
  }

  // Function to update recommendations based on conversation
  function updateRecommendations(message) {
    const recommendationItems = document.getElementById("recommendationItems")
    message = message.toLowerCase()

    // Clear current recommendations
    recommendationItems.innerHTML = ""

    // Generate recommendations based on the conversation
    if (message.includes("workout") || message.includes("gym") || message.includes("exercise")) {
      // Workout related recommendations
      recommendationItems.innerHTML = `
                <div class="recommendation-item" onclick="window.location.href='product.html?id=1'">
                    <img src="img/home/tanktops.jpg" alt="Tank Top" class="recommendation-image">
                    <div class="recommendation-details">
                        <h4>Essential Gym Tank Top</h4>
                        <p>Perfect for intense workouts</p>
                        <p class="recommendation-price">₹314</p>
                    </div>
                </div>
                <div class="recommendation-item" onclick="window.location.href='product.html?id=2'">
                    <img src="img/home/joggers.jpg" alt="Joggers" class="recommendation-image">
                    <div class="recommendation-details">
                        <h4>Performance Joggers</h4>
                        <p>Comfortable and flexible</p>
                        <p class="recommendation-price">₹599</p>
                    </div>
                </div>
                <div class="recommendation-item" onclick="window.location.href='product.html'">
                    <img src="img/home/shorts.jpg" alt="Shorts" class="recommendation-image">
                    <div class="recommendation-details">
                        <h4>Quick-Dry Workout Shorts</h4>
                        <p>Breathable and lightweight</p>
                        <p class="recommendation-price">₹449</p>
                    </div>
                </div>
            `
    } else if (message.includes("trending") || message.includes("popular")) {
      // Trending products
      recommendationItems.innerHTML = `
                <div class="recommendation-item" onclick="window.location.href='product.html'">
                    <img src="img/home/tshirts.jpg" alt="T-Shirt" class="recommendation-image">
                    <div class="recommendation-details">
                        <h4>Performance Panelled T-Shirt</h4>
                        <p>Our bestseller this month</p>
                        <p class="recommendation-price">₹404</p>
                    </div>
                </div>
                <div class="recommendation-item" onclick="window.location.href='product.html'">
                    <img src="img/home/joggers.jpg" alt="Joggers" class="recommendation-image">
                    <div class="recommendation-details">
                        <h4>Flex-Fit Joggers</h4>
                        <p>Trending now</p>
                        <p class="recommendation-price">₹599</p>
                    </div>
                </div>
                <div class="recommendation-item" onclick="window.location.href='product.html'">
                    <img src="img/home/cordsets.jpg" alt="Cord Set" class="recommendation-image">
                    <div class="recommendation-details">
                        <h4>Premium Cord Set</h4>
                        <p>New arrival</p>
                        <p class="recommendation-price">₹999</p>
                    </div>
                </div>
            `
    } else {
      // Default recommendations
      recommendationItems.innerHTML = `
                <div class="recommendation-placeholder">
                    <p>Ask me about products to see personalized recommendations here!</p>
                </div>
            `
    }
  }

  // Function to perform AI search
  function performAiSearch() {
    const searchQuery = aiSearchInput.value.trim()
    if (searchQuery === "") return

    // Add user message to chat
    addMessageToChat("user", `I'm looking for: ${searchQuery}`)

    // Clear input
    aiSearchInput.value = ""

    // Process search query
    processUserMessage(searchQuery)
  }
}

// Function to handle quick questions
function askQuickQuestion(question) {
  const userInput = document.getElementById("userInput")
  if (userInput) {
    userInput.value = question
    document.getElementById("sendMessage").click()
  }
}

// ===== VIRTUAL STYLIST FUNCTIONALITY =====

// Initialize the Virtual Stylist
function initVirtualStylist() {
  const updateButton = document.getElementById("updateStyleProfile")
  const outfitsGrid = document.getElementById("outfitsGrid")
  const colorOptions = document.querySelectorAll(".color-option")

  // Load user preferences
  const preferences = getUserPreferences()

  // Set form values based on saved preferences
  if (document.getElementById("gender")) {
    document.getElementById("gender").value = preferences.gender
  }
  if (document.getElementById("bodyType")) {
    document.getElementById("bodyType").value = preferences.bodyType
  }
  if (document.getElementById("occasion")) {
    document.getElementById("occasion").value = preferences.occasion
  }

  // Set style preferences
  if (preferences.stylePreferences.includes("minimal")) {
    document.getElementById("preferMinimal").checked = true
  }
  if (preferences.stylePreferences.includes("bold")) {
    document.getElementById("preferBold").checked = true
  }
  if (preferences.stylePreferences.includes("trendy")) {
    document.getElementById("preferTrendy").checked = true
  }
  if (preferences.stylePreferences.includes("classic")) {
    document.getElementById("preferClassic").checked = true
  }

  // Set color preferences
  colorOptions.forEach((option) => {
    const color = option.getAttribute("data-color")
    if (preferences.colorPreferences.includes(color)) {
      option.classList.add("active")
    }

    // Add click event to toggle selection
    option.addEventListener("click", function () {
      this.classList.toggle("active")
    })
  })

  // Update recommendations when button is clicked
  if (updateButton) {
    updateButton.addEventListener("click", () => {
      // Save new preferences
      saveNewPreferences()

      // Show loading state
      outfitsGrid.innerHTML = `
                <div class="outfit-loading">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <p>Generating outfit recommendations...</p>
                </div>
            `

      // Generate new outfit recommendations after a delay
      setTimeout(() => {
        generateOutfitRecommendations()
      }, 1500)
    })
  }

  // Function to save new preferences
  function saveNewPreferences() {
    const newPreferences = {
      gender: document.getElementById("gender").value,
      bodyType: document.getElementById("bodyType").value,
      occasion: document.getElementById("occasion").value,
      stylePreferences: [],
      colorPreferences: [],
    }

    // Get style preferences
    if (document.getElementById("preferMinimal").checked) {
      newPreferences.stylePreferences.push("minimal")
    }
    if (document.getElementById("preferBold").checked) {
      newPreferences.stylePreferences.push("bold")
    }
    if (document.getElementById("preferTrendy").checked) {
      newPreferences.stylePreferences.push("trendy")
    }
    if (document.getElementById("preferClassic").checked) {
      newPreferences.stylePreferences.push("classic")
    }

    // Get color preferences
    colorOptions.forEach((option) => {
      if (option.classList.contains("active")) {
        newPreferences.colorPreferences.push(option.getAttribute("data-color"))
      }
    })

    // Save preferences
    saveUserPreferences(newPreferences)
  }

  // Generate initial outfit recommendations
  generateOutfitRecommendations()

  // Function to generate outfit recommendations
  function generateOutfitRecommendations() {
    const preferences = getUserPreferences()
    const outfitsGrid = document.getElementById("outfitsGrid")

    // Clear current outfits
    outfitsGrid.innerHTML = ""

    // Generate outfits based on preferences
    const outfits = [
      {
        id: 1,
        name: "Everyday Performance",
        description: "Perfect for casual workouts and everyday wear",
        image: "img/home/tshirts.jpg",
        price: "₹999",
        items: [
          { name: "Performance T-Shirt", price: "₹404", image: "img/home/tshirts.jpg" },
          { name: "Flex-Fit Joggers", price: "₹595", image: "img/home/joggers.jpg" },
        ],
      },
      {
        id: 2,
        name: "Gym Ready",
        description: "Designed for intense gym sessions",
        image: "img/home/tanktops.jpg",
        price: "₹899",
        items: [
          { name: "Essential Gym Tank", price: "₹314", image: "img/home/tanktops.jpg" },
          { name: "Quick-Dry Shorts", price: "₹585", image: "img/home/shorts.jpg" },
        ],
      },
      {
        id: 3,
        name: "Athleisure Comfort",
        description: "Stylish comfort for active lifestyles",
        image: "img/home/cordsets.jpg",
        price: "₹1,299",
        items: [{ name: "Premium Cord Set", price: "₹1,299", image: "img/home/cordsets.jpg" }],
      },
      {
        id: 4,
        name: "Track Day",
        description: "Perfect for running and track workouts",
        image: "img/home/ZHP_5072.jpg",
        price: "₹1,099",
        items: [
          { name: "Performance T-Shirt", price: "₹404", image: "img/home/tshirts.jpg" },
          { name: "Track Pants", price: "₹695", image: "img/home/ZHP_5072.jpg" },
        ],
      },
    ]

    // Add outfits to grid
    outfits.forEach((outfit) => {
      const outfitCard = document.createElement("div")
      outfitCard.className = "outfit-card"
      outfitCard.setAttribute("data-outfit-id", outfit.id)
      outfitCard.innerHTML = `
                <img src="${outfit.image}" alt="${outfit.name}" class="outfit-image">
                <div class="outfit-details">
                    <h4 class="outfit-name">${outfit.name}</h4>
                    <p class="outfit-description">${outfit.description}</p>
                    <p class="outfit-price">${outfit.price}</p>
                    <div class="outfit-actions">
                        <button class="btn btn-sm btn-primary">View Details</button>
                        <button class="btn btn-sm btn-outline-primary">Save</button>
                    </div>
                </div>
            `

      // Add click event to show outfit details
      outfitCard.addEventListener("click", () => {
        showOutfitDetails(outfit)
      })

      outfitsGrid.appendChild(outfitCard)
    })
  }

  // Function to show outfit details in modal
  function showOutfitDetails(outfit) {
    // Assuming bootstrap is available globally or imported elsewhere
    const modal = new bootstrap.Modal(document.getElementById("outfitDetailModal"))

    // Set modal content
    document.getElementById("outfitDetailModalLabel").textContent = outfit.name
    document.getElementById("outfitDetailImage").src = outfit.image
    document.getElementById("outfitDetailName").textContent = outfit.name
    document.getElementById("outfitDetailDescription").textContent = outfit.description
    document.getElementById("outfitDetailPrice").textContent = outfit.price

    // Set outfit items
    const itemsContainer = document.getElementById("outfitDetailItems")
    itemsContainer.innerHTML = ""

    outfit.items.forEach((item) => {
      const itemElement = document.createElement("div")
      itemElement.className = "outfit-item"
      itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="outfit-item-image">
                <div class="outfit-item-details">
                    <h5>${item.name}</h5>
                    <p>${item.price}</p>
                </div>
            `
      itemsContainer.appendChild(itemElement)
    })

    // Show modal
    modal.show()
  }
}

// ===== PERSONALIZED RECOMMENDATIONS FUNCTIONALITY =====

// Initialize the Personalized Recommendations
function initPersonalizedRecommendations() {
  // Load recommended products
  loadRecommendedProducts()

  // Setup event listeners for filters
  setupFilterListeners()
}

// Function to load recommended products
function loadRecommendedProducts() {
  const recommendationsGrid = document.getElementById("recommendationsGrid")

  // Clear current recommendations
  recommendationsGrid.innerHTML = ""

  // Sample product data
  const products = [
    {
      id: 1,
      name: "Performance Panelled T-Shirt",
      price: "₹404",
      image: "img/home/tshirts.jpg",
      match: "98% Match",
      category: "tshirts",
    },
    {
      id: 2,
      name: "Essential Gym Tank Top",
      price: "₹314",
      image: "img/home/tanktops.jpg",
      match: "95% Match",
      category: "tanktops",
    },
    {
      id: 3,
      name: "Flex-Fit Joggers",
      price: "₹599",
      image: "img/home/joggers.jpg",
      match: "92% Match",
      category: "joggers",
    },
    {
      id: 4,
      name: "Quick-Dry Workout Shorts",
      price: "₹449",
      image: "img/home/shorts.jpg",
      match: "90% Match",
      category: "shorts",
    },
    {
      id: 5,
      name: "Premium Track Pants",
      price: "₹695",
      image: "img/home/ZHP_5072.jpg",
      match: "88% Match",
      category: "trackpants",
    },
    {
      id: 6,
      name: "Premium Cord Set",
      price: "₹999",
      image: "img/home/cordsets.jpg",
      match: "85% Match",
      category: "cordsets",
    },
    {
      id: 7,
      name: "Breathable Running Shirt",
      price: "₹449",
      image: "img/home/tshirts.jpg",
      match: "82% Match",
      category: "tshirts",
    },
    {
      id: 8,
      name: "Compression Tank Top",
      price: "₹349",
      image: "img/home/tanktops.jpg",
      match: "80% Match",
      category: "tanktops",
    },
    {
      id: 9,
      name: "Lightweight Training Shorts",
      price: "₹399",
      image: "img/home/shorts.jpg",
      match: "78% Match",
      category: "shorts",
    },
  ]

  // Add products to grid
  products.forEach((product) => {
    const productCard = document.createElement("div")
    productCard.className = "product-card"
    productCard.setAttribute("data-product-id", product.id)
    productCard.setAttribute("data-category", product.category)
    productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-details">
                <h4 class="product-name">${product.name}</h4>
                <p class="product-price">${product.price}</p>
                <span class="product-match">${product.match}</span>
                <div class="product-actions">
                    <button class="btn btn-sm btn-primary">Add to Cart</button>
                    <div class="product-feedback">
                        <button class="feedback-btn like" title="I like this"><i class="fas fa-thumbs-up"></i></button>
                        <button class="feedback-btn dislike" title="Not for me"><i class="fas fa-thumbs-down"></i></button>
                    </div>
                </div>
            </div>
        `

    // Add click event for product
    productCard.querySelector(".product-image").addEventListener("click", () => {
      window.location.href = `product.html?id=${product.id}`
    })

    // Add click events for feedback buttons
    productCard.querySelector(".feedback-btn.like").addEventListener("click", function (e) {
      e.stopPropagation()
      this.classList.toggle("active")
      if (this.classList.contains("active")) {
        this.style.color = "#28a745"
        // In a real app, send feedback to server
        console.log(`User liked product ${product.id}`)
      } else {
        this.style.color = ""
      }
    })

    productCard.querySelector(".feedback-btn.dislike").addEventListener("click", function (e) {
      e.stopPropagation()
      this.classList.toggle("active")
      if (this.classList.contains("active")) {
        this.style.color = "#dc3545"
        // In a real app, send feedback to server
        console.log(`User disliked product ${product.id}`)
      } else {
        this.style.color = ""
      }
    })

    recommendationsGrid.appendChild(productCard)
  })
}

// Function to setup filter listeners
function setupFilterListeners() {
  // Category filters
  const categoryFilters = document.querySelectorAll("#filterTshirts, #filterJoggers, #filterShorts, #filterTankTops")
  categoryFilters.forEach((filter) => {
    filter.addEventListener("change", filterProducts)
  })

  // Recommendation basis filter
  const basisFilter = document.getElementById("recommendationBasis")
  if (basisFilter) {
    basisFilter.addEventListener("change", filterProducts)
  }

  // Sort filter
  const sortFilter = document.getElementById("recommendationSort")
  if (sortFilter) {
    sortFilter.addEventListener("change", sortProducts)
  }
}

// Function to filter products
function filterProducts() {
  // This would normally filter the products based on selected criteria
  // For demo purposes, we'll just show a loading spinner briefly
  const grid = document.getElementById("recommendationsGrid")
  grid.innerHTML = `
        <div class="recommendations-loading">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p>Filtering your recommendations...</p>
        </div>
    `

  // Simulate loading delay
  setTimeout(() => {
    loadRecommendedProducts()
  }, 800)
}

// Function to sort products
function sortProducts() {
  // This would normally sort the products based on selected criteria
  // For demo purposes, we'll just show a loading spinner briefly
  const grid = document.getElementById("recommendationsGrid")
  grid.innerHTML = `
        <div class="recommendations-loading">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p>Sorting your recommendations...</p>
        </div>
    `

  // Simulate loading delay
  setTimeout(() => {
    loadRecommendedProducts()
  }, 800)
}

// ===== PRODUCT PAGE AI INTEGRATION =====

// Initialize AI features on product page
function initProductPageAi() {
  // Load AI recommendations for the product
  loadProductAiRecommendations()
}

// Function to load AI recommendations for product
function loadProductAiRecommendations() {
  const completeOutfitContainer = document.getElementById("completeOutfitContainer")
  const similarProductsContainer = document.getElementById("similarProductsContainer")

  if (!completeOutfitContainer || !similarProductsContainer) return

  // Sample complete outfit data
  const outfitItems = [
    {
      id: 1,
      name: "Performance Joggers",
      price: "₹599",
      image: "img/home/joggers.jpg",
    },
    {
      id: 2,
      name: "Athletic Socks",
      price: "₹199",
      image: "img/home/shorts.jpg",
    },
    {
      id: 3,
      name: "Sports Cap",
      price: "₹299",
      image: "img/home/tshirts.jpg",
    },
  ]

  // Sample similar products data
  const similarProducts = [
    {
      id: 1,
      name: "Premium T-Shirt",
      price: "₹449",
      image: "img/home/tshirts.jpg",
    },
    {
      id: 2,
      name: "Breathable Tank Top",
      price: "₹349",
      image: "img/home/tanktops.jpg",
    },
    {
      id: 3,
      name: "Performance Tee",
      price: "₹399",
      image: "img/home/tshirts.jpg",
    },
    {
      id: 4,
      name: "Lightweight T-Shirt",
      price: "₹379",
      image: "img/home/tshirts.jpg",
    },
  ]

  // Populate complete outfit section
  outfitItems.forEach((item) => {
    const itemElement = document.createElement("div")
    itemElement.className = "outfit-item-card"
    itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="outfit-item-image">
            <div class="outfit-item-details">
                <h5>${item.name}</h5>
                <p>${item.price}</p>
                <button class="btn btn-sm btn-primary">Add</button>
            </div>
        `
    completeOutfitContainer.appendChild(itemElement)
  })

  // Populate similar products section
  similarProducts.forEach((product) => {
    const productElement = document.createElement("div")
    productElement.className = "similar-product-card"
    productElement.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="similar-product-image">
            <div class="similar-product-details">
                <h5>${product.name}</h5>
                <p>${product.price}</p>
                <button class="btn btn-sm btn-primary">View</button>
            </div>
        `
    similarProductsContainer.appendChild(productElement)
  })
}

