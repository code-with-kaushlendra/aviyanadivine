<script>
document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    const user = { email, password };

    try {
        const res = await fetch("https://aviyanadivine-2.onrender.com/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user)
        });

        let result = {};
        try {
            result = await res.json();
        } catch (parseError) {
            console.error("Failed to parse JSON:", parseError);
            alert("Unexpected server response. Try again later.");
            return;
        }

        if (res.ok) {
            alert("Login successful!");

            // Debug: Check what's inside
            console.log("Login response:", result);
            console.log("typeof is_admin:", typeof result.is_admin); // should be number or string

            // Store in localStorage
            localStorage.setItem("user", JSON.stringify(result));

            // Convert is_admin to number and redirect correctly
            if (Number(result.is_admin) === 1) {
                window.location.href = "dashboard.html"; // Admin
            } else {
                window.location.href = "products.html"; // Normal user
            }

        } else {
            console.warn("Login failed:", result?.message || res.statusText);
            alert(result?.message || "Login failed. Check email or password.");
        }

    } catch (err) {
        console.error("Network or server error:", err);
        alert("Server error. Try again later.");
    }
});
</script>
