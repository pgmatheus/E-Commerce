const router = require("express").Router();
const RecaptchaToken = require("../models/RecaptchaToken");

router.post("/", async (req, res, next) => {
	try {
		let arrCaptcha = req.body.captchaArr;

		let address =
			req.headers["x-forwarded-for"] || req.socket.remoteAddress || null; // ip received

		const captchaArray = await RecaptchaToken.findOne({
			address: address,
		});

		if (captchaArray) {
			if (captchaArray.arrCaptcha.toString() == arrCaptcha.toString()) {
				res.status(200).json({ token: captchaArray.token });
			} else {
				res.status(200).json({ error: "Invalid captcha" });
			}
		} else {
			res.status(200).json({ error: "Invalid captcha" });
		}
	} catch (err) {
		next(err);
		/* res.status(400).json({ err: "error" }); */
	}
});

module.exports = router;
