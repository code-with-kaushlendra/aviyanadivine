document.addEventListener("DOMContentLoaded", function () {
  document
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
        .then((response) => {
          return response
            .json()
            .then((data) => {
              // Now we safely read the body once
              if (!response.ok) {
                throw new Error(data.message || "Something went wrong!");
              }
              return data;
            })
            .catch(() => {
              // Body is not JSON or empty
              if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
              }
              throw new Error("Unexpected error format.");
            });
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
