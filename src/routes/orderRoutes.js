import express from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  verifyPayment,
} from "../controller/orderController.js";
import { protect } from "../middlewears/authMiddlewear.js";
import { authorizeRoles } from "../middlewears/roleMiddlewear.js";


const router = express.Router();

// create order
router.post("/", protect, authorizeRoles('customer'), createOrder);

// get user orders
router.get('/my', protect, getMyOrders);

// get single order
router.get('/:id', protect, getOrderById);

// update order status
router.put('/:id/status', protect, authorizeRoles('restaurant', 'admin', 'customer'), updateOrderStatus)

// verify payment
router.get('/verify/:reference', verifyPayment);

export default router;