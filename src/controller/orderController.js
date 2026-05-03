import Order from '../model/Order.js';
import MenuItem from '../model/MenuItem.js';

// create a new order
export const createOrder = async (req, res) => {
  try {
    const { items, deliveryAddress, phone } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items in order' });
    }

    // get items from database
    const menuItems = await MenuItem.find({
      _id: { $in: items.map((i) => i.menuItem) }
    });

    // calulate total & build order items
    let totalAmount = 0;

    const orderItems = items.map((item) => {
      const product = menuItems.find(
        (p) => p._id.toString() === item.menuItem
      );

      if (!product) {
        throw new Error('Item not found');
      }

      totalAmount += product.price * item.quantity;

      return {
        menuItem: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
      };
    });

    // get restaurant from first item
    const restaurant = menuItems[0].restaurant;

    // create order
    const order = await Order.create({
      user: req.user._id,
      restaurant,
      items: orderItems,
      totalAmount,
      deliveryAddress,
      phone,
    })

    res.status(201).json(order);
  } catch (error) {
    console.error(500).json({ message: error.message });
  }
}

// get user order
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get single order
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};