const mongoose = require("mongoose");

const SliderSchema = new mongoose.Schema(
  {
    img: { type: String, required: true },
    desc: { type: String},
  },
  { timestamps: true }
);

module.exports = mongoose.model("Slider", SliderSchema);
