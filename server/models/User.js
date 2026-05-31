const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  fullName: { type: String, trim: true },
  address: { type: String, trim: true },
  city: { type: String, trim: true },
  postalCode: { type: String, trim: true },
  country: { type: String, trim: true },
}, { _id: false });

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    savedAddress: {
      type: addressSchema,
      default: null,
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model('User', userSchema);
