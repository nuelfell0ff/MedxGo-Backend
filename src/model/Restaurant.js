import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    description: {
      type: String
    },

    image: {
      type: String
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    location: {
      address: String,
      lat: Number,
      lng: Number
    },

    isOpen: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

export default Restaurant;