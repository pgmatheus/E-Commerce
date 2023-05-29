const router = require("express").Router();
const token = process.env.PAGSEGURO_TOKEN;
const email = process.env.PAGSEGURO_EMAIL;
const axios = require("axios");
const result = require("../features/xmltojson");

router.post("/", async (req, res, next) => {
	try {
		const infoPurchase = await axios.get(
			`https://ws.sandbox.pagseguro.uol.com.br/v3/transactions/notifications/${req.body.notificationCode}?email=${email}&token=${token}`
		);

		const xmlresult = await result(infoPurchase.data);

		res.status(200).json({ ok: "ok" });
	} catch (err) {
		next(err);
		/* res.status(400).json({ err: "error" }); */
	}
});

module.exports = router;
