const mongoose = require("mongoose");

const RecaptchaSchema = new mongoose.Schema(
	{
		address: { type: String, required: true, unique: true },
		typeReq: { type: Object, required: true },
		loginFailedAttempts: { type: Number, required: true, default: 0 },
		registerAttempts: { type: Number, required: true, default: 0 },
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Recaptcha", RecaptchaSchema);
