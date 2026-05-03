import Restaurant from "../model/Restaurant.js";

// create
export const createResraurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.create({
      ...req.body,
      owner: req.user._id, //from authMiddleware.js
    });

    res.status(201).json(restaurant);
  } catch (error) {
    res.status(401).json({ message: error.messaqge })
  }
};

// get all restaurants
export const getRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.status(restaurants);
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
};

// get single restaurant
export const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    res.status(200).json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
};

// update restaurant
export const updateRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )

    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
};

// delete restaurant
export const deleteRestaurant = async (req, res) => {
  try {
    await Restaurant.findByIdAndDelete(req.params.id);
    res.json({ message: 'Restaurant deleted successfully!' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}