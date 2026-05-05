import crypto from "crypto";
import Order from "../model/Order.js";

// ==============================
// PAYSTACK WEBHOOK (FINAL FIXED)
// ==============================
export const paystackWebhook = async (req, res) => {
  try {
    console.log("🔥 WEBHOOK HIT");

    const secret = process.env.PAYSTACK_SECRET_KEY;

    // STEP 1: verify signature (FIXED)
    const hash = crypto
      .createHmac("sha512", secret)
      .update(JSON.stringify(req.body))
      .digest("hex");

    const signature = req.headers["x-paystack-signature"];

    if (hash !== signature) {
      console.log("❌ Invalid signature");
      return res.status(400).send("Invalid signature");
    }

    // STEP 2: get event
    const event = req.body;

    console.log("EVENT:", event.event);

    // STEP 3: handle successful payment
    if (event.event === "charge.success") {
      const reference = event.data.reference;

      console.log("REFERENCE:", reference);

      // IMPORTANT: reference MUST be order._id
      const order = await Order.findById(reference);

      if (!order) {
        console.log("❌ ORDER NOT FOUND");
        return res.status(404).json({ message: "Order not found" });
      }

      // STEP 4: UPDATE ORDER
      order.paymentStatus = "paid";
      order.status = "accepted";

      await order.save();

      console.log("✅ ORDER UPDATED SUCCESSFULLY");
    }

    return res.status(200).send("OK");
  } catch (error) {
    console.log("WEBHOOK ERROR:", error.message);
    return res.status(500).send("Server error");
  }
};