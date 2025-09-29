// Contact Page JavaScript

document.addEventListener("DOMContentLoaded", () => {
  // Initialize all contact page functionality
  initContactForm()
  initFAQAccordion()
  initFormValidation()
  initMapInteraction()
  initSocialLinks()
  initScrollAnimations()
})

// Contact form handling
function initContactForm() {
  const contactForm = document.getElementById("contactForm")
  const submitBtn = contactForm.querySelector(".submit-btn")

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    // Show loading state
    showLoadingState(submitBtn)

    // Simulate form submission
    try {
      await simulateFormSubmission()
      showSuccessMessage()
      resetForm()
    } catch (error) {
      showErrorMessage()
    } finally {
      hideLoadingState(submitBtn)
    }
  })
}

// Form validation
function initFormValidation() {
  const form = document.getElementById("contactForm")
  const inputs = form.querySelectorAll("input, select, textarea")

  inputs.forEach((input) => {
    input.addEventListener("blur", () => validateField(input))
    input.addEventListener("input", () => clearFieldError(input))
  })
}

function validateForm() {
  const form = document.getElementById("contactForm")
  const requiredFields = form.querySelectorAll("[required]")
  let isValid = true

  requiredFields.forEach((field) => {
    if (!validateField(field)) {
      isValid = false
    }
  })

  // Validate email format
  const emailField = form.querySelector("#email")
  if (emailField.value && !isValidEmail(emailField.value)) {
    showFieldError(emailField, "Please enter a valid email address")
    isValid = false
  }

  // Validate phone format
  const phoneField = form.querySelector("#phone")
  if (phoneField.value && !isValidPhone(phoneField.value)) {
    showFieldError(phoneField, "Please enter a valid phone number")
    isValid = false
  }

  // Check privacy policy agreement
  const privacyCheckbox = form.querySelector("#privacy")
  if (!privacyCheckbox.checked) {
    showFieldError(privacyCheckbox, "Please agree to the Privacy Policy and Terms of Service")
    isValid = false
  }

  return isValid
}

function validateField(field) {
  const value = field.value.trim()

  if (field.hasAttribute("required") && !value) {
    showFieldError(field, "This field is required")
    return false
  }

  if (field.type === "email" && value && !isValidEmail(value)) {
    showFieldError(field, "Please enter a valid email address")
    return false
  }

  if (field.type === "tel" && value && !isValidPhone(value)) {
    showFieldError(field, "Please enter a valid phone number")
    return false
  }

  clearFieldError(field)
  return true
}

function showFieldError(field, message) {
  clearFieldError(field)

  field.classList.add("error")
  const errorDiv = document.createElement("div")
  errorDiv.className = "field-error"
  errorDiv.textContent = message

  field.parentNode.appendChild(errorDiv)
}

function clearFieldError(field) {
  field.classList.remove("error")
  const existingError = field.parentNode.querySelector(".field-error")
  if (existingError) {
    existingError.remove()
  }
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function isValidPhone(phone) {
  const phoneRegex = /^[+]?[1-9][\d]{0,15}$/
  return phoneRegex.test(phone.replace(/[\s\-$$$$]/g, ""))
}

// FAQ Accordion
function initFAQAccordion() {
  const faqItems = document.querySelectorAll(".faq-item")

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question")

    question.addEventListener("click", () => {
      const isActive = item.classList.contains("active")

      // Close all other FAQ items
      faqItems.forEach((otherItem) => {
        if (otherItem !== item) {
          otherItem.classList.remove("active")
        }
      })

      // Toggle current item
      item.classList.toggle("active", !isActive)
    })
  })
}

// Map interaction
function initMapInteraction() {
  const mapPlaceholder = document.querySelector(".map-placeholder")
  const directionsBtn = document.querySelector(".directions-btn")

  if (mapPlaceholder) {
    mapPlaceholder.addEventListener("click", () => {
      // Simulate map loading
      mapPlaceholder.innerHTML = `
                <div class="map-loading">
                    <i class="fas fa-spinner fa-spin"></i>
                    <p>Loading interactive map...</p>
                </div>
            `

      setTimeout(() => {
        mapPlaceholder.innerHTML = `
                    <div class="map-loaded">
                        <i class="fas fa-map-marked-alt"></i>
                        <p>Interactive Map Loaded</p>
                        <span>123 Spiritual Street, Divine City, India</span>
                        <a href="#" class="directions-btn">Get Directions</a>
                    </div>
                `
      }, 2000)
    })
  }

  if (directionsBtn) {
    directionsBtn.addEventListener("click", (e) => {
      e.preventDefault()
      // Simulate opening directions
      showNotification("Opening directions in your default map application...")
    })
  }
}

// Social links interaction
function initSocialLinks() {
  const socialLinks = document.querySelectorAll(".social-link")

  socialLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault()

      // Add click animation
      link.style.transform = "scale(0.95)"
      setTimeout(() => {
        link.style.transform = ""
      }, 150)

      // Simulate social media redirect
      const platform = link.classList[1] // facebook, instagram, etc.
      showNotification(`Opening ${platform} page...`)
    })
  })
}

// Form submission simulation
async function simulateFormSubmission() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate 90% success rate
      if (Math.random() > 0.1) {
        resolve()
      } else {
        reject(new Error("Submission failed"))
      }
    }, 2000)
  })
}

// Loading states
function showLoadingState(button) {
  button.disabled = true
  button.innerHTML = `
        <i class="fas fa-spinner fa-spin"></i>
        Sending Message...
    `
}

function hideLoadingState(button) {
  button.disabled = false
  button.innerHTML = `
        <i class="fas fa-paper-plane"></i>
        Send Message
    `
}

// Success and error messages
function showSuccessMessage() {
  showNotification(
    "Thank you! Your message has been sent successfully. We'll get back to you within 24 hours.",
    "success",
  )
}

function showErrorMessage() {
  showNotification("Sorry, there was an error sending your message. Please try again or contact us directly.", "error")
}

function showNotification(message, type = "info") {
  const notification = document.createElement("div")
  notification.className = `notification ${type}`
  notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `

  document.body.appendChild(notification)

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove()
    }
  }, 5000)
}

function getNotificationIcon(type) {
  switch (type) {
    case "success":
      return "fa-check-circle"
    case "error":
      return "fa-exclamation-circle"
    case "warning":
      return "fa-exclamation-triangle"
    default:
      return "fa-info-circle"
  }
}

// Reset form
function resetForm() {
  const form = document.getElementById("contactForm")
  form.reset()

  // Clear any remaining errors
  const errorElements = form.querySelectorAll(".field-error")
  errorElements.forEach((error) => error.remove())

  const errorFields = form.querySelectorAll(".error")
  errorFields.forEach((field) => field.classList.remove("error"))
}

// Scroll animations
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-in")
      }
    })
  }, observerOptions)

  // Observe sections and cards
  const elements = document.querySelectorAll(".info-card, .form-container, .sidebar-card, .faq-item")
  elements.forEach((element, index) => {
    element.style.animationDelay = `${index * 0.1}s`
    observer.observe(element)
  })
}

// Add CSS for animations and styles
const style = document.createElement("style")
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .animate-in {
        animation: fadeInUp 0.6s ease-out forwards;
    }

    .info-card,
    .form-container,
    .sidebar-card,
    .faq-item {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease-out;
    }

    .field-error {
        color: #e74c3c;
        font-size: 0.875rem;
        margin-top: 0.25rem;
        display: flex;
        align-items: center;
        gap: 0.25rem;
    }

    .field-error::before {
        content: '⚠';
        font-size: 0.75rem;
    }

    .form-group input.error,
    .form-group select.error,
    .form-group textarea.error {
        border-color: #e74c3c;
        box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
    }

    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1000;
        max-width: 400px;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        animation: slideInRight 0.3s ease-out;
    }

    .notification.success {
        background: #2ecc71;
        color: white;
    }

    .notification.error {
        background: #e74c3c;
        color: white;
    }

    .notification.info {
        background: #3498db;
        color: white;
    }

    .notification-content {
        padding: 1rem 1.5rem;
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }

    .notification-close {
        background: none;
        border: none;
        color: inherit;
        cursor: pointer;
        margin-left: auto;
        padding: 0.25rem;
        border-radius: 4px;
        transition: background 0.2s ease;
    }

    .notification-close:hover {
        background: rgba(255,255,255,0.2);
    }

    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    .map-loading,
    .map-loaded {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        text-align: center;
    }

    .map-loading i {
        font-size: 3rem;
        color: #667eea;
        margin-bottom: 1rem;
    }

    .map-loaded i {
        font-size: 4rem;
        color: #667eea;
        margin-bottom: 1rem;
    }
`
document.head.appendChild(style)

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

// Auto-resize textarea
const textarea = document.querySelector("#message")
if (textarea) {
  textarea.addEventListener("input", function () {
    this.style.height = "auto"
    this.style.height = this.scrollHeight + "px"
  })
}
