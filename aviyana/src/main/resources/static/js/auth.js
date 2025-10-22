document.addEventListener("DOMContentLoaded", function () {
  const form = document
    .getElementById("forgotPasswordForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      const email = document.getElementById("email").value;

      fetch("https://aviyanadivine-4.onrender.com/api/auth/forgotpassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })
        .then(async (response) => {
          if (!response.ok) {
            // Try to parse error response if it's JSON
            let errorMsg = "Something went wrong!";
            try {
              const errorData = await response.json();
              errorMsg = errorData.message || errorMsg;
            } catch {
              // If it's not JSON (or empty body), fall back to text
              const errorText = await response.text();
              if (errorText) errorMsg = errorText;
            }
            throw new Error(errorMsg);
          }

          return response.json(); // Only parse JSON if response is ok
        })
        .then((data) => {
          if (data.success) {
            alert("Reset link sent to your email!");
          } else {
            alert(data.message || "Email not found");
          }
        })
        .catch((error) => {
          console.error("Error:", error.message);
          alert(error.message || "Something went wrong. Please try again.");
        });
    });
});
