import express from 'express';
import { paystackWebhook } from '../controller/paymentController.js';

const router = express.Router();

// router.post("/webhook", express.raw({ type: "application/json" }), handleWebhook);

// IMPORTANT: no protect middleware here
router.post("/webhook", paystackWebhook);

export default router;