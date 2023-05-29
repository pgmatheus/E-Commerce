const router = require("express").Router();
const RecaptchaToken = require("../models/RecaptchaToken");
const Product = require("../models/Product");
const { verifyId } = require("../features/verifyInput");
const {
	verifyUsername,
	verifyCep,
	verifyEmail,
	verifyPhone,
	verifyCpf,
	verifyStock,
	verifyShippingCost,
	language,
} = require("../features/verifyInput");
const ReturnedValidData = require("../models/ReturnedValidData");
const { defaults } = require("xml2js");
const returnOnlyNumber = require("../features/returnnumber");
const KEY = process.env.STRIPE_KEY;
const stripe = require("stripe")(KEY);
const generateQR = require("../features/generateQr");

const lang = {
	br: {
		shipping00: "Cep Inválido 00",
		shipping01: "Cep Inválido 01",
		shipping01: "Cep não inserido 01",
		shipping02: "Cep não inserido 02",
	},
};

const mergeProduct = () => {};

const searchArr = (arrId, verArr) => {
	/* console.log(verArr);
	console.log(verArr.length);
	console.log(arrId); */
	if (verArr && verArr.length > 0) {
		for (let i = 0; i < verArr.length; i++) {
			if (arrId == verArr[i]._id) {
				return true;
			}
		}
	} else {
		return false;
	}
};

const getClientSecret = async (amount, description, customer) => {
	try {
		const paymentIntent = await stripe.paymentIntents.create({
			amount: amount,
			currency: "brl",
			receipt_email: "pgmatheus@hotmail.com",
			description: customer,
			metadata: { product: description },
			automatic_payment_methods: {
				enabled: true,
			},
		});

		if (!paymentIntent) {
			return null;
		}
		return paymentIntent;
	} catch (err) {
		console.log(err);
	}
};

router.post("/product", async (req, res, next) => {
	try {
		const { initArr, shipping, gen, cInfo, info, hash, cpfR, method } =
			req.body;
		let tempArr = [];
		let verArr = [];
		let tempValue = {};
		let resArr = [];
		let resArr2 = [];
		let shiObj = undefined;
		let infoPurchase = {};
		let resObj = {};
		let tObj = {};
		let value = undefined;

		/* var http = require("http");

		http.get({ host: "api.ipify.org", port: 80, path: "/" }, function (resp) {
			resp.on("data", function (ip) {
				console.log("My public IP address is: " + ip);
			});
		}); */

		if (shipping?.postalCode) {
			shipping = {
				...shipping,
				cep: shipping.postalCode,
				bairro: shipping.district,
				logradouro: shipping.street,
				localidade: shipping.city,
				uf: shipping.state,
			};
		}

		for (let i = 0; i < initArr.length; i++) {
			// organize array
			if (
				!searchArr(initArr[i]._id + initArr[i].color + initArr[i].size, verArr)
			) {
				verArr.push({
					_id: initArr[i]._id + initArr[i].color + initArr[i].size,
				});

				tempValue = { ...initArr[i] };
				for (let j = i + 1; j < initArr.length; j++) {
					if (
						initArr[i]._id === initArr[j]._id &&
						initArr[i].size === initArr[j].size &&
						initArr[i].color === initArr[j].color
					) {
						tempValue = {
							...tempValue,
							quantity: tempValue.quantity + initArr[j].quantity,
						};
					}
				}
				tempArr.push(tempValue);
			}
		}

		if (tempArr && tempArr.length > 0) {
			for (let i = 0; i < tempArr.length; i++) {
				if (verifyId(tempArr[i]._id)) {
					const pDbase = await Product.findOne({ _id: tempArr[i]._id });

					if (pDbase) {
						for (let j = 0; j < pDbase.infoStock.length; j++) {
							if (
								pDbase.infoStock[j].colorCode === tempArr[i].color &&
								pDbase.infoStock[j].size === tempArr[i].size &&
								pDbase.infoStock[j].quantity > 0
							) {
								let quantity = 0;
								if (
									pDbase.infoStock[j].quantity >= initArr[i].quantity /* &&
									pDbase.infoStock[j].quantity !== 0 */
								) {
									/* resArr.push(tempArr[i]); */
									quantity = initArr[i].quantity;
									/* resArr.push(tempArr[i]);
									resArr2.push(pDbase); */
								} else if (
									pDbase.infoStock[j].quantity < initArr[i].quantity /* &&
									pDbase.infoStock[j].quantity !== 0 */
								) {
									quantity = pDbase.infoStock[j].quantity;
									/* resArr.push({
										...tempArr[i],
										quantity: pDbase.infoStock[j].quantity,
									});

									resArr2.push({
										...pDbase,
										quantity: pDbase.infoStock[j].quantity,
									}); */
								}

								let _id = pDbase._id + "";

								resArr.push({
									_id: _id,
									title: pDbase.title,
									img: pDbase.img,
									desc: pDbase.desc,
									infoStock: pDbase.infoStock,
									categories: pDbase.categories,
									size: tempArr[i].size,
									color: tempArr[i].color,
									price: pDbase.price,
									inStock: pDbase.inStock,
									bprice: pDbase.bprice,
									createdAt: pDbase.createdAt,
									updatedAt: pDbase.updatedAt,
									__v: pDbase.__v,
									quantity: quantity,
								});
							}
						}
					}
				}
			}

			/* let z = pDbase.infoStock.filter((e) => {
				if (
					e.colorCode === tempArr[i].color &&
					e.size === tempArr[i].size
				) {
					if (e.quantity >= tempArr[i].quantity) {
						return tempArr[i];
					} else if (e.quantity < initArr[i].quantity && e.quantity == !0) {
						return { ...tempArr[i], quantity: e.quantity };
					}
				}
			});
			console.log(z); */
		}

		if (shipping) {
			let z = await verifyCep(shipping, true);

			if (!z.error) {
				let y = await verifyShippingCost(shipping);
				if (
					y.status &&
					(y.pac.Erro == "0" || y.pac.Erro == "010" || y.pac.Erro == "011")
				) {
					const { error, status, ...other } = y;
					shiObj = other;
				}
			}
		}

		if (gen) {
			if (!info) {
				return res.status(400).json({ error: true, response: "Erro dados" });
			}
			if (!shiObj) {
				return res.status(400).json({ error: true, response: "Erro no frete" });
			}

			if (!method) {
				return res
					.status(400)
					.json({ error: true, response: "Erro no método de pagamento" });
			}

			if (!verifyUsername(info.sender.name)) {
				return res.status(400).json({ error: true, response: "Nome Inválido" });
			}

			if (!verifyEmail(info.sender.email)) {
				return res.status(400).json({ error: true, response: "Erro email" });
			}

			/* if (!verifyPhone(info.sender.phone.areaCode + info.sender.phone.number)) {
				return res
					.status(400)
					.json({ error: true, response: "Erro telefone comprador" });
			} */

			/* 			if (method !== "pix") {
				let cpf = verifyCpf(returnOnlyNumber(cpfR));

				if (!cpf[0]) {
					return res
						.status(400)
						.json({ error: true, response: "Erro CPF comprador" });
				}
			} */

			if (resArr.length < 1) {
				return res
					.status(400)
					.json({ error: true, response: "Erro carrinho " });
			}

			tObj.mode = "default";
			tObj.method = method;
			tObj.sender = {
				name: info.sender.name,
				email: info.sender.email,
				phone: {
					areaCode: info.sender.phone.areaCode,
					number: info.sender.phone.number,
				},
			};

			tObj.sender.documents = {
				document: { type: "CPF", value: returnOnlyNumber(cpfR) },
			};

			tObj.sender.hash =
				"56d95c66e47608124fc8c6cf51eb666203a5a256f12ad68954f8a7f802927372" ||
				hash; // modificar

			/* tObj.sender.hash = hash; //modificar */
			tObj.currency = "BRL";
			tObj.notificationURL = "https://taliska.loca.lt/api/pagseguro"; // adicionar depois

			let tArr = [];
			let sum = parseFloat(parseFloat(shiObj.pac.Valor).toFixed(2));

			for (let i = 0; i < resArr.length; i++) {
				let t = resArr[i]._id + "_" + resArr[i].color + "_" + resArr[i].size;
				tArr.push({
					id: t,
					quantity: resArr[i].quantity.toString(),
					amount: /* (Math.round(resArr[i].price * 100) / 100)
						.toFixed(2)
						.toString() */ resArr[i].price.toFixed(2).toString(),
					description: resArr[i].title,
				});
				sum += parseFloat(
					parseFloat(resArr[i].price) *
						parseFloat(resArr[i].quantity).toFixed(2)
				);
			}

			sum = parseFloat(sum.toFixed(2));

			/* for (let i = 0; i < tArr.length; i++) { */
			tObj.items = { item: tArr };
			/* 	} */

			/* tObj.items = { item: info.items }; */
			tObj.extraAmount = "0.00";

			tObj.shipping = {
				type: 1,
				cost: shiObj.pac.Valor.toFixed(2),
				address: {
					street: shiObj.cep.logradouro,
					number: info.shipping.number,
					complement: info.shipping.complement,
					district: shiObj.cep.bairro,
					city: shiObj.cep.localidade,
					state: shiObj.cep.uf,
					country: "BRA",
					postalCode: returnOnlyNumber(shiObj.cep.cep),
				},
				addressRequired: true,
			};

			/* 	if (method == "creditCard") {
				if (!verifyUsername(cInfo.creditC.holder.name)) {
					return res
						.status(400)
						.json({ error: true, response: "Nome Inválido do cartão" });
				}

				let cpf1 = verifyCpf(
					returnOnlyNumber(cInfo.creditC.holder.document.value)
				);

				if (!cpf1[0]) {
					return res
						.status(400)
						.json({ error: true, response: "Erro CPF Cartão" });
				}

				if (
					!verifyPhone(
						cInfo.creditC.holder.phone.areaCode +
							cInfo.creditC.holder.phone.number
					)
				) {
					return res
						.status(400)
						.json({ error: true, response: "Erro telefone comprador" });
				}

				if (!cInfo.cToken) {
					return res.status(400).json({
						error: true,
						response: "Erro token cartão, favor repetir a compra",
					});
				}

				if (cInfo.creditC.installment.noInterestInstallmentQuantity != 3) {
					return res.status(400).json({
						error: true,
						response: "Erro Parcelamento",
					});
				}

				sum = parseFloat(
					(
						parseFloat(cInfo.creditC.installment.quantity) *
						parseFloat(cInfo.creditC.installment.value)
					).toFixed(2)
				);

				tObj.creditCard = {
					token: cInfo.cToken,
					installment: {
						quantity: cInfo.creditC.installment.quantity,
						value: cInfo.creditC.installment.value,
						noInterestInstallmentQuantity:
							cInfo.creditC.installment.noInterestInstallmentQuantity,
					},
					holder: {
						name: cInfo.creditC.holder.name,
						documents: {
							document: {
								type: "CPF",
								value: cInfo.creditC.holder.document.value,
							},
						},
						phone: {
							areaCode: cInfo.creditC.holder.phone.areaCode,
							number: cInfo.creditC.holder.phone.number,
						},
					},
					billingAddress: {
						street: shiObj.cep.logradouro,
						number: info.shipping.number,
						complement: info.shipping.complement,
						district: shiObj.cep.bairro,
						city: shiObj.cep.localidade,
						state: shiObj.cep.uf,
						country: "BRA",
						postalCode: returnOnlyNumber(shiObj.cep.cep),
					},
				};
			} */

			let arrD = "";

			for (let i = 0; i < resArr.length; i++) {
				arrD =
					arrD +
					`{${i}: {
				title ${resArr[i].title},
				id: ${resArr[i]._id + ""},
				color: ${resArr[i].color},
				size: ${resArr[i].size},
				quantity: ${resArr[i].quantity}},				
				`;
			}

			arrD = arrD.substring(0, 475);

			let clientKey = await getClientSecret(
				parseInt(sum.toFixed(2).toString().replace(".", "")),
				arrD,
				info.sender.email
			);

			/* let zwww = JSON.stringify({ product: resArr }); */

			if (!clientKey) {
				return res.status(400).json({
					error: true,
					success: false,
					message: "Connection stripe error",
				});
			}

			const Vdata = new ReturnedValidData({
				cInfo: cInfo,
				product: resArr,
				shipping: shiObj,
				method: method,
				payment: tObj,
				sum: sum.toFixed(2),
				clientKey: clientKey?.id,
				clientSecret: clientKey.client_secret,
			});

			const savedInfo = await Vdata.save();

			let retId = savedInfo._id + "";

			return res.status(200).json({
				error: false,
				cInfo: cInfo,
				product: resArr,
				shipping: shiObj,
				method: method,
				_id: retId,
				response: "success",
				sum: sum,
				clientKey: clientKey?.client_secret,
			});
		}

		return res.status(200).json({
			product: resArr,
			shipping: shiObj,
			error: false,
			response: "success",
			/* tObj: tObj, */
		});
	} catch (err) {
		next(err);
		/* console.log(err);
		return res.status(400).json({ error: true }); */
	}
});

router.post("/shipping", async (req, res, next) => {
	try {
		let { shipping, save } = req.body;

		let shiObj = undefined;

		if (shipping) {
			if (shipping.postalCode) {
				shipping = {
					...shipping,
					cep: shipping.postalCode,
					bairro: shipping.district,
					logradouro: shipping.street,
					localidade: shipping.city,
					uf: shipping.state,
				};
			}

			let z = await verifyCep(shipping, true);

			if (!z.error) {
				let y = await verifyShippingCost(shipping);

				if (
					y.status &&
					(y.pac.Erro == "0" || y.pac.Erro == "010" || y.pac.Erro == "011")
				) {
					const { error, status, ...other } = y;
					shiObj = other;
				} else {
					return res.status(403).json({
						shipping: shiObj,
						error: true,
						response: lang[language].shipping00,
					});
				}
			} else {
				return res.status(403).json({
					shipping: shiObj,
					error: true,
					response: lang[language].shipping01,
				});
			}
		} else {
			return res.status(403).json({
				shipping: shiObj,
				error: true,
				response: lang[language].shipping02,
			});
		}

		return res
			.status(200)
			.json({ shipping: shiObj, error: false, response: "" });
	} catch (err) {
		next(err);
		/* console.log(err);
		return res.status(400).json({ error: true, response: "Processing error" }); */
	}
});

module.exports = router;
