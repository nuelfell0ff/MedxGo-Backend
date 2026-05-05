import Order from "../model/Order.js";
import MenuItem from "../model/MenuItem.js";
import Restaurant from "../model/Restaurant.js";
import { initializePayment } from "../services/paymentService.js";
import axios from "axios";

// ==========================
// CREATE ORDER
// ==========================
export const createOrder = async (req, res) => {
  try {
    const { items, deliveryAddress, phone } = req.body;

    // STEP 1: Validate input
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items in order" });
    }

    // STEP 2: Fetch menu items
    const menuItems = await MenuItem.find({
      _id: { $in: items.map((i) => i.menuItem) },
    });

    if (!menuItems.length) {
      return res.status(404).json({ message: "Menu items not found" });
    }

    // STEP 3: Calculate total
    let totalAmount = 0;

    const orderItems = items.map((item) => {
      const product = menuItems.find(
        (p) => p._id.toString() === item.menuItem
      );

      if (!product) {
        throw new Error("Item not found");
      }

      totalAmount += product.price * item.quantity;

      return {
        menuItem: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
      };
    });

    // STEP 4: Get restaurant
    const restaurant = menuItems[0].restaurant;

    // STEP 5: Create order FIRST
    const order = await Order.create({
      user: req.user._id,
      restaurant,
      items: orderItems,
      totalAmount,
      deliveryAddress,
      phone,
      status: "pending",
      paymentStatus: "pending",
    });

    // STEP 6: Initialize Paystack payment
    const payment = await initializePayment(
      req.user.email,
      totalAmount,
      order._id.toString() // IMPORTANT: used as reference
    );

    console.log("PAYSTACK RESPONSE:", payment);

    // STEP 7: Return response
    return res.status(201).json({
      order,
      paymentUrl: payment.authorization_url,
    });

  } catch (error) {
    console.error("CREATE ORDER ERROR:", error.message);
    return res.status(500).json({ message: error.message });
  }
};

// ==========================
// GET USER ORDERS
// ==========================
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    return res.json(orders);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ==========================
// GET SINGLE ORDER
// ==========================
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.json(order);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ==========================
// UPDATE ORDER STATUS
// ==========================
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = [
      "pending",
      "accepted",
      "preparing",
      "ready",
      "delivered",
      "cancelled",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Restaurant restriction
    if (req.user.role === "restaurant") {
      const restaurant = await Restaurant.findById(order.restaurant);

      if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }

      if (restaurant.owner.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          message: "Not authorized to update this order",
        });
      }
    }

    // Customer restriction
    if (req.user.role === "customer") {
      if (order.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          message: "You can only modify your own orders",
        });
      }

      if (status !== "cancelled") {
        return res.status(403).json({
          message: "Customers can only cancel orders",
        });
      }
    }

    order.status = status;
    await order.save();

    return res.json({
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ==========================
// VERIFY PAYMENT (PAYSTACK)
// ==========================
export const verifyPayment = async (req, res) => {
  try {
    const { reference } = req.params;

    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const data = response.data.data;

    if (data.status === "success") {
      const order = await Order.findById(reference);

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      order.paymentStatus = "paid";
      await order.save();

      return res.json({
        message: "Payment verified successfully!",
        order,
      });
    }

    return res.status(400).json({
      message: "Payment verification failed!",
    });
  } catch (error) {
    console.error("PAYMENT VERIFY ERROR:", error.message);
    return res.status(500).json({ message: error.message });
  }
};