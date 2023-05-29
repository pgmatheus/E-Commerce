const mongoose = require("mongoose");

const VerifyValidDataSchema = new mongoose.Schema(
	{
		cInfo: { type: Object },
		product: { type: Object },
		shipping: { type: Object },
		method: { type: String },
		payment: { type: Object },
		sum: { type: Number },
		code: { type: String },
		clientKey: { type: String },
		clientSecret: { type: String },
		createdAt: { type: Date, expires: "30m", default: Date.now },
		/* expire_at: {
			type: Date,
			default: new Date(new Date().getTime() + 1000 * 60 * 60),
		}, */
		/* expire_at: { type: Date, default: Date.now, expires: 3600 }, */
	} /* ,
	{ timestamps: true, expireAfterSeconds: 3600 } */
);

module.exports = mongoose.model("VerifyValidData", VerifyValidDataSchema);
