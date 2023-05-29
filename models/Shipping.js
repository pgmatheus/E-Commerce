const mongoose = require("mongoose");

const ShippingSchema = new mongoose.Schema(
  {
    cep: { type: String, required: true },
    city: { type: String, required: true },
    district: { type: String, required: true },
    shippingp: { type: Number, required: true },
    shippings: { type: Number },
    timeD: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Shipping", ShippingSchema);
