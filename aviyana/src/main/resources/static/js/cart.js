// cart.js

// Key under which you store cart in localStorage
const CART_KEY = "myCart";  // you may choose "cart" or "user_cart"

// Utility: fetch cart state (object: productId → {productData, quantity})
function getCartState() {
    const cartJson = localStorage.getItem(CART_KEY);
    if (!cartJson) return {};
    try {
        return JSON.parse(cartJson);
    } catch (e) {
        console.error("Invalid cart JSON", e);
        return {};
    }
}

// Utility: save cart state
function saveCartState(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// Call this when “Add to Cart” is clicked on products page
function addToCart(product) {
    // product should be object like { id, name, price, imageUrl, ... }
    const cart = getCartState();
    if (!cart[product.id]) {
        cart[product.id] = { product: product, quantity: 1 };
    } else {
        cart[product.id].quantity += 1;
    }
    saveCartState(cart);
    // optionally update cart count indicator
    updateCartCount();
}

// Remove from cart
function removeFromCart(productId) {
    const cart = getCartState();
    if (cart[productId]) {
        delete cart[productId];
        saveCartState(cart);
        renderCartItems();
    }
}

// Update quantity by delta (can be +1 or –1)
function updateQuantity(productId, delta) {
    const cart = getCartState();
    if (cart[productId]) {
        cart[productId].quantity = Math.max(1, cart[productId].quantity + delta);
        saveCartState(cart);
        renderCartItems();
    }
}

// Render the cart items in DOM
function renderCartItems() {
    const cart = getCartState();
    const cartItemsContainer = document.querySelector(".cart-items");
    cartItemsContainer.innerHTML = "";  // clear old contents

    let subtotal = 0;
    let totalItems = 0;

    for (const pid in cart) {
        const entry = cart[pid];
        const prod = entry.product;
        const qty = entry.quantity;
        totalItems += qty;

        // Create the HTML for this item (you can use template strings)
        const itemDiv = document.createElement("div");
        itemDiv.classList.add("cart-item");
        itemDiv.setAttribute("data-product-id", pid);

        itemDiv.innerHTML = `
          <div class="item-image">
            <img src="${prod.imageUrl}" alt="${prod.name}">
          </div>
          <div class="item-details">
            <h3>${prod.name}</h3>
            <p class="item-description">${prod.description || ""}</p>
            <div class="item-options">
              ${prod.options ? prod.options.map(opt => `<span class="option">${opt}</span>`).join("") : ""}
            </div>
            <div class="item-actions">
              <button class="remove-item" onclick="removeFromCart('${pid}')">
                <i class="fas fa-trash"></i> Remove
              </button>
            </div>
          </div>
          <div class="item-quantity">
            <label>Quantity:</label>
            <div class="quantity-controls">
              <button class="qty-btn" onclick="updateQuantity('${pid}', -1)">-</button>
              <input type="number" value="${qty}" min="1" id="qty-${pid}">
              <button class="qty-btn" onclick="updateQuantity('${pid}', 1)">+</button>
            </div>
          </div>
          <div class="item-price">
            <span class="current-price">₹${(prod.price * qty).toFixed(2)}</span>
          </div>
        `;

        cartItemsContainer.appendChild(itemDiv);

        subtotal += prod.price * qty;
    }

    // Update summary area
    document.getElementById("subtotal").innerText = `₹${subtotal.toFixed(2)}`;
    // shipping, discount, tax logic you can insert
    const shipping = subtotal > 0 ? 50 : 0;
    document.getElementById("shipping").innerText = `₹${shipping.toFixed(2)}`;
    const discount = 0;  // logic to compute discount if any
    document.getElementById("discount").innerText = `-₹${discount.toFixed(2)}`;
    const tax = (subtotal * 0.18);
    document.getElementById("tax").innerText = `₹${tax.toFixed(2)}`;
    const total = subtotal + shipping + tax - discount;
    document.getElementById("total").innerText = `₹${total.toFixed(2)}`;

    // update cart count display somewhere
    const cartCountElem = document.getElementById("cartCount");
    if (cartCountElem) cartCountElem.innerText = totalItems;
}

// On page load, render cart items
window.addEventListener("DOMContentLoaded", () => {
    renderCartItems();
});

// Expose functions globally (so onclick in HTML can call them)
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.addToCart = addToCart;
