const router = require("express").Router();
const axios = require("axios");
const o2x = require("object-to-xml");
const result = require("../features/xmltojson");
const ReturnedValidData = require("../models/ReturnedValidData");
const generateQR = require("../features/generateQr");
const Product = require("../models/Product");
const User = require("../models/User");
const saveAndUpdate = require("../features/saveAndUpdate");
const insertPurchaseUserArr = require("../features/insertPurchaseUserArr");
const Recaptcha = require("../models/Recaptcha");
const RecaptchaToken = require("../models/RecaptchaToken");
const nodemailerApp = require("../features/nodemailerApp");

const {
	verifyToken,
	verifyTokenAndAuthorization,
	verifyTokenAndAdmin,
} = require("./verifyToken");
const {
	verifyUsername,
	verifyCep,
	verifyEmail,
	verifyPhone,
	verifyCpf,
	verifyStock,
	verifyShippingCost,
} = require("../features/verifyInput");

const handleSendRequest = async (xml, environment = false) => {
	var config = {
		headers: { "Content-Type": "application/xml" },
	};
	const resReq = await axios.post(
		"https://ws.sandbox.pagseguro.uol.com.br/v2/transactions?email=pgmatheus@hotmail.com&token=0F5539987A554A12BB7A8862A8E260D2",
		xml,
		config
	);
	const xmlresult = await result(resReq.data);
	return xmlresult;
};

router.post("/:id", verifyTokenAndAuthorization, async (req, res, next) => {
	try {
		const { _id, environment, token } = req.body;

		const recapcha = await RecaptchaToken.findOne({
			token: token,
		});

		let address =
			req.headers["x-forwarded-for"] || req.socket.remoteAddress || null; // ip received
		const date = new Date();

		const updateRecaptcha = await Recaptcha.findOneAndUpdate(
			{ address: address },
			{
				$push: {
					"typeReq.register": {
						$each: [date],
						$position: 0,
					},
				},
				$inc: { registerAttempts: 1 },
			}
		);

		if (!recapcha) {
			return res.status(400).json({
				error: true,
				success: false,
				message: "Erro de captcha, favor atualizar página",
			});
		}

		const tObj = await ReturnedValidData.findById(_id);

		if (!tObj) {
			return res
				.status(400)
				.json({ error: true, success: false, message: "Invalid Id" });
		}

		let method = tObj.method;

		if (!method) {
			return res
				.status(400)
				.json({ error: true, success: false, message: "Invalid Method" });
		}

		let pixValue = generateQR({
			value: tObj.sum.toFixed(2),
			id: _id,
		});

		tObj.code = _id;

		const recapcha2 = await RecaptchaToken.findOneAndDelete({
			token: token,
		});

		/* if (method === "pix") { */

		await saveAndUpdate(tObj.payment.items.item, "minus");

		await tObj.save();

		await insertPurchaseUserArr({
			verifiedPurchase: tObj,
			code: _id + "",
			pixValue: pixValue,
		});

		if (method !== "creditCard") {
			await nodemailerApp({
				from: "taliskafashion@taliskafashion.com.br",
				to: tObj.payment.sender.email,
				subject: "Taliska Fashion - Compra processada",
				content: {
					product: tObj.product,
					sum: tObj.sum,
					shipping: tObj.shipping,
				},
				bcc: "taliskafashion@taliskafashion.com.br",
			});
		}

		return res.status(200).json({
			success: true,
			error: false,
			data: { pixValue: pixValue, method: "pix" },
		});
	} catch (err) {
		next(err);
		/* return res.status(403).json({ err: "error" }); */
	}

	/* try {
		let info = req.body.info;
		let infoProduct = req.body.infoProduct;
		if (!info || !infoProduct) {
			return res.status(400).json({ error: "Missing Info" });
		}

		let cepS = {
			cep: info.shipping.postalCode,
			logradouro: info.shipping.street,
			bairro: info.shipping.district,
			localidade: info.shipping.city,
			number: info.shipping.number,
			uf: info.shipping.state,
			complement: info.shipping.complement,
			country: info.shipping.country,
		};

		let cepB = {
			cep: info.billing.postalCode,
			logradouro: info.billing.street,
			bairro: info.billing.district,
			localidade: info.billing.city,
			number: info.billing.number,
			uf: info.billing.state,
			complement: info.billing.complement,
			country: info.billing.country,
		};

		let verV = {
			type: info.shipping.type,
			cost: info.shipping.cost,
			country: info.shipping.country,
		};

		let items = info.items;

		if (!verifyUsername(info.sender.name)) {
			return res.status(400).json({ error: "Invalid Name" });
		}

		if (!verifyEmail(info.sender.email)) {
			return res.status(400).json({ error: "Invalid Email" });
		}

		if (!verifyPhone(info.sender.phone.areaCode + info.sender.phone.number)) {
			return res.status(400).json({ error: "Invalid Phone" });
		}

		let cpf = verifyCpf(info.sender.document.value);

		if (info.sender.document.type !== "CPF" || !cpf[0]) {
			return res.status(400).json({ error: "Invalid Document Number" });
		}

		let verifyCepC = await verifyCep(cepS);

		if (verifyCepC.error || !(JSON.stringify(cepB) === JSON.stringify(cepS))) {
			return res.status(400).json({ error: "Invalid Address" });
		}

		let checkStock = await verifyStock(items, infoProduct);

		if (!checkStock || checkStock.status === false) {
			return res
				.status(400)
				.json({ error: checkStock?.error || "Stock Mismatch" });
		} */

	/* 		let shippingC = await verifyShippingCost(cepS);
		if (!shippingC || shippingC.status === false) {
			return res.status(400).json({ error: "Invalid Shipping Cost" });
		} */

	/* 	return res.status(200).json({ foi: "success" });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: "error" });
	} */
});

module.exports = router;
