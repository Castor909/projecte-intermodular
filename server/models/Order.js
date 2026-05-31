const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    txHash: { type: String, required: true, trim: true },
    items: [
      {
        albumId: { type: mongoose.Schema.Types.ObjectId, ref: 'Album' },
        title: { type: String, trim: true },
        artist: { type: String, trim: true },
        qty: { type: Number, min: 1 },
        priceEth: { type: Number, min: 0 },
      },
    ],
    totalEth: { type: Number, min: 0 },
    shippingAddress: {
      fullName: String,
      address: String,
      city: String,
      postalCode: String,
      country: String,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model('Order', orderSchema);
