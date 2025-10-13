document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault();


    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const user = {
    email:email,
     password:password
   };

    const res = await fetch("https://aviyanadivine-2.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user)
    });

    const result = await res.json();

    if (res.ok) {
        alert("Login successful");
        localStorage.setItem("user", JSON.stringify(result)); // optional: store user info

            // Redirect based on is_admin flag
                    if (result.is_admin === 1) {
                        window.location.href = "dashboard.html"; // Admin page
                    } else {
                        window.location.href = "products.html"; // User page
                    }
    } else {
         alert("Something went wrong during login. Please try again.");
    }
});
