
<!-- ✅ Add Dynamic Script for Order Summary -->

  let shippingSaved = false; // ✅ Track if user saved shipping address

  document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("productId");
    const quantity = parseInt(params.get("quantity")) || 1;

    if (!productId) {
      alert("No product selected.");
      return;
    }

    try {
      const response = await fetch(`https://aviyanadivine-4.onrender.com/api/products/${productId}`);
      if (!response.ok) throw new Error("Product not found");

      const product = await response.json();

      const summaryItems = document.getElementById("summaryItems");
      const subtotal = product.price * quantity;
      const shipping = 50;
      const gst = Math.round(subtotal * 0.18);
      const discount = Math.round(subtotal * 0.10);
      const total = subtotal + shipping + gst - discount;

      // Update Order Summary Display
      summaryItems.innerHTML = `
        <div class="summary-item">
          <img src="${product.imageUrl}" alt="${product.name}">
          <div class="item-info">
            <span class="item-name">${product.name}</span>
            <span class="item-qty">Qty: ${quantity}</span>
          </div>
          <span class="item-price">₹${subtotal}</span>
        </div>
      `;

      document.getElementById("checkoutSubtotal").textContent = `₹${subtotal}`;
      document.getElementById("checkoutShipping").textContent = `₹${shipping}`;
      document.getElementById("checkoutTax").textContent = `₹${gst}`;
      document.getElementById("checkoutDiscount").textContent = `-₹${discount}`;
      document.getElementById("checkoutTotal").textContent = `₹${total}`;
    } catch (err) {
      console.error(err);
      alert("Failed to load product details.");
    }
  });

  // Save Shipping Address
  document.getElementById("addressForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const addressData = {
      fullName: document.getElementById("fullName").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      address: document.getElementById("address").value,
      city: document.getElementById("city").value,
      state: document.getElementById("state").value,
      pincode: document.getElementById("pincode").value,
    };

    try {
      const response = await fetch("https://aviyanadivine-4.onrender.com/api/shipping/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addressData),
      });

      if (response.ok) {
        alert("Shipping address saved successfully!");

        // Store in localStorage (optional)
        localStorage.setItem("shippingAddress", JSON.stringify(addressData));

        // ✅ Mark that address is saved
        shippingSaved = true;
      } else {
        alert("Failed to save address.");
        shippingSaved = false;
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server.");
      shippingSaved = false;
    }
  });

  // Proceed to Payment — Only if shippingSaved is true
  function proceedToCheckout() {
    if (!shippingSaved) {
      alert("Please fill and save your shipping address before proceeding.");
      return;
    }

    const total = document.getElementById("checkoutTotal").textContent.replace("₹", "");
    localStorage.setItem("orderTotal", total);

    window.location.href = "payment.html";
  }

