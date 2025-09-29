// Global Utilities and Common JavaScript Functions

// Global state management
window.AviyanaDivine = {
  cart: JSON.parse(localStorage.getItem("cart")) || [],
  user: JSON.parse(localStorage.getItem("user")) || null,
  wishlist: JSON.parse(localStorage.getItem("wishlist")) || [],
  settings: JSON.parse(localStorage.getItem("settings")) || {
    theme: "light",
    notifications: true,
    language: "en",
  },
}

// Initialize global functionality
document.addEventListener("DOMContentLoaded", () => {
  initGlobalFeatures()
  initResponsiveNavigation()
  initScrollEffects()
  initLazyLoading()
  initAccessibility()
  updateCartCount()
  initThemeToggle()
})

// Global feature initialization
function initGlobalFeatures() {
  // Initialize tooltips
  initTooltips()

  // Initialize modals
  initModals()

  // Initialize notifications
  initNotificationSystem()

  // Initialize search functionality
  initGlobalSearch()

  // Initialize cart functionality
  initCartFunctionality()

  // Initialize wishlist functionality
  initWishlistFunctionality()
}

// Responsive navigation
function initResponsiveNavigation() {
  const mobileMenuToggle = document.getElementById("mobileMenuToggle")
  const navMenu = document.getElementById("navMenu")
  const body = document.body

  if (mobileMenuToggle && navMenu) {
    mobileMenuToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.contains("active")

      if (isOpen) {
        navMenu.classList.remove("active")
        mobileMenuToggle.classList.remove("active")
        body.classList.remove("nav-open")
      } else {
        navMenu.classList.add("active")
        mobileMenuToggle.classList.add("active")
        body.classList.add("nav-open")
      }
    })

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!navMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
        navMenu.classList.remove("active")
        mobileMenuToggle.classList.remove("active")
        body.classList.remove("nav-open")
      }
    })

    // Close menu on window resize
    window.addEventListener("resize", () => {
      if (window.innerWidth > 768) {
        navMenu.classList.remove("active")
        mobileMenuToggle.classList.remove("active")
        body.classList.remove("nav-open")
      }
    })
  }
}

// Scroll effects
function initScrollEffects() {
  let lastScrollTop = 0
  const header = document.querySelector(".header")
  const scrollToTopBtn = createScrollToTopButton()

  window.addEventListener(
    "scroll",
    debounce(() => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop

      // Header hide/show on scroll
      if (header) {
        if (scrollTop > lastScrollTop && scrollTop > 100) {
          header.classList.add("header-hidden")
        } else {
          header.classList.remove("header-hidden")
        }
      }

      // Show/hide scroll to top button
      if (scrollTop > 300) {
        scrollToTopBtn.classList.add("visible")
      } else {
        scrollToTopBtn.classList.remove("visible")
      }

      // Update scroll progress
      updateScrollProgress()

      lastScrollTop = scrollTop
    }, 10),
  )
}

// Create scroll to top button
function createScrollToTopButton() {
  const button = document.createElement("button")
  button.className = "scroll-to-top"
  button.innerHTML = '<i class="fas fa-arrow-up"></i>'
  button.setAttribute("aria-label", "Scroll to top")

  button.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  })

  document.body.appendChild(button)
  return button
}

// Update scroll progress
function updateScrollProgress() {
  const scrollProgress = document.querySelector(".scroll-progress")
  if (scrollProgress) {
    const scrollTop = window.pageYOffset
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    const scrollPercent = (scrollTop / docHeight) * 100
    scrollProgress.style.width = scrollPercent + "%"
  }
}

// Lazy loading for images
function initLazyLoading() {
  const images = document.querySelectorAll("img[data-src]")

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target
        img.src = img.dataset.src
        img.classList.remove("lazy")
        img.classList.add("loaded")
        observer.unobserve(img)
      }
    })
  })

  images.forEach((img) => {
    imageObserver.observe(img)
  })
}

// Accessibility enhancements
function initAccessibility() {
  // Skip to main content link
  const skipLink = document.createElement("a")
  skipLink.href = "#main-content"
  skipLink.className = "skip-link"
  skipLink.textContent = "Skip to main content"
  document.body.insertBefore(skipLink, document.body.firstChild)

  // Keyboard navigation for dropdowns
  const dropdowns = document.querySelectorAll(".dropdown")
  dropdowns.forEach((dropdown) => {
    const trigger = dropdown.querySelector(".dropdown-trigger")
    const menu = dropdown.querySelector(".dropdown-menu")

    if (trigger && menu) {
      trigger.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          menu.classList.toggle("active")
        }
      })
    }
  })

  // Focus management for modals
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeAllModals()
    }
  })
}

// Tooltip system
function initTooltips() {
  const tooltipTriggers = document.querySelectorAll("[data-tooltip]")

  tooltipTriggers.forEach((trigger) => {
    const tooltip = createTooltip(trigger.dataset.tooltip)

    trigger.addEventListener("mouseenter", () => {
      showTooltip(tooltip, trigger)
    })

    trigger.addEventListener("mouseleave", () => {
      hideTooltip(tooltip)
    })
  })
}

function createTooltip(text) {
  const tooltip = document.createElement("div")
  tooltip.className = "tooltip"
  tooltip.textContent = text
  document.body.appendChild(tooltip)
  return tooltip
}

function showTooltip(tooltip, trigger) {
  const rect = trigger.getBoundingClientRect()
  tooltip.style.left = rect.left + rect.width / 2 + "px"
  tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + "px"
  tooltip.classList.add("visible")
}

function hideTooltip(tooltip) {
  tooltip.classList.remove("visible")
}

// Modal system
function initModals() {
  const modalTriggers = document.querySelectorAll("[data-modal]")
  const modals = document.querySelectorAll(".modal")

  modalTriggers.forEach((trigger) => {
    trigger.addEventListener("click", (e) => {
      e.preventDefault()
      const modalId = trigger.dataset.modal
      const modal = document.getElementById(modalId)
      if (modal) {
        openModal(modal)
      }
    })
  })

  modals.forEach((modal) => {
    const closeBtn = modal.querySelector(".modal-close")
    const overlay = modal.querySelector(".modal-overlay")

    if (closeBtn) {
      closeBtn.addEventListener("click", () => closeModal(modal))
    }

    if (overlay) {
      overlay.addEventListener("click", () => closeModal(modal))
    }
  })
}

function openModal(modal) {
  modal.classList.add("active")
  document.body.classList.add("modal-open")

  // Focus management
  const focusableElements = modal.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
  )
  if (focusableElements.length > 0) {
    focusableElements[0].focus()
  }
}

function closeModal(modal) {
  modal.classList.remove("active")
  document.body.classList.remove("modal-open")
}

function closeAllModals() {
  const activeModals = document.querySelectorAll(".modal.active")
  activeModals.forEach((modal) => closeModal(modal))
}

// Notification system
function initNotificationSystem() {
  const notificationContainer = document.createElement("div")
  notificationContainer.className = "notification-container"
  document.body.appendChild(notificationContainer)
}

function showNotification(message, type = "info", duration = 5000) {
  const notification = document.createElement("div")
  notification.className = `notification notification-${type}`

  notification.innerHTML = `
    <div class="notification-content">
      <i class="fas ${getNotificationIcon(type)}"></i>
      <span>${message}</span>
      <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
        <i class="fas fa-times"></i>
      </button>
    </div>
  `

  const container = document.querySelector(".notification-container")
  container.appendChild(notification)

  // Auto remove
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove()
    }
  }, duration)

  return notification
}

function getNotificationIcon(type) {
  const icons = {
    success: "fa-check-circle",
    error: "fa-exclamation-circle",
    warning: "fa-exclamation-triangle",
    info: "fa-info-circle",
  }
  return icons[type] || icons.info
}

// Global search functionality
function initGlobalSearch() {
  const searchInputs = document.querySelectorAll(".search-box input")

  searchInputs.forEach((input) => {
    let searchTimeout

    input.addEventListener("input", (e) => {
      clearTimeout(searchTimeout)
      searchTimeout = setTimeout(() => {
        performSearch(e.target.value)
      }, 300)
    })
  })
}

function performSearch(query) {
  if (query.length < 2) return

  // Simulate search results
  console.log(`Searching for: ${query}`)

  // In a real application, this would make an API call
  // For now, we'll just show a notification
  showNotification(`Searching for "${query}"...`, "info", 2000)
}

// Cart functionality
function initCartFunctionality() {
  // Add to cart buttons
  const addToCartButtons = document.querySelectorAll(".add-to-cart")

  addToCartButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault()
      const productId = button.dataset.productId
      const productName = button.dataset.productName
      const productPrice = Number.parseFloat(button.dataset.productPrice)
      const productImage = button.dataset.productImage

      addToCart({
        id: productId,
        name: productName,
        price: productPrice,
        image: productImage,
        quantity: 1,
      })
    })
  })
}

function addToCart(product) {
  const existingItem = window.AviyanaDivine.cart.find((item) => item.id === product.id)

  if (existingItem) {
    existingItem.quantity += 1
  } else {
    window.AviyanaDivine.cart.push(product)
  }

  saveCart()
  updateCartCount()
  showNotification(`${product.name} added to cart!`, "success")
}

function removeFromCart(productId) {
  window.AviyanaDivine.cart = window.AviyanaDivine.cart.filter((item) => item.id !== productId)
  saveCart()
  updateCartCount()
}

function updateCartQuantity(productId, quantity) {
  const item = window.AviyanaDivine.cart.find((item) => item.id === productId)
  if (item) {
    item.quantity = Math.max(0, quantity)
    if (item.quantity === 0) {
      removeFromCart(productId)
    } else {
      saveCart()
      updateCartCount()
    }
  }
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(window.AviyanaDivine.cart))
}

function updateCartCount() {
  const cartCountElements = document.querySelectorAll(".cart-count")
  const totalItems = window.AviyanaDivine.cart.reduce((sum, item) => sum + item.quantity, 0)

  cartCountElements.forEach((element) => {
    element.textContent = totalItems
    element.style.display = totalItems > 0 ? "block" : "none"
  })
}

// Wishlist functionality
function initWishlistFunctionality() {
  const wishlistButtons = document.querySelectorAll(".add-to-wishlist")

  wishlistButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault()
      const productId = button.dataset.productId
      toggleWishlist(productId, button)
    })
  })
}

function toggleWishlist(productId, button) {
  const isInWishlist = window.AviyanaDivine.wishlist.includes(productId)

  if (isInWishlist) {
    window.AviyanaDivine.wishlist = window.AviyanaDivine.wishlist.filter((id) => id !== productId)
    button.classList.remove("active")
    showNotification("Removed from wishlist", "info")
  } else {
    window.AviyanaDivine.wishlist.push(productId)
    button.classList.add("active")
    showNotification("Added to wishlist!", "success")
  }

  localStorage.setItem("wishlist", JSON.stringify(window.AviyanaDivine.wishlist))
}

// Theme toggle
function initThemeToggle() {
  const themeToggle = document.querySelector(".theme-toggle")

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const currentTheme = window.AviyanaDivine.settings.theme
      const newTheme = currentTheme === "light" ? "dark" : "light"

      setTheme(newTheme)
    })
  }

  // Apply saved theme
  setTheme(window.AviyanaDivine.settings.theme)
}

function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme)
  window.AviyanaDivine.settings.theme = theme
  localStorage.setItem("settings", JSON.stringify(window.AviyanaDivine.settings))
}

// Utility functions
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

function throttle(func, limit) {
  let inThrottle
  return function () {
    const args = arguments

    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

function formatCurrency(amount, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency,
  }).format(amount)
}

function formatDate(date, options = {}) {
  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...options,
  }).format(new Date(date))
}

// Form validation utilities
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function validatePhone(phone) {
  const phoneRegex = /^[+]?[1-9][\d]{0,15}$/
  return phoneRegex.test(phone.replace(/[\s\-()]/g, ""))
}

function validateRequired(value) {
  return value && value.trim().length > 0
}

// Image optimization
function optimizeImage(img, maxWidth = 800, quality = 0.8) {
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")

  const ratio = Math.min(maxWidth / img.width, maxWidth / img.height)
  canvas.width = img.width * ratio
  canvas.height = img.height * ratio

  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

  return canvas.toDataURL("image/jpeg", quality)
}

// Performance monitoring
function measurePerformance(name, fn) {
  const start = performance.now()
  const result = fn()
  const end = performance.now()
  console.log(`${name} took ${end - start} milliseconds`)
  return result
}

// Error handling
window.addEventListener("error", (e) => {
  console.error("Global error:", e.error)
  showNotification("An error occurred. Please try again.", "error")
})

window.addEventListener("unhandledrejection", (e) => {
  console.error("Unhandled promise rejection:", e.reason)
  showNotification("An error occurred. Please try again.", "error")
})

// Export global functions for use in other scripts
window.AviyanaDivine.utils = {
  showNotification,
  addToCart,
  removeFromCart,
  updateCartQuantity,
  toggleWishlist,
  formatCurrency,
  formatDate,
  validateEmail,
  validatePhone,
  validateRequired,
  debounce,
  throttle,
  optimizeImage,
  measurePerformance,
}
