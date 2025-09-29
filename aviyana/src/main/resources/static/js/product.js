// Products page specific JavaScript

document.addEventListener("DOMContentLoaded", () => {
  initializeProductsPage()
})

function initializeProductsPage() {
  initializeFilters()
  initializeViewToggle()
  initializeQuickView()
  initializeSort()
  initializeLoadMore()
  handleURLParams()
}

// Filter functionality
function initializeFilters() {
  const filterButtons = document.querySelectorAll(".filter-btn")
  const productCards = document.querySelectorAll(".product-card")

  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Remove active class from all buttons
      filterButtons.forEach((btn) => btn.classList.remove("active"))
      // Add active class to clicked button
      this.classList.add("active")

      const category = this.dataset.category
      filterProducts(category, productCards)
    })
  })
}

function filterProducts(category, productCards) {
  productCards.forEach((card) => {
    if (category === "all" || card.dataset.category === category) {
      card.style.display = "block"
      card.style.animation = "fadeIn 0.5s ease"
    } else {
      card.style.display = "none"
    }
  })
}

// View toggle functionality
function initializeViewToggle() {
  const viewButtons = document.querySelectorAll(".view-btn")
  const productsGrid = document.getElementById("productsGrid")

  viewButtons.forEach((button) => {
    button.addEventListener("click", function () {
      viewButtons.forEach((btn) => btn.classList.remove("active"))
      this.classList.add("active")

      const view = this.dataset.view
      if (view === "list") {
        productsGrid.classList.add("list-view")
      } else {
        productsGrid.classList.remove("list-view")
      }
    })
  })
}

// Quick view modal functionality
function initializeQuickView() {
  const quickViewButtons = document.querySelectorAll(".btn-quick-view")
  const modal = document.getElementById("quickViewModal")
  const closeBtn = document.querySelector(".close")

  quickViewButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.stopPropagation()
      const productId = this.dataset.product
      openQuickView(productId)
    })
  })

  closeBtn.addEventListener("click", () => {
    modal.style.display = "none"
  })

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none"
    }
  })
}

function openQuickView(productId) {
  const modal = document.getElementById("quickViewModal")
  const productData = getProductData(productId)

  if (productData) {
    document.getElementById("modalProductImage").src = productData.image
    document.getElementById("modalProductName").textContent = productData.name
    document.getElementById("modalProductDescription").textContent = productData.description
    document.getElementById("modalProductPrice").innerHTML = productData.price
    document.getElementById("modalProductRating").innerHTML = productData.rating

    modal.style.display = "block"
  }
}

function getProductData(productId) {
  // Mock product data - in real implementation, this would come from API
  const products = {
    mandir1: {
      name: "Premium Wooden Mandir",
      description: "Handcrafted wooden temple for home worship with intricate carvings and premium finish.",
      price: '<span class="current-price">₹2,999</span><span class="original-price">₹3,499</span>',
      rating:
        '<i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><span>(24 reviews)</span>',
      image: "images/mandir1.jpg",
    },
    incense1: {
      name: "Sandalwood Incense Sticks",
      description: "Pure sandalwood fragrance for meditation and spiritual practices.",
      price: '<span class="current-price">₹199</span><span class="original-price">₹249</span>',
      rating:
        '<i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><span>(45 reviews)</span>',
      image: "images/incense1.jpg",
    },
    // Add more products as needed
  }

  return products[productId]
}

// Quantity change functionality
function changeQuantity(change) {
  const quantityInput = document.getElementById("modalQuantity")
  const currentValue = Number.parseInt(quantityInput.value)
  const newValue = currentValue + change

  if (newValue >= 1) {
    quantityInput.value = newValue
  }
}

// Sort functionality
function initializeSort() {
  const sortSelect = document.getElementById("sortProducts")

  sortSelect.addEventListener("change", function () {
    const sortBy = this.value
    sortProducts(sortBy)
  })
}

function sortProducts(sortBy) {
  const productsGrid = document.getElementById("productsGrid")
  const productCards = Array.from(productsGrid.querySelectorAll(".product-card"))

  productCards.sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return getPrice(a) - getPrice(b)
      case "price-high":
        return getPrice(b) - getPrice(a)
      case "name":
        return getName(a).localeCompare(getName(b))
      case "newest":
        // Mock newest sort - in real implementation, use actual dates
        return Math.random() - 0.5
      default:
        return 0
    }
  })

  // Re-append sorted cards
  productCards.forEach((card) => productsGrid.appendChild(card))
}

function getPrice(productCard) {
  const priceText = productCard.querySelector(".current-price").textContent
  return Number.parseInt(priceText.replace(/[^\d]/g, ""))
}

function getName(productCard) {
  return productCard.querySelector("h3").textContent
}

// Load more functionality
function initializeLoadMore() {
  const loadMoreBtn = document.querySelector(".btn-load-more")

  if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", () => {
      loadMoreProducts()
    })
  }
}

function loadMoreProducts() {
  // Mock load more functionality
  showNotification("Loading more products...", "info")

  setTimeout(() => {
    showNotification("All products loaded!", "success")
    document.querySelector(".btn-load-more").style.display = "none"
  }, 1000)
}

// Handle URL parameters
function handleURLParams() {
  const urlParams = new URLSearchParams(window.location.search)
  const category = urlParams.get("category")
  const search = urlParams.get("search")

  if (category) {
    const filterBtn = document.querySelector(`[data-category="${category}"]`)
    if (filterBtn) {
      filterBtn.click()
    }
  }

  if (search) {
    const searchInput = document.getElementById("productSearch")
    if (searchInput) {
      searchInput.value = search
      performProductSearch(search)
    }
  }
}

function performProductSearch(query) {
  const productCards = document.querySelectorAll(".product-card")
  const searchTerm = query.toLowerCase()

  productCards.forEach((card) => {
    const productName = card.querySelector("h3").textContent.toLowerCase()
    const productDescription = card.querySelector(".product-description").textContent.toLowerCase()

    if (productName.includes(searchTerm) || productDescription.includes(searchTerm)) {
      card.style.display = "block"
    } else {
      card.style.display = "none"
    }
  })
}

// Add CSS animations
const style = document.createElement("style")
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`
document.head.appendChild(style)

function showNotification(message, type) {
  // Mock notification function
  console.log(`Notification: ${message} (Type: ${type})`)
}
