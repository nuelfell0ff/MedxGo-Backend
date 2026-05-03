import express from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
} from "../controller/orderController.js";
import { protect } from "../middlewears/authMiddlewear.js";


const router = express.Router();

// create order
router.post("/", protect, createOrder);

// get user orders
router.get('/my', protect, getMyOrders);

// get single order
router.get('/:id', protect, getOrderById);

// update order status
router.put('/:id/status', protect, updateOrderStatus)

export default router;