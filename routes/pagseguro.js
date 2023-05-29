const router = require("express").Router();
const axios = require("axios");
/* const parseString = require("xml2js").parseString; */
const token = process.env.PAGSEGURO_TOKEN;
const email = process.env.PAGSEGURO_EMAIL;
const result = require("../features/xmltojson");
const insertPurchaseUserArr = require("../features/insertPurchaseUserArr");
const { verifyTokenAndAuthorization } = require("./verifyToken");

/* const getInfoPagseguro = async (notificationCode) => {
	try {
		const infoPurchase = await axios.get(
			`https://ws.sandbox.pagseguro.uol.com.br/v3/transactions/notifications/${notificationCode}?email=${email}&token=${token}`,
			{
				headers: {
					"Content-Type": "application/xml",
				},
			}
		);

		const xmlresult = await result(infoPurchase.data);

		if (!infoPurchase || !xmlresult || !xmlresult.transaction) {
			return { success: false, error: true, message: "invalid response" };
		}

		let sender = xmlresult.transaction.sender;
		let code = xmlresult.transaction.code[0];
		let IdEmail = sender[0].email[0];

		await insertPurchaseUserArr({
			code: code,
			email: IdEmail,
			pagseguro: xmlresult.transaction,
		});
	} catch (e) {
		return { success: false, error: true, message: "Error processing" };
	}
}; */

/* router.get("/:id", verifyTokenAndAuthorization, async (req, res) => {
	try {
		// get the token from the pagseguro
		const tokenPagseguro = await axios.post(
			`https://ws.sandbox.pagseguro.uol.com.br/v2/sessions?email=${email}&token=${token}`
		);

		

		const xmlresult = await result(tokenPagseguro.data);

		return res.status(200).send({ token: xmlresult.session.id[0] });
	} catch (err) {
		
		res.status(403).send({
			success: false,
			error: true,
			message: "error geting sesssion ID",
		});
	}
}); */

/* router.post("/", async (req, res) => {
	try {
		let response = await getInfoPagseguro(req.body.notificationCode);

		return res.status(200).json({ ok: "ok" });
	} catch (err) {
		console.log(err);

		return res.status(400).json({ err: "error" });
	}
}); */

module.exports = router;
