document.getElementById("signupForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    const userData = { username, password };

    const res = await fetch("http://localhost:8080/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData)
    });

    const result = await res.text();

    if (res.ok) {
        alert("Signup successful!");
        window.location.href = "login.html";
    } else {
        alert("Signup failed: " + result);
    }
});
