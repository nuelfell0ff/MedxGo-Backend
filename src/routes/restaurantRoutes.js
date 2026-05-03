import express from 'express';
import {
  createResraurant,
  getRestaurantById,
  getRestaurants,
  updateRestaurant,
  deleteRestaurant
} from '../controller/restaurantController.js';
import { protect } from '../middlewears/authMiddlewear.js';

const router = express.Router();

// create(protected)
router.post('/', protect, createResraurant);

// view
router.get('/', getRestaurants);
router.get('/:id', getRestaurantById);

// update (protected)
router.put('/:id', protect, updateRestaurant);

// delete (protected)
router.delete('/:id', protect, deleteRestaurant);

export default router;