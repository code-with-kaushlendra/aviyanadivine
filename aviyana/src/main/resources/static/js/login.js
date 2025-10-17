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

        // ✅ Fix: Use correct key and remove undefined variable
        const isAdmin = result.admin === true;
        console.log("Is Admin:", isAdmin);

        // Save user to localStorage
        localStorage.setItem("user", JSON.stringify(result));

        // ✅ Redirect based on role
        if (isAdmin) {
            window.location.href = "dashboard.html";
        } else {
            window.location.href = "products.html";
        }

    } catch (err) {
        console.error("Login error:", err);
        alert("Network or server error. Try again later.");
    }
});
