// Cart functionality
document.addEventListener("DOMContentLoaded", () => {
  initializeCart()
  updateCartDisplay()
  setupCartEventListeners()
})

// Cart data structure
let cartData = {
  items: [
    {
      id: 1,
      name: "Premium Incense Sticks Set",
      description: "Handcrafted aromatic incense sticks for meditation and prayers",
      price: 450,
      originalPrice: 500,
      quantity: 2,
      image: "public/incense-sticks.jpg",
      options: {
        fragrance: "Sandalwood",
        packSize: "50 sticks",
      },
    },
    {
      id: 2,
      name: "Sacred Rudraksha Beads",
      description: "Authentic 5-mukhi Rudraksha beads for spiritual protection",
      price: 299,
      quantity: 1,
      image: "public/rudraksha-beads.jpg",
      options: {
        size: "12mm",
        origin: "Nepal",
      },
    },
    {
      id: 3,
      name: "Meditation Cushion",
      description: "Comfortable zabuton cushion for extended meditation sessions",
      price: 1200,
      originalPrice: 1400,
      quantity: 1,
      image: "public/meditation-cushion.png",
      options: {
        color: "Maroon",
        material: "Cotton",
      },
    },
  ],
  savedItems: [],
}

function initializeCart() {
  // Load cart data from localStorage if available
  const savedCart = localStorage.getItem("cartData")
  if (savedCart) {
    cartData = JSON.parse(savedCart)
  }

  console.log("[v0] Cart initialized with items:", cartData.items.length)
}

function updateCartDisplay() {
  updateCartCount()
  updateCartSummary()
  displaySavedItems()
}

function updateCartCount() {
  const totalItems = cartData.items.reduce((sum, item) => sum + item.quantity, 0)
  const cartCountElement = document.getElementById("cartCount")
  if (cartCountElement) {
    cartCountElement.textContent = totalItems
  }
}

function updateCartSummary() {
  const subtotal = cartData.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const originalTotal = cartData.items.reduce((sum, item) => {
    const originalPrice = item.originalPrice || item.price
    return sum + originalPrice * item.quantity
  }, 0)

  const discount = originalTotal - subtotal
  const shipping = subtotal > 999 ? 0 : 50
  const tax = Math.round(subtotal * 0.18)
  const total = subtotal + shipping + tax

  // Update summary elements
  updateElement("subtotal", `₹${subtotal.toLocaleString()}`)
  updateElement("shipping", shipping === 0 ? "Free" : `₹${shipping}`)
  updateElement("discount", discount > 0 ? `-₹${discount.toLocaleString()}` : "₹0")
  updateElement("tax", `₹${tax.toLocaleString()}`)
  updateElement("total", `₹${total.toLocaleString()}`)

  console.log("[v0] Cart summary updated:", { subtotal, shipping, tax, total })
}

function updateElement(id, value) {
  const element = document.getElementById(id)
  if (element) {
    element.textContent = value
  }
}

function updateQuantity(productId, change) {
  const item = cartData.items.find((item) => item.id === productId)
  if (item) {
    const newQuantity = item.quantity + change
    if (newQuantity > 0 && newQuantity <= 10) {
      item.quantity = newQuantity

      // Update input field
      const qtyInput = document.getElementById(`qty-${productId}`)
      if (qtyInput) {
        qtyInput.value = newQuantity
      }

      updateCartDisplay()
      saveCartData()
      showNotification(`Quantity updated to ${newQuantity}`, "success")
    }
  }
}

function removeFromCart(productId) {
  const itemIndex = cartData.items.findIndex((item) => item.id === productId)
  if (itemIndex > -1) {
    const item = cartData.items[itemIndex]

    if (confirm(`Remove "${item.name}" from cart?`)) {
      cartData.items.splice(itemIndex, 1)

      // Remove item element from DOM
      const itemElement = document.querySelector(`[data-product-id="${productId}"]`)
      if (itemElement) {
        itemElement.remove()
      }

      updateCartDisplay()
      saveCartData()
      showNotification("Item removed from cart", "success")

      // Redirect to products page if cart is empty
      if (cartData.items.length === 0) {
        setTimeout(() => {
          window.location.href = "products.html"
        }, 2000)
      }
    }
  }
}

function saveForLater(productId) {
  const itemIndex = cartData.items.findIndex((item) => item.id === productId)
  if (itemIndex > -1) {
    const item = cartData.items.splice(itemIndex, 1)[0]
    cartData.savedItems.push(item)

    // Remove item element from DOM
    const itemElement = document.querySelector(`[data-product-id="${productId}"]`)
    if (itemElement) {
      itemElement.remove()
    }

    updateCartDisplay()
    saveCartData()
    showNotification("Item saved for later", "info")
  }
}

function displaySavedItems() {
  const savedItemsSection = document.getElementById("savedItems")
  const savedItemsList = document.querySelector(".saved-items-list")

  if (cartData.savedItems.length > 0) {
    savedItemsSection.style.display = "block"

    if (savedItemsList) {
      savedItemsList.innerHTML = cartData.savedItems
        .map(
          (item) => `
                <div class="saved-item" data-product-id="${item.id}">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="saved-item-details">
                        <h4>${item.name}</h4>
                        <p>₹${item.price}</p>
                    </div>
                    <div class="saved-item-actions">
                        <button onclick="moveToCart(${item.id})">Move to Cart</button>
                        <button onclick="removeSavedItem(${item.id})">Remove</button>
                    </div>
                </div>
            `,
        )
        .join("")
    }
  } else {
    savedItemsSection.style.display = "none"
  }
}

function moveToCart(productId) {
  const itemIndex = cartData.savedItems.findIndex((item) => item.id === productId)
  if (itemIndex > -1) {
    const item = cartData.savedItems.splice(itemIndex, 1)[0]
    cartData.items.push(item)

    updateCartDisplay()
    saveCartData()
    showNotification("Item moved to cart", "success")

    // Refresh page to show updated cart
    location.reload()
  }
}

function removeSavedItem(productId) {
  const itemIndex = cartData.savedItems.findIndex((item) => item.id === productId)
  if (itemIndex > -1) {
    cartData.savedItems.splice(itemIndex, 1)
    displaySavedItems()
    saveCartData()
    showNotification("Saved item removed", "success")
  }
}

function applyPromoCode() {
  const promoCode = document.getElementById("promoCode").value.trim().toUpperCase()

  if (!promoCode) {
    showNotification("Please enter a promo code", "warning")
    return
  }

  // Simulate promo code validation
  const validCodes = {
    DIVINE10: 10,
    SPIRITUAL15: 15,
    NEWUSER20: 20,
    WELCOME25: 25,
  }

  if (validCodes[promoCode]) {
    const discountPercent = validCodes[promoCode]
    showNotification(`Promo code applied! ${discountPercent}% discount`, "success")

    // Apply discount logic here
    console.log("[v0] Promo code applied:", promoCode, discountPercent + "%")
  } else {
    showNotification("Invalid promo code", "error")
  }
}

function addToCart(productType) {
  // Simulate adding recommended products to cart
  const products = {
    lamp: { name: "Brass Oil Lamp", price: 350 },
    mala: { name: "108 Bead Prayer Mala", price: 450 },
    crystals: { name: "Healing Crystal Set", price: 800 },
    bowl: { name: "Tibetan Singing Bowl", price: 1200 },
  }

  const product = products[productType]
  if (product) {
    showNotification(`${product.name} added to cart!`, "success")
    console.log("[v0] Added to cart:", product)
  }
}

function proceedToCheckout() {
  if (cartData.items.length === 0) {
    showNotification("Your cart is empty", "warning")
    return
  }

  // Save cart data before checkout
  saveCartData()

  // Redirect to checkout page
  window.location.href = "checkout.html"
}

function saveCartData() {
  localStorage.setItem("cartData", JSON.stringify(cartData))
}

function setupCartEventListeners() {
    // Quantity input change listeners
    document.querySelectorAll('[id^="qty-"]').forEach(input => {
        input.addEventListener('change', function() {
            const productId = Number.parseInt(this.id.split('-')[1]);
            const newQuantity = Number.parseInt(this.value);

            if (newQuantity > 0 && newQuantity <= 10) {
                const item = cartData.items.find(item => item.id === productId);
                if (item) {
                    item.quantity = newQuantity;
                    updateCartDisplay();
                    saveCartData();
                }
            } else {
                // Reset to previous value
                const item = cartData.items.find(item => item.id === productId);
                if (item) {
                    this.value = item.quantity;
                }
                showNotification('Quantity must be between 1 and 10', 'warning');
            }
        });
    });

    // Save for later buttons
    document.querySelectorAll('.save-later').forEach(button => {
        button.addEventListener('click', function() {
            const cartItem = this.closest('.cart-item');
