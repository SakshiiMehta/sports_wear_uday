document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.querySelector(".navbar")
  navbar.style.opacity = "0"
  navbar.style.transform = "translateY(-20px)"

  setTimeout(() => {
    navbar.style.opacity = "1"
    navbar.style.transform = "translateY(0)"
    navbar.style.transition = "opacity 0.6s ease, transform 0.6s ease"
  }, 200)
})
document.getElementById("clearFilters").addEventListener("click", () => {
  // Uncheck all checkboxes
  document.querySelectorAll(".filter-checkbox, .filter-type").forEach((checkbox) => {
    checkbox.checked = false
  })

  // Reset selected sizes
  document.querySelectorAll(".size-option").forEach((size) => {
    size.classList.remove("active")
  })

  // Reset selected colors
  document.querySelectorAll(".color-option").forEach((color) => {
    color.classList.remove("active")
  })

  // Reset price range
  document.getElementById("priceRange").value = 2000
  document.getElementById("priceValue").textContent = 2000

  // Show all products again
  document.querySelectorAll(".product-item").forEach((item) => {
    item.style.display = "block"
  })
})
document.addEventListener("DOMContentLoaded", () => {
  // Handle Size Selection
  document.querySelectorAll(".size-options").forEach((sizeContainer) => {
    sizeContainer.addEventListener("click", (e) => {
      if (e.target.classList.contains("size-option")) {
        sizeContainer.querySelectorAll(".size-option").forEach((s) => s.classList.remove("active"))
        e.target.classList.add("active")
      }
    })
  })

  // Handle Color Selection
  document.querySelectorAll(".color-options").forEach((colorContainer) => {
    colorContainer.addEventListener("click", (e) => {
      if (e.target.classList.contains("color-option")) {
        colorContainer.querySelectorAll(".color-option").forEach((c) => c.classList.remove("active"))
        e.target.classList.add("active")
      }
    })
  })
})

