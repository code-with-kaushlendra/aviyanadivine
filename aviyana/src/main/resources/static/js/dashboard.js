// Check if user is logged in
const user = localStorage.getItem("user");

if (!user) {
    alert("You are not logged in.");
    window.location.href = "login.html";
} else {
    try {
        const parsed = JSON.parse(user);
        document.getElementById("welcome-message").innerHTML = `<p>Welcome, ${parsed.username || "User"}!</p>`;
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
}, 10000); // 10,000ms = 10 seconds

// Logout button functionality
document.getElementById("logout-btn").addEventListener("click", () => {
    localStorage.removeItem("user");
    alert("Logged out successfully.");
    window.location.href = "login.html";
});
