import MenuItem from '../model/MenuItem.js';

// create menu item
export const createMenuItem = async(req, res) => {
  try {
    const { name, description, price, image, category, restaurantId } = req.body;

    const menuItem = await MenuItem.create({
      name,
      description,
      price,
      image,
      category,
      restaurant: restaurantId,
    });

    res.status(201).json(menuItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get menu items by restaurants
export const getMenuItemsByRestaurant = async (req, res) => {
  try {
    const menu = await MenuItem.find({
      restaurant: req.params.restaurantId,
    });

    res.json(menu);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// get single menu item
export const getMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);

    if (!item) {
      res.status(404).json({ message: 'Item  not found' });
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// update menu item
export const updateMenuItem = async (req, res) => {
  try {
    const updatedItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )

    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// delete menu item
export const deleteMenuItem = async (req, res) => {
  try {
    await MenuItem.findByIdAndDelete(req.params.id);
    res.json({message: 'Menu item deleted!'})
  } catch (error) {
    res.status(500).json({message: error.message});
  }
};