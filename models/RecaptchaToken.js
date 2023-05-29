const mongoose = require("mongoose");

const RecaptchaTokenSchema = new mongoose.Schema({
	token: { type: "string", required: true },
	address: { type: "string" },
	arrCaptcha: { type: "array" },
	createdAt: { type: Date, expires: "2m", default: Date.now },
	/* expire_at: {
			type: Date,
			default: new Date(new Date().getTime() + 1000 * 60 * 2),
		}, */
});

module.exports = mongoose.model("RecaptchaToken", RecaptchaTokenSchema);
