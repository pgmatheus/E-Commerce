const mongoose = require("mongoose");

const ChangePasswordTokenSchema = new mongoose.Schema({
	token: { type: "string" },
	email: { type: "string" },
	createdAt: { type: Date, expires: "10m", default: Date.now },
});

module.exports = mongoose.model(
	"ChangePasswordToken",
	ChangePasswordTokenSchema
);
