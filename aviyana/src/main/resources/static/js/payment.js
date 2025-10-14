document.getElementById("payBtn").addEventListener("click", async function () {
  const total = localStorage.getItem("orderTotal");
  const shippingData = JSON.parse(localStorage.getItem("shippingAddress"));

  if (!total || !shippingData) {
    alert("Please complete the checkout form before proceeding.");
    return;
  }

  try {
    // Step 1: Create Razorpay order via backend
    const orderResponse = await fetch("https://aviyanadivine-2.onrender.com/api/payment/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: total })
    });

    const orderData = await orderResponse.json();
    if (orderData.error) {
      alert("Error creating order: " + orderData.error);
      return;
    }

    // Step 2: Open Razorpay Checkout
    const options = {
      key: "rzp_test_RQwLEWKItg04vZ", // ⚠️ Replace with your test key ID
      amount: orderData.amount,
      currency: orderData.currency,
      name: "Aviyana Divine",
      description: "Order Payment",
      image: "images/divinelogo.jpeg",
      order_id: orderData.id,
      handler: async function (response) {
        // Step 3: On successful payment, save details to DB
        const paymentData = {
          orderId: orderData.id,
          paymentId: response.razorpay_payment_id,
          status: "SUCCESS",
          amount: total,
          email: shippingData.email,
          phone: shippingData.phone,
          paymentDate: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        const saveResponse = await fetch("https://aviyanadivine-2.onrender.com/api/payment/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(paymentData)
        });

        if (saveResponse.ok) {
          alert("Payment successful! Thank you for shopping with us.");
          localStorage.clear();
          window.location.href = "success.html";
        } else {
          alert("Payment succeeded, but failed to save details.");
        }
      },
      prefill: {
        name: shippingData.fullName,
        email: shippingData.email,
        contact: shippingData.phone
      },
      theme: {
        color: "#528FF0"
      }
    };

    const razor = new Razorpay(options);
    razor.open();

    razor.on("payment.failed", function (response) {
      alert("Payment Failed: " + response.error.description);
    });

  } catch (error) {
    console.error(error);
    alert("Error during payment process.");
  }
});
