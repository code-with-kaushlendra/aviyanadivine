document.getElementById("signupForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    // Get values from form inputs
    const firstname = document.getElementById("firstName").value.trim();
    const lastname = document.getElementById("lastName").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const password = document.getElementById("password").value;
    const confirmpassword = document.getElementById("confirmPassword").value;


    // Basic validation
    if (!firstname || !lastname || !email || !phone || !password || !confirmpassword) {
        alert("Please fill out all fields.");
        return;
    }

    if (password !== confirmpassword) {
        alert("Passwords do not match.");
        return;
    }

    const user = {
        firstname,
        lastname,
        email,
        phone,
        password
    };

    try {
        const response = await fetch("http://localhost:8080/api/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user)
        });

        const result = await response.json();

        if (response.ok) {
            alert("Signup successful!");
            window.location.href = "login.html"; // ✅ Change if you use a different login page
        } else {
            alert("Signup failed: " + result);
        }
    } catch (error) {
        console.error("Error during signup:", error);
        alert("An error occurred. Please try again later.");
    }
});
