const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    artist: {
      type: String,
      required: true,
      trim: true,
    },
    year: {
      type: Number,
      required: true,
      min: 1900,
    },
    genre: {
      type: String,
      required: true,
      trim: true,
    },
    priceEth: {
      type: Number,
      required: true,
      min: 0,
    },
    coverUrl: {
      type: String,
      required: true,
      trim: true,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    audioUrl: {
      type: String,
      trim: true,
    },
    tracks: [
      {
        title: { type: String, required: true },
        duration: { type: String },
      },
    ],
    label: { type: String, trim: true },
    country: { type: String, trim: true },
    vinylFormat: { type: String, trim: true },
    barcode: { type: String, trim: true },
    mbid: { type: String, trim: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model('Album', albumSchema);