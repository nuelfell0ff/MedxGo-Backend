import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
    },

    items: [
      {
        menuItem: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'MenuItem',
          required: true,
        },

        name: String,
        price: Number,
        quantity: Number,
      },
    ],

    totalAmount: {
      type: Number,
      required: true
    },

    deliveryAddress: {
      type: String,
      required: true
    },

    phone: {
      type: String,
      required: true
    },

    status: {
      type: String,
      enum: ['pending', 'accepted', 'preparing', 'ready', 'delivered', 'cancelled'],
      default: 'pending'
    },

    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending'
    },
  }, { timestamps: true }
)

const Order = mongoose.model('Order', orderSchema);

export default Order;