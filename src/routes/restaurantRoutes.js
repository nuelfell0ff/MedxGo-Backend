import express from 'express';
import {
  createResraurant,
  getRestaurantById,
  getRestaurants,
  updateRestaurant,
  deleteRestaurant
} from '../controller/restaurantController.js';
import { protect } from '../middlewears/authMiddlewear.js';
import { authorizeRoles } from '../middlewears/roleMiddlewear.js';

const router = express.Router();

// create(protected)
router.post('/', protect, createResraurant); // authorizeRoles('restaurant', 'admin'),

// view
router.get('/', getRestaurants);
router.get('/:id', getRestaurantById);

// update (protected)
router.put('/:id', protect, authorizeRoles('restaurant', 'admin'), updateRestaurant);

// delete (protected)
router.delete('/:id', protect, authorizeRoles('restaurant'), deleteRestaurant);

export default router;