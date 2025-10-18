
document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    const user = { email, password };

    try {
        const res = await fetch("https://aviyanadivine-4.onrender.com/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user)
        });

        const result = await res.json();
        console.log("Login response:", result);

        if (!res.ok) {
            alert(result?.message || "Login failed. Check email or password.");
            return;
        }

        const isAdminRaw = result.is_admin;
        const isAdmin = parseInt(isAdminRaw, 10);
        console.log("is_admin (raw):", isAdminRaw, "| Parsed:", isAdmin);

        if (isNaN(isAdmin)) {
            alert("Invalid role data received. Contact support.");
            return;
        }

        // Save to localStorage
        localStorage.setItem("user", JSON.stringify(result));

        // Redirect based on role
        if (isAdmin === 1) {
            console.log("Redirecting to: dashboard.html");
            window.location.href = "dashboard.html";
        } else {
            console.log("Redirecting to: products.html");
            window.location.href = "products.html";
        }

    } catch (err) {
        console.error("Login error:", err);
        alert("Network or server error. Try again later.");
    }
});

