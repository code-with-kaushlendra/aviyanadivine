document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const user = {
        email: email,
        password: password
    };

    try {
        const res = await fetch("https://aviyanadivine-2.onrender.com/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user)
        });

        // Safely attempt to parse the response
        let result = {};
        try {
            result = await res.json();
        } catch (parseError) {
            console.error("Failed to parse response JSON:", parseError);
        }

        if (res.ok) {
            alert("Login successful");
            localStorage.setItem("user", JSON.stringify(result));

            // Redirect based on is_admin flag
            if (result.is_admin === 1) {
                window.location.href = "dashboard.html"; // Admin page
            } else {
                window.location.href = "products.html"; // User page
            }
        } else {
            // Optional: log server message if available
            console.warn("Login failed:", result?.message || res.status);
            alert("Login failed. Please check your email or password.");
        }
    } catch (err) {
        console.error("Login request failed:", err);
        alert("Network error. Please try again later.");
    }
});
