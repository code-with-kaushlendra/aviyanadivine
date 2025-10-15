document.addEventListener("DOMContentLoaded", () => {
    const user = localStorage.getItem("user");

    if (!user) {
        alert("You are not logged in.");
        window.location.href = "login.html";
    } else {
        try {
            const parsed = JSON.parse(user);

            document.getElementById("userName").innerHTML = `Welcome, ${parsed.firstname || "Admin"}!`;
        } catch (e) {
            alert("User data corrupted. Redirecting to login.");
            localStorage.removeItem("user");
            window.location.href = "login.html";
        }
    }

    // Auto logout after 10 seconds (for testing)
    setTimeout(() => {
        alert("Session expired. Please login again.");
        localStorage.removeItem("user");
        window.location.href = "login.html";
    }, 300000); // 5 min

    // Logout button functionality
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("user");
            alert("Logged out successfully.");
            window.location.href = "login.html";
        });
    } else {
        console.warn("Logout button not found.");
    }
});

async function showSection(section){
document.querySelectorAll(".dashboard-section").forEach(div=> div.style.display="none");
document.getElementById(section).style.display="block";

if(section === 'orders' || section=== 'listings'){
fetchProducts();
}
}
async function fetchProducts() {
    const response = await fetch("https://aviyanadivine-2.onrender.com/api/products");
    const products = await response.json();

    const container = document.getElementById("products-container");
    container.innerHTML = `
        <table class="product-table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Price (₹)</th>
                    <th>Stock</th>
                    <th>Image</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${products.map(p => `
                    <tr>
                        <td>${p.name}</td>
                        <td>${p.description}</td>
                        <td>${p.price}</td>
                        <td>${p.quantity}</td>
                        <td><img src="${p.imageUrl}" alt="${p.name}" style="width: 60px; height: auto;"></td>
                        <td>
                            <button onclick="deleteProduct(${p.id})">Delete</button>
                            <button onclick="updateProduct(${p.id})">Update</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

async function deleteProduct(id) {
    try {
        const response = await fetch(`https://aviyanadivine-2.onrender.com/api/products/${id}`, { method: "DELETE" });

        if (response.ok) {
            alert("Product deleted successfully!");
            fetchProducts(); // Refresh the list
        } else {
            const errorText = await response.text();
            alert("Failed to delete product: " + errorText);
        }
    } catch (error) {
        console.error("Delete error:", error);
        alert("An error occurred while deleting the product.");
    }
}
let currentUpdateId = null;

async function updateProduct(id) {
  currentUpdateId = id;

  // Get product data
  const response = await fetch(`https://aviyanadivine-2.onrender.com/api/products/${id}`);
  const product = await response.json();

  // Fill form
  document.getElementById("updateProductId").value = id;
  document.getElementById("updateName").value = product.name;
  document.getElementById("updateDescription").value = product.description;
  document.getElementById("updatePrice").value = product.price;
  document.getElementById("updateQuantity").value = product.quantity;
  document.getElementById("updateImage").value = product.imageUrl;

  // Show modal
  document.getElementById("updateModal").style.display = "block";
}

function closeUpdateModal() {
  document.getElementById("updateModal").style.display = "none";
  currentUpdateId = null;
}
document.getElementById("updateProductForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const id = currentUpdateId;
  const name = document.getElementById("updateName").value.trim();
  const description = document.getElementById("updateDescription").value.trim();
  const price = parseFloat(document.getElementById("updatePrice").value);
  const quantity = parseInt(document.getElementById("updateQuantity").value);
  const imageUrl = document.getElementById("updateImage").value.trim();

  if (!name || !description || isNaN(price) || isNaN(quantity) || !imageUrl) {
    alert("Please fill all fields correctly.");
    return;
  }

  const updatedProduct = { name, description, price, quantity, imageUrl };

  try {
    const res = await fetch(`https://aviyanadivine-2.onrender.com/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedProduct)
    });

    if (res.ok) {
      alert("Product updated successfully!");
      closeUpdateModal();
      fetchProducts(); // reload product list
    } else {
      const err = await res.text();
      alert("Failed to update: " + err);
    }
  } catch (error) {
    console.error("Update error:", error);
    alert("Something went wrong.");
  }
});


document.getElementById("add-product").addEventListener("submit",async function (e){
 e.preventDefault();

    const name = document.getElementById("listingTitle").value.trim();
    const description = document.getElementById("listingDescription").value.trim();
    const price = document.getElementById("listingPrice").value.trim();
    const quantity = document.getElementById("listingQuantity").value.trim();
    const image_url = document.getElementById("listingImages").value.trim();




     // Basic validation
      if (!name || !description || !price || !quantity ) {
          alert("Please fill out all fields.");
          return;
      }

          const product = {
              name,
              description,
              price: parseFloat(price),
              quantity: parseInt(quantity),
              imageUrl: image_url
          };

              try {
                  const response = await fetch("https://aviyanadivine-2.onrender.com/api/products", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(product)
                  });

                  const result = await response.text();

                  if (response.ok) {
                      alert("Added Successfully!");
                      window.location.href = "dashboard.html";
                  } else {
                      alert("Product Added failed: " + result);
                  }
              }

               catch (error) {
                      console.error("Error during Adding Product:", error);
                      alert("An error occurred. Please try again later.");
                  }

});

document.addEventListener("DOMContentLoaded", () => {
    // Notification settings toggle
    const switches = document.querySelectorAll("#settings .setting-item input[type='checkbox']");
    switches.forEach((toggle, index) => {
        toggle.addEventListener("change", () => {
            const setting = toggle.nextElementSibling.textContent.trim();
            const enabled = toggle.checked;

            console.log(`Setting changed: ${setting} is now ${enabled ? 'enabled' : 'disabled'}`);

            // Save to localStorage or call backend if needed
            // localStorage.setItem(`setting_${index}`, enabled);
        });
    });

    // Change Password
    document.querySelector(".change-password-btn").addEventListener("click", () => {
        const newPassword = prompt("Enter new password:");

        if (newPassword && newPassword.length >= 6) {
            // In a real app, you would call the backend API to update password
            alert("Password changed successfully (simulated).");
        } else {
            alert("Password must be at least 6 characters.");
        }
    });

    // Delete Account
    document.querySelector(".delete-account-btn").addEventListener("click", async () => {
        const confirmDelete = confirm("Are you sure you want to delete your account? This cannot be undone.");

        if (confirmDelete) {
            const user = JSON.parse(localStorage.getItem("user") || "{}");

            try {
                const res = await fetch(`https://aviyanadivine-2.onrender.com/api/users/${user.id}`, {
                    method: "DELETE"
                });

                if (res.ok) {
                    alert("Account deleted successfully.");
                    localStorage.removeItem("user");
                    window.location.href = "login.html";
                } else {
                    const err = await res.text();
                    alert("Failed to delete account: " + err);
                }
            } catch (error) {
                console.error("Delete account error:", error);
                alert("Error deleting account.");
            }
        }
    });
});



