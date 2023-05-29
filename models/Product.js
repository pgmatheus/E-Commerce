const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true},
    desc: { type: String, required: true },
    img: { type: Array, required: true },
    infoStock: {type: Array, required: true}, // array with quantity, color and size in stock
    categories: { type: Array },
    size: { type: Array },
    color: { type: Array },
    price: { type: Number, required: true },
    inStock: { type: Boolean, default: true },
    bprice: { type: Number},
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
