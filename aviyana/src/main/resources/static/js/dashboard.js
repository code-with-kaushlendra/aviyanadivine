document.addEventListener("DOMContentLoaded", () => {
    const user = localStorage.getItem("user");

    if (!user) {
        alert("You are not logged in.");
        window.location.href = "login.html";
    } else {
        try {
            const parsed = JSON.parse(user);
            document.getElementById("userName").innerHTML = `Welcome, ${parsed.firstname || "User"}!`;
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
    }, 10000); // 10 seconds

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
