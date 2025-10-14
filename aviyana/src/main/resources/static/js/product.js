// js/products.js

document.addEventListener("DOMContentLoaded", () => {
  const productsGrid = document.getElementById("productsGrid");
  const filterButtons = document.querySelectorAll(".filter-btn");
  let allProducts = [];

  // Listen for Add to Cart buttons
  productsGrid.addEventListener('click', (e) => {
if (e.target.classList.contains('btn-buy-now')) {
  const productId = e.target.getAttribute('data-product-id');
  buyNow(productId);
}

  });

  // Fetch data from backend API
  fetch("https://aviyanadivine-2.onrender.com/api/products")
    .then(response => {
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      return response.json();
    })
    .then(data => {
      allProducts = data;
      renderProducts(allProducts);
    })
    .catch(error => {
      console.error("Error fetching products:", error);
      productsGrid.innerHTML = `<p class="error">Unable to load products at this time.</p>`;
    });

  // Render products to grid
  function renderProducts(products) {
    productsGrid.innerHTML = "";

    if (!products || products.length === 0) {
      productsGrid.innerHTML = "<p>No products found.</p>";
      return;
    }

    products.forEach(product => {
      const category = product.category ? product.category.toLowerCase() : "general";

      const productCard = document.createElement("div");
      productCard.classList.add("product-card");
      productCard.setAttribute("data-category", category);

      productCard.innerHTML = `
        <div class="product-image">
         <img src="${product.image_url || 'https://via.placeholder.com/300x300.png?text=No+Image'}">

          <div class="product-overlay">
            <button class="btn-quick-view" data-product-id="${product.id}">Quick View</button>
          </div>
        </div>
        <div class="product-info">
          <h3>${product.name || 'Unnamed Product'}</h3>
          <p class="product-description">${product.description || 'No description available.'}</p>
          <div class="product-rating">
            ${generateStars(product.rating || 5)}
            <span>(${product.reviews || 0} reviews)</span>
          </div>
          <div class="product-price">
            <span class="current-price">₹${product.price || 0}</span>
            ${product.originalPrice ? `<span class="original-price">₹${product.originalPrice}</span>` : ""}
          </div>
       <button class="btn-buy-now" data-product-id="${product.id}">Buy Now</button>


        </div>
      `;

      productsGrid.appendChild(productCard);
    });
  }

  // Star Rating Helper
  function generateStars(rating) {
    let stars = "";
    for (let i = 1; i <= 5; i++) {
      stars += i <= rating
        ? `<i class="fas fa-star"></i>`
        : `<i class="far fa-star"></i>`;
    }
    return stars;
  }

  // Filter by category
  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      const category = button.getAttribute("data-category");

      // UI: Toggle active button
      filterButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");

      const filtered = category === "all"
        ? allProducts
        : allProducts.filter(p => (p.category || '').toLowerCase() === category);

      renderProducts(filtered);
    });
  });
});



// Add to Cart Function
function addToCart(productId, quantity = 1) {
  const userId = getCurrentUserId(); // This function should return the logged-in user's ID

  if (!userId) {
    alert("User not logged in.");
    return;
  }


  fetch('http://localhost:8080/api/cart', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
body: JSON.stringify({
  userId: userId,
  productId: productId,
  quantity: quantity
})

  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to add to cart');
      }
      return response.json();
    })
    .then(data => {
      alert('Product added to cart successfully!');
      updateCartCount();
    })
    .catch(error => {
      console.error('Error adding to cart:', error);
      alert('Failed to add product to cart.');
    });
}

function buyNow(productId) {
  const userId = getCurrentUserId();
  const quantity = 1;

  if (!userId) {
    alert("Please log in to proceed.");
    window.location.href = "login.html";
    return;
  }

  const checkoutUrl = `checkout.html?productId=${productId}&quantity=${quantity}`;
  window.location.href = checkoutUrl;
}



function getCurrentUser() {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

function getCurrentUserId() {
  const user = getCurrentUser();
  return user ? user.id : null;
}






