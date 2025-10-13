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

            console.log("Login response:", result);

            // Check if is_admin is directly on result or inside result.data
           const isAdmin = Number(result.is_admin);


            if (typeof isAdmin === 'undefined') {
                alert("Unexpected response format. 'is_admin' missing.");
                return;
            }

            // Save the whole response (or just data) in localStorage
            localStorage.setItem("user", JSON.stringify(result));

            if (Number(isAdmin) === 1) {
                window.location.href = "dashboard.html"; // Admin
            } else {
                window.location.href = "products.html"; // User
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
