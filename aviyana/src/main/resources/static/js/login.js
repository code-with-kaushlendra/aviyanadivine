document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault();


    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const user = {
    email:email,
     password:password
   };

    const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user)
    });

    const result = await res.text();

    if (res.ok) {
        alert("Login successful");
        localStorage.setItem("user", JSON.stringify(result)); // optional: store user info


        window.location.href = "dashboard.html";
    } else {
        alert("Login failed: " + result);
    }
});
