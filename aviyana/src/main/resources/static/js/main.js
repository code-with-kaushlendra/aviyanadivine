// Main JavaScript functionality for Aviyana Divine

// Global variable for user
let user = JSON.parse(localStorage.getItem("user")) || null

// DOM Content Loaded
document.addEventListener("DOMContentLoaded", () => {
  updateAuthButtons()
  initializeEventListeners()
})

// Initialize event listeners
function initializeEventListeners() {
  // Mobile menu toggle
  const mobileToggle = document.querySelector(".mobile-menu-toggle")
  const navMenu = document.querySelector(".nav-menu")

  if (mobileToggle) {
    mobileToggle.addEventListener("click", () => {
      navMenu.style.display = navMenu.style.display === "block" ? "none" : "block"
    })
  }

  // Buy Now buttons
  const buyNowButtons = document.querySelectorAll(".btn-add-cart")
  buyNowButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault()
      const productCard = this.closest(".product-card")
      const product = {
        name: productCard.querySelector("h3").textContent,
        price: productCard.querySelector(".price").textContent,
        image: productCard.querySelector("img").src
      }

      // If user is not logged in, redirect to login
      if (!user) {
        window.location.href = "login.html"
        return
      }

      // Redirect to checkout page with product info (could use sessionStorage or URL params)
      sessionStorage.setItem("selectedProduct", JSON.stringify(product))
      window.location.href = "checkout.html"
    })
  })

  // Search functionality
  const searchButton = document.querySelector(".search-box button")
  const searchInput = document.querySelector(".search-box input")

  if (searchButton) {
    searchButton.addEventListener("click", performSearch)
  }

  if (searchInput) {
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        performSearch()
      }
    })
  }
}

// Authentication functions
function updateAuthButtons() {
  const authButtons = document.querySelector(".auth-buttons")
  if (authButtons && user) {
    authButtons.innerHTML = `

      <button onclick="logout()" class="btn-signup">Logout</button>
    `
  }
}

function logout() {
  localStorage.removeItem("user")
  user = null
  location.reload()
}

// Search functionality
function performSearch() {
  const searchInput = document.querySelector(".search-box input")
  const query = searchInput.value.trim()

  if (query) {
    window.location.href = `products.html?search=${encodeURIComponent(query)}`
  }
}

// Notification system
function showNotification(message, type = "success") {
  const notification = document.createElement("div")
  notification.className = `notification ${type}`
  notification.textContent = message

  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === "success" ? "#4CAF50" : "#f44336"};
    color: white;
    padding: 15px 20px;
    border-radius: 5px;
    z-index: 10000;
    animation: slideIn 0.3s ease;
  `

  document.body.appendChild(notification)

  setTimeout(() => {
    notification.remove()
  }, 3000)
}

// Form validation helper
function validateForm(formData) {
  const errors = []

  if (!formData.email || !isValidEmail(formData.email)) {
    errors.push("Please enter a valid email address")
  }

  if (!formData.password || formData.password.length < 6) {
    errors.push("Password must be at least 6 characters long")
  }

  return errors
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  })
})

// Lazy loading for images
function lazyLoadImages() {
  const images = document.querySelectorAll("img[data-src]")
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target
        img.src = img.dataset.src
        img.removeAttribute("data-src")
        imageObserver.unobserve(img)
      }
    })
  })

  images.forEach((img) => imageObserver.observe(img))
}

// Initialize lazy loading if supported
if ("IntersectionObserver" in window) {
  lazyLoadImages()
}

// Add CSS animation keyframes
const style = document.createElement("style")
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`
document.head.appendChild(style)
