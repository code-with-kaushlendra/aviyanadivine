document.addEventListener("DOMContentLoaded", () => {
    const user = localStorage.getItem("user");

    if (!user) {
        alert("You are not logged in.");
        window.location.href = "login.html";
    } else {
        try {
            const parsed = JSON.parse(user);

            document.getElementById("userName").innerHTML = `Welcome, ${parsed.firstName || "User"}!`;
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
                        <td><img src="${p.image_url}" alt="${p.name}" style="width: 60px; height: auto;"></td>
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
    await fetch(`https://aviyanadivine-2.onrender.com/api/products/${id}`, { method: "DELETE" });
    fetchProducts();
}
async function updateProduct(id) {
    // Ask user for new values
    const newName = prompt("Enter new product name:");
    const newDesc = prompt("Enter new description:");
    const newPrice = prompt("Enter new price:");
    const newQty = prompt("Enter new quantity:");
    const newImg = prompt("Pick new image:");

    if (!newName || !newPrice || !newQty) {
        alert("Update cancelled. All fields are required.");
        return;
    }

    // Send PUT request with updated data
    await fetch(`https://aviyanadivine-2.onrender.com/api/products/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: newName,
            description: newDesc,
            price: parseFloat(newPrice),
            quantity: parseInt(newQty),
            imageUrl: newImg
        })
    });

    // Reload products
    fetchProducts();
}

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


