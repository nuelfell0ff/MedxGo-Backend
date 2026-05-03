import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { getOrders } from "../controllers/orderController.js";

const router = express.Router();

// protected route
router.get("/", protect, getOrders);

export default router;