const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
	{
		username: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		phone: { type: String },
		currentAddress: { type: Array },
		loginFailures: { type: Number, default: 0 },
		loginAfter: { type: Date, default: new Date() },
		emailSent: { type: Date, default: new Date() },
		passChange: { type: Date, default: new Date() },
		situation: {
			type: String,
			default: "unactive",
		},
		isAdmin: {
			type: Boolean,
			default: false,
		},
		img: { type: String },
		orders: { type: Array },
		tokenActivation: { type: Array },
	},
	{ timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
