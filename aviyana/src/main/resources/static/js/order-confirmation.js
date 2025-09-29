document.addEventListener("DOMContentLoaded", () => {
  // Initialize order confirmation page
  initializeOrderConfirmation()
  updateCartCount()
  checkUserStatus()
})

function initializeOrderConfirmation() {
  // Get order data from localStorage or URL parameters
  const orderData = getOrderData()

  if (orderData) {
    populateOrderDetails(orderData)
    populateOrderItems(orderData.items)
    populateDeliveryInfo(orderData.address)
    calculateOrderTotal(orderData.items)
  } else {
    // If no order data, redirect to home
    setTimeout(() => {
      window.location.href = "index.html"
    }, 3000)
  }

  // Set order dates
  setOrderDates()

  // Generate order number
  generateOrderNumber()

  // Clear cart after successful order
  clearCart()
}

function getOrderData() {
  // Try to get from localStorage first
  const orderData = localStorage.getItem("lastOrder")
  if (orderData) {
    return JSON.parse(orderData)
  }

  // If not in localStorage, create sample data for demo
  return {
    items: [
      {
        id: 1,
        name: "Sacred Rudraksha Beads",
        price: 299,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop",
      },
      {
        id: 2,
        name: "Meditation Incense Sticks",
        price: 149,
        quantity: 2,
        image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=100&h=100&fit=crop",
      },
    ],
    address: {
      name: "John Doe",
      street: "123 Spiritual Lane",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
      phone: "+91 98765 43210",
    },
    paymentMethod: "Credit Card",
  }
}

function populateOrderDetails(orderData) {
  // Update payment method
  const paymentMethodElement = document.getElementById("paymentMethod")
  if (paymentMethodElement && orderData.paymentMethod) {
    paymentMethodElement.textContent = orderData.paymentMethod
  }
}

function populateOrderItems(items) {
  const orderItemsList = document.getElementById("orderItemsList")
  if (!orderItemsList || !items) return

  orderItemsList.innerHTML = ""

  items.forEach((item) => {
    const orderItem = document.createElement("div")
    orderItem.className = "order-item"
    orderItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="item-image">
            <div class="item-details">
                <div class="item-name">${item.name}</div>
                <div class="item-quantity">Quantity: ${item.quantity}</div>
            </div>
            <div class="item-price">₹${(item.price * item.quantity).toLocaleString()}</div>
        `
    orderItemsList.appendChild(orderItem)
  })
}

function populateDeliveryInfo(address) {
  const shippingAddressElement = document.getElementById("shippingAddress")
  if (!shippingAddressElement || !address) return

  shippingAddressElement.innerHTML = `
        <p><strong>${address.name}</strong></p>
        <p>${address.street}</p>
        <p>${address.city}, ${address.state} - ${address.pincode}</p>
        <p>Phone: ${address.phone}</p>
    `
}

function calculateOrderTotal(items) {
  if (!items) return

  let subtotal = 0
  items.forEach((item) => {
    subtotal += item.price * item.quantity
  })

  const shipping = subtotal > 500 ? 0 : 50
  const tax = Math.round(subtotal * 0.18) // 18% GST
  const total = subtotal + shipping + tax

  // Update DOM elements
  updateElement("subtotal", `₹${subtotal.toLocaleString()}`)
  updateElement("shipping", shipping === 0 ? "Free" : `₹${shipping}`)
  updateElement("tax", `₹${tax.toLocaleString()}`)
  updateElement("finalTotal", `₹${total.toLocaleString()}`)
}

function setOrderDates() {
  const now = new Date()
  const orderDate = now.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // Add 5-7 days for delivery
  const deliveryDate = new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000)
  const deliveryDateString = deliveryDate.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  updateElement("orderDate", orderDate)
  updateElement("deliveryDate", deliveryDateString)
}

function generateOrderNumber() {
  // Generate a random order number
  const orderNumber = "#AV" + new Date().getFullYear() + String(Math.floor(Math.random() * 10000)).padStart(4, "0")
  updateElement("orderNumber", orderNumber)
}

function clearCart() {
  // Clear cart from localStorage
  localStorage.removeItem("cart")
  localStorage.removeItem("lastOrder")

  // Update cart count
  updateCartCount()
}

function updateElement(id, content) {
  const element = document.getElementById(id)
  if (element) {
    element.textContent = content
  }
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || []
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0)

  const cartCountElement = document.getElementById("cartCount")
  if (cartCountElement) {
    cartCountElement.textContent = cartCount
  }
}

function checkUserStatus() {
  const user = JSON.parse(localStorage.getItem("currentUser"))
  const loginLink = document.getElementById("loginLink")
  const registerLink = document.getElementById("registerLink")
  const dashboardLink = document.getElementById("dashboardLink")
  const logoutLink = document.getElementById("logoutLink")

  if (user) {
    // User is logged in
    if (loginLink) loginLink.style.display = "none"
    if (registerLink) registerLink.style.display = "none"
    if (dashboardLink) dashboardLink.style.display = "block"
    if (logoutLink) logoutLink.style.display = "block"
  } else {
    // User is not logged in
    if (loginLink) loginLink.style.display = "block"
    if (registerLink) registerLink.style.display = "block"
    if (dashboardLink) dashboardLink.style.display = "none"
    if (logoutLink) logoutLink.style.display = "none"
  }
}

// Print functionality
function printReceipt() {
  window.print()
}

// Add some animation effects
function addAnimationEffects() {
  // Animate success icon
  const successIcon = document.querySelector(".success-icon")
  if (successIcon) {
    successIcon.style.animation = "bounceIn 1s ease-out"
  }

  // Animate order items
  const orderItems = document.querySelectorAll(".order-item")
  orderItems.forEach((item, index) => {
    item.style.opacity = "0"
    item.style.transform = "translateY(20px)"
    setTimeout(() => {
      item.style.transition = "all 0.5s ease"
      item.style.opacity = "1"
      item.style.transform = "translateY(0)"
    }, index * 100)
  })
}

// Add CSS animations
const style = document.createElement("style")
style.textContent = `
    @keyframes bounceIn {
        0% {
            transform: scale(0.3);
            opacity: 0;
        }
        50% {
            transform: scale(1.05);
        }
        70% {
            transform: scale(0.9);
        }
        100% {
            transform: scale(1);
            opacity: 1;
        }
    }

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

    .confirmation-container {
        animation: fadeInUp 0.8s ease-out;
    }
`
document.head.appendChild(style)

// Initialize animations when page loads
setTimeout(addAnimationEffects, 500)
