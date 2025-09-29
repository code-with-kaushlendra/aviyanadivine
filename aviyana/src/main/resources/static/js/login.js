document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    const loginData = { username, password };

    const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData)
    });

    const result = await res.text();

    if (res.ok) {
        alert("Login successful");
        localStorage.setItem("user", result); // optional: store user info


        window.location.href = "dashboard.html";
    } else {
        alert("Login failed: " + result);
    }
});
