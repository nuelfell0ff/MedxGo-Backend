import express from "express";
import {
  createMenuItem,
  getMenuItemsByRestaurant,
  getMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from "../controller/menuController.js";

import { protect } from "../middlewears/authMiddlewear.js";
import { authorizeRoles } from "../middlewears/roleMiddlewear.js";

const router = express.Router();


// =======================
// PUBLIC ROUTES (NO RESTRICTION)
// =======================

// get menu items by restaurant (PUBLIC)
router.get("/restaurant/:restaurantId", getMenuItemsByRestaurant);

// get single menu item (PUBLIC)
router.get("/:id", getMenuItem);


// =======================
// PROTECTED ROUTES (ONLY RESTAURANT/ADMIN)
// =======================

// create menu item
router.post(
  "/",
  protect,
  // authorizeRoles("restaurant", "admin"),
  createMenuItem
);

// update menu item
router.put(
  "/:id",
  protect,
  authorizeRoles("restaurant", "admin"),
  updateMenuItem
);

// delete menu item
router.delete(
  "/:id",
  protect,
  authorizeRoles("restaurant", "admin"),
  deleteMenuItem
);

export default router;