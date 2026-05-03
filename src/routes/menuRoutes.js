import express from 'express';
import {
  createMenuItem,
  getMenuItemsByRestaurant,
  getMenuItem,
  updateMenuItem,
  deleteMenuItem
} from '../controller/menuController.js';
import { protect } from '../middlewears/authMiddlewear.js';

const router = express.Router();

// create menu item (protected)
router.post('/', protect, createMenuItem);

// get menu items by restaurant
router.get('/restaurant/:restaurantId', getMenuItemsByRestaurant);

// get single menu item
router.get('/:id', getMenuItem);

// update menu item (protected)
router.put('/:id', protect, updateMenuItem);

// delete menu item(protected)
router.delete('/:id', protect, deleteMenuItem)

export default router;