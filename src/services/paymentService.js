import axios from "axios";

export const initializePayment = async (email, amount, reference) => {
  try {
    // =========================
    // STEP 1: VALIDATE INPUTS
    // =========================
    if (!email || !amount || !reference) {
      throw new Error("Missing payment initialization fields");
    }

    console.log("🚀 INIT PAYSTACK PAYMENT");
    console.log({ email, amount, reference });

    // =========================
    // STEP 2: CALL PAYSTACK API
    // =========================
    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount: Math.round(amount * 100), // convert to kobo safely
        reference: reference.toString(),  // ensure string
        currency: "NGN",
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 10000, // prevent hanging requests
      }
    );

    // =========================
    // STEP 3: VALIDATE RESPONSE
    // =========================
    if (!response.data || !response.data.data) {
      throw new Error("Invalid Paystack response");
    }

    console.log("✅ PAYSTACK SUCCESS");

    return response.data.data; // contains authorization_url
  } catch (error) {
    console.error(
      "❌ PAYSTACK INIT ERROR:",
      error.response?.data || error.message
    );

    throw new Error("Payment initialization failed");
  }
};