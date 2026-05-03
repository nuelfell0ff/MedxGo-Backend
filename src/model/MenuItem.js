import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
    },

    price: {
      type: Number,
      required: true
    },

    image: {
      type: String
    },

    category: {
      type: String,
    },

    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true
    },

    isAvailable: {
      type: Boolean,
      default: true
    }
  }, { timestamps: true }
)

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

export default MenuItem;