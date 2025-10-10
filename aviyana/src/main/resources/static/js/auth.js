// Authentication JavaScript

document.addEventListener("DOMContentLoaded", () => {
  initializeAuthForms()
  initializePasswordStrength()
  initializeSocialLogin()
})

// Initialize authentication forms
function initializeAuthForms() {
  const loginForm = document.getElementById("loginForm")
  const signupForm = document.getElementById("signupForm")
  const forgotPasswordForm = document.getElementById("forgotPasswordForm")

  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin)
  }

  if (signupForm) {
    signupForm.addEventListener("submit", handleSignup)
    initializePasswordValidation()
  }

  if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener("submit", handleForgotPassword)
  }
}

// Handle login form submission
function handleLogin(e) {
  e.preventDefault()

  const formData = new FormData(e.target)
  const loginData = {
    email: formData.get("email"),
    password: formData.get("password"),
    rememberMe: formData.get("rememberMe") === "on",
  }

  // Validate form
  const errors = validateLoginForm(loginData)
  if (errors.length > 0) {
    showFormErrors(errors)
    return
  }

  // Show loading state
  const submitBtn = e.target.querySelector('button[type="submit"]')
  setLoadingState(submitBtn, true)

  // Mock login process
  setTimeout(() => {
    // Check credentials (mock validation)
    if (validateCredentials(loginData.email, loginData.password)) {
      const user = {
        id: Date.now(),
        email: loginData.email,
        name: loginData.email.split("@")[0],
        loginTime: new Date().toISOString(),
        userType: "customer",
      }

      localStorage.setItem("user", JSON.stringify(user))

      if (loginData.rememberMe) {
        localStorage.setItem("rememberUser", "true")
      }

      showNotification("Login successful! Welcome back.", "success")

      // Redirect to dashboard or previous page
      setTimeout(() => {
        const redirectUrl = new URLSearchParams(window.location.search).get("redirect") || "dashboard.html"
        window.location.href = redirectUrl
      }, 1500)
    } else {
      showNotification("Invalid email or password. Please try again.", "error")
      setLoadingState(submitBtn, false)
    }
  }, 1500)
}

// Handle signup form submission
function handleSignup(e) {
  e.preventDefault()

  const formData = new FormData(e.target)
  const signupData = {
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    userType: formData.get("userType"),
    agreeTerms: formData.get("agreeTerms") === "on",
    newsletter: formData.get("newsletter") === "on",
  }

  // Validate form
  const errors = validateSignupForm(signupData)
  if (errors.length > 0) {
    showFormErrors(errors)
    return
  }

  // Show loading state
  const submitBtn = e.target.querySelector('button[type="submit"]')
  setLoadingState(submitBtn, true)

  // Mock signup process
  setTimeout(() => {
    // Check if email already exists
    if (emailExists(signupData.email)) {
      showNotification("Email already exists. Please use a different email.", "error")
      setLoadingState(submitBtn, false)
      return
    }

    const user = {
      id: Date.now(),
      firstName: signupData.firstName,
      lastName: signupData.lastName,
      email: signupData.email,
      phone: signupData.phone,
      userType: signupData.userType,
      newsletter: signupData.newsletter,
      joinDate: new Date().toISOString(),
      verified: false,
    }

    // Store user data
    localStorage.setItem("user", JSON.stringify(user))

    // Store in users list for future login validation
    const users = JSON.parse(localStorage.getItem("users")) || []
    users.push({
      email: signupData.email,
      password: signupData.password, // In real app, this would be hashed
      userData: user,
    })
    localStorage.setItem("users", JSON.stringify(users))

    showNotification("Account created successfully! Welcome to Aviyana Divine.", "success")

    // Redirect to dashboard
    setTimeout(() => {
      window.location.href = "dashboard.html"
    }, 2000)
  }, 2000)
}

// Handle forgot password form submission
function handleForgotPassword(e) {
  e.preventDefault()

  const formData = new FormData(e.target)
  const email = formData.get("email")

  if (!isValidEmail(email)) {
    showNotification("Please enter a valid email address.", "error")
    return
  }

  // Show loading state
  const submitBtn = e.target.querySelector('button[type="submit"]')
  setLoadingState(submitBtn, true)

  // Mock password reset process
  setTimeout(() => {
    showNotification("Password reset link sent to your email!", "success")
    setLoadingState(submitBtn, false)

    // Clear form
    e.target.reset()
  }, 1500)
}

// Form validation functions
function validateLoginForm(data) {
  const errors = []

  if (!data.email || !isValidEmail(data.email)) {
    errors.push("Please enter a valid email address")
  }

  if (!data.password || data.password.length < 6) {
    errors.push("Password must be at least 6 characters long")
  }

  return errors
}

function validateSignupForm(data) {
  const errors = []

  if (!data.firstName || data.firstName.trim().length < 2) {
    errors.push("First name must be at least 2 characters long")
  }

  if (!data.lastName || data.lastName.trim().length < 2) {
    errors.push("Last name must be at least 2 characters long")
  }

  if (!data.email || !isValidEmail(data.email)) {
    errors.push("Please enter a valid email address")
  }

  if (!data.phone || !isValidPhone(data.phone)) {
    errors.push("Please enter a valid phone number")
  }

  if (!data.password || data.password.length < 8) {
    errors.push("Password must be at least 8 characters long")
  }

  if (data.password !== data.confirmPassword) {
    errors.push("Passwords do not match")
  }

//  if (!data.userType) {
//    errors.push("Please select your role")
//  }

  if (!data.agreeTerms) {
    errors.push("You must agree to the Terms & Conditions")
  }

  return errors
}

// Validation helper functions
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function isValidPhone(phone) {
  const phoneRegex = /^[+]?[1-9][\d]{0,15}$/
  return phoneRegex.test(phone.replace(/\s/g, ""))
}

function validateCredentials(email, password) {
  const users = JSON.parse(localStorage.getItem("users")) || []
  return users.some((user) => user.email === email && user.password === password)
}

function emailExists(email) {
  const users = JSON.parse(localStorage.getItem("users")) || []
  return users.some((user) => user.email === email)
}

// Password strength indicator
function initializePasswordStrength() {
  const passwordInput = document.getElementById("password")
  const strengthIndicator = document.getElementById("passwordStrength")

  if (passwordInput && strengthIndicator) {
    passwordInput.addEventListener("input", function () {
      const strength = calculatePasswordStrength(this.value)
      updatePasswordStrength(strengthIndicator, strength)
    })
  }
}

function calculatePasswordStrength(password) {
  let score = 0

  if (password.length >= 8) score++
  if (/[a-z]/.test(password)) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  if (score < 3) return "weak"
  if (score < 5) return "medium"
  return "strong"
}

function updatePasswordStrength(indicator, strength) {
  indicator.className = `password-strength ${strength}`
}

// Password validation for signup
function initializePasswordValidation() {
  const passwordInput = document.getElementById("password")
  const confirmPasswordInput = document.getElementById("confirmPassword")

  if (confirmPasswordInput) {
    confirmPasswordInput.addEventListener("input", function () {
      const password = passwordInput.value
      const confirmPassword = this.value

      if (confirmPassword && password !== confirmPassword) {
        this.setCustomValidity("Passwords do not match")
      } else {
        this.setCustomValidity("")
      }
    })
  }
}

// Social login functionality
function initializeSocialLogin() {
  const googleBtn = document.querySelector(".btn-social.google")
  const facebookBtn = document.querySelector(".btn-social.facebook")

  if (googleBtn) {
    googleBtn.addEventListener("click", () => handleSocialLogin("google"))
  }

  if (facebookBtn) {
    facebookBtn.addEventListener("click", () => handleSocialLogin("facebook"))
  }
}

function handleSocialLogin(provider) {
  showNotification(
    `${provider.charAt(0).toUpperCase() + provider.slice(1)} login will be implemented with backend integration.`,
    "info",
  )
}

// Utility functions
function togglePassword(inputId) {
  const input = document.getElementById(inputId)
  const toggle = input.nextElementSibling
  const icon = toggle.querySelector("i")

  if (input.type === "password") {
    input.type = "text"
    icon.classList.remove("fa-eye")
    icon.classList.add("fa-eye-slash")
  } else {
    input.type = "password"
    icon.classList.remove("fa-eye-slash")
    icon.classList.add("fa-eye")
  }
}

function setLoadingState(button, loading) {
  if (loading) {
    button.classList.add("loading")
    button.disabled = true
  } else {
    button.classList.remove("loading")
    button.disabled = false
  }
}

function showFormErrors(errors) {
  const errorMessage = errors.join("\n")
  showNotification(errorMessage, "error")
}

function showNotification(message, type = "info") {
  const notification = document.createElement("div")
  notification.className = `notification ${type}`
  notification.textContent = message

  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === "success" ? "#28a745" : type === "error" ? "#dc3545" : "#17a2b8"};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 10000;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideIn 0.3s ease;
    `

  document.body.appendChild(notification)

  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease"
    setTimeout(() => notification.remove(), 300)
  }, 4000)
}

// Add CSS animations for notifications
const notificationStyle = document.createElement("style")
notificationStyle.textContent = `
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

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`
document.head.appendChild(notificationStyle)


// Auto-fill remembered user
document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("rememberUser") === "true") {
    const user = JSON.parse(localStorage.getItem("user"))
    if (user && document.getElementById("email")) {
      document.getElementById("email").value = user.email
    }
  }
})
