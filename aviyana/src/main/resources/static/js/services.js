// Services page specific JavaScript

document.addEventListener("DOMContentLoaded", () => {
  initializeServicesPage()
})

function initializeServicesPage() {
  initializeCategoryCards()
  initializeServiceBooking()
  initializeServiceFilters()
  handleURLParams()
}

// Category cards functionality
function initializeCategoryCards() {
  const categoryCards = document.querySelectorAll(".category-card")

  categoryCards.forEach((card) => {
    card.addEventListener("click", function () {
      const category = this.dataset.category
      filterServicesByCategory(category)
    })
  })
}

function filterServicesByCategory(category) {
  const serviceCards = document.querySelectorAll(".service-card")

  serviceCards.forEach((card) => {
    if (card.dataset.category === category) {
      card.style.display = "block"
      card.scrollIntoView({ behavior: "smooth", block: "center" })
    } else {
      card.style.opacity = "0.3"
    }
  })

  // Reset opacity after 2 seconds
  setTimeout(() => {
    serviceCards.forEach((card) => {
      card.style.opacity = "1"
    })
  }, 2000)
}

// Service booking functionality
function initializeServiceBooking() {
  const bookButtons = document.querySelectorAll(".btn-book-service")

  bookButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const serviceCard = this.closest(".service-card")
      const serviceName = serviceCard.querySelector("h3").textContent
      const serviceProvider = serviceCard.querySelector(".service-provider").textContent
      const servicePrice = serviceCard.querySelector(".current-price").textContent

      bookService({
        name: serviceName,
        provider: serviceProvider,
        price: servicePrice,
      })
    })
  })
}

function bookService(serviceData) {
  // Check if user is logged in
  const user = JSON.parse(localStorage.getItem("user"))

  if (!user) {
    showNotification("Please login to book services", "error")
    setTimeout(() => {
      window.location.href = "login.html"
    }, 2000)
    return
  }

  // Mock booking process
  showNotification("Processing your booking...", "info")

  setTimeout(() => {
    // Add to user's bookings
    const bookings = JSON.parse(localStorage.getItem("bookings")) || []
    const booking = {
      id: Date.now(),
      ...serviceData,
      date: new Date().toISOString(),
      status: "confirmed",
    }

    bookings.push(booking)
    localStorage.setItem("bookings", JSON.stringify(bookings))

    showNotification(`Service "${serviceData.name}" booked successfully!`, "success")

    // Redirect to dashboard after 2 seconds
    setTimeout(() => {
      window.location.href = "checkout.html"
    }, 2000)
  }, 1500)
}

// Service filters functionality
function initializeServiceFilters() {
  // Add filter functionality if needed
  const searchInput = document.querySelector(".search-box input")

  if (searchInput) {
    searchInput.addEventListener("input", function () {
      const query = this.value.toLowerCase()
      filterServices(query)
    })
  }
}

function filterServices(query) {
  const serviceCards = document.querySelectorAll(".service-card")

  serviceCards.forEach((card) => {
    const serviceName = card.querySelector("h3").textContent.toLowerCase()
    const serviceDescription = card.querySelector(".service-description").textContent.toLowerCase()
    const serviceProvider = card.querySelector(".service-provider").textContent.toLowerCase()

    if (serviceName.includes(query) || serviceDescription.includes(query) || serviceProvider.includes(query)) {
      card.style.display = "block"
      card.style.animation = "fadeIn 0.5s ease"
    } else {
      card.style.display = "none"
    }
  })
}

// Handle URL parameters
function handleURLParams() {
  const urlParams = new URLSearchParams(window.location.search)
  const category = urlParams.get("category")

  if (category) {
    setTimeout(() => {
      filterServicesByCategory(category)
    }, 500)
  }
}

// Service rating functionality
function initializeServiceRating() {
  const serviceCards = document.querySelectorAll(".service-card")

  serviceCards.forEach((card) => {
    const stars = card.querySelectorAll(".rating i")
    stars.forEach((star, index) => {
      star.addEventListener("click", () => {
        rateService(card, index + 1)
      })
    })
  })
}

function rateService(serviceCard, rating) {
  const serviceName = serviceCard.querySelector("h3").textContent

  // Mock rating submission
  showNotification(`Thank you for rating "${serviceName}" with ${rating} stars!`, "success")

  // Update visual rating
  const stars = serviceCard.querySelectorAll(".rating i")
  stars.forEach((star, index) => {
    if (index < rating) {
      star.classList.remove("far")
      star.classList.add("fas")
    } else {
      star.classList.remove("fas")
      star.classList.add("far")
    }
  })
}

// Service sharing functionality
function shareService(serviceCard) {
  const serviceName = serviceCard.querySelector("h3").textContent
  const serviceUrl = window.location.href

  if (navigator.share) {
    navigator.share({
      title: serviceName,
      text: `Check out this spiritual service: ${serviceName}`,
      url: serviceUrl,
    })
  } else {
    // Fallback - copy to clipboard
    navigator.clipboard.writeText(serviceUrl).then(() => {
      showNotification("Service link copied to clipboard!", "success")
    })
  }
}

// Add service to favorites
function addToFavorites(serviceCard) {
  const user = JSON.parse(localStorage.getItem("user"))

  if (!user) {
    showNotification("Please login to add favorites", "error")
    return
  }

  const serviceName = serviceCard.querySelector("h3").textContent
  const favorites = JSON.parse(localStorage.getItem("favorites")) || []

  if (!favorites.includes(serviceName)) {
    favorites.push(serviceName)
    localStorage.setItem("favorites", JSON.stringify(favorites))
    showNotification(`"${serviceName}" added to favorites!`, "success")
  } else {
    showNotification(`"${serviceName}" is already in favorites!`, "info")
  }
}

// Initialize additional features
document.addEventListener("DOMContentLoaded", () => {
  initializeServiceRating()

  // Add share buttons to service cards
  const serviceCards = document.querySelectorAll(".service-card")
  serviceCards.forEach((card) => {
    const shareBtn = document.createElement("button")
    shareBtn.innerHTML = '<i class="fas fa-share"></i>'
    shareBtn.className = "btn-share"
    shareBtn.style.cssText = `
            position: absolute;
            top: 10px;
            left: 10px;
            background: rgba(255, 255, 255, 0.9);
            border: none;
            border-radius: 50%;
            width: 35px;
            height: 35px;
            cursor: pointer;
            color: #ff6b35;
        `

    shareBtn.addEventListener("click", () => shareService(card))
    card.style.position = "relative"
    card.appendChild(shareBtn)
  })
})

function showNotification(message, type) {
  const notificationDiv = document.createElement("div")
  notificationDiv.className = `notification ${type}`
  notificationDiv.textContent = message

  document.body.appendChild(notificationDiv)

  setTimeout(() => {
    notificationDiv.remove()
  }, 3000)
}
