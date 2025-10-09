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
    }, 600000); // 10 min

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

async function fetchProducts(){
const response=await fetch("http://localhost:8080/api/products");
const products =await response.json();

let container=document.getElementById("products-container");
container.innerHTML= "";



 products.forEach(p => {
        container.innerHTML += `
            <div class="product-card">
                <h3>${p.name}</h3>
                <p>${p.description}</p>
                <p>Price: ₹${p.price}</p>
                <p>Stock: ${p.quantity}</p>
                <p>ImageURL: ${p.image_url}</p>
                <button onclick="deleteProduct(${p.id})">Delete</button>
                <button onclick="updateProduct(${p.id})">Update</button>
            </div>
        `;
    });
}

async function deleteProduct(id) {
    await fetch(`http://localhost:8080/api/products/${id}`, { method: "DELETE" });
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
    await fetch(`http://localhost:8080/api/products/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: newName,
            description: newDesc,
            price: parseFloat(newPrice),
            quantity: parseInt(newQty),
            image_url: newImg
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
              image_url
          };

              try {
                  const response = await fetch("http://localhost:8080/api/products", {
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


