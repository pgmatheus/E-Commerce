const User = require("../models/User");
const ChangePasswordToken = require("../models/ChangePasswordToken");
const {
	verifyToken,
	verifyTokenAndAuthorization,
	verifyTokenAndAdmin,
} = require("./verifyToken");
const CryptoJS = require("crypto-js");
const getAddress = require("../features/getAddress");
const { verifyInput } = require("../features/verifyInput");
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const schedule = require("node-schedule");
const shippingStatus = require("../features/shippingStatus");
const insertPurchaseUserArr = require("../features/insertPurchaseUserArr");
const tokenPassword = process.env.TOKEN_PASSWORD_KEY;
const nodemailerApp = require("../features/nodemailerApp");
const handleError = require("../features/handleError");

const orderEvents = [
	"Aguardando pagamento",
	"Expirado/Recusado",
	"Pago",
	"Pedido enviado",
	"Entregue",
	"Reembolsado",
	"Compra expirada",
];

//UPDATE

router.put(
	"/updatepaystatusandshippingcode",
	verifyTokenAndAdmin,
	async (req, res, next) => {
		try {
			const { email, payStatus, shippingCode, indexOrder } = req.body;

			let user = await User.findOne({ email: email });

			if (!user) {
				return res
					.status(400)
					.json({ success: false, message: "User not found" });
			}

			if (payStatus === "Pago") {
				if (user?.orders?.[indexOrder].status !== "Pago") {
					await nodemailerApp({
						from: "taliskafashion@taliskafashion.com.br",
						to: email,
						subject: "Taliska Fashion - Pagamento aprovado",
						content: {
							product: user.orders[indexOrder].info.product,
							sum: user.orders[indexOrder].info.sum,
							shipping: user.orders[indexOrder].info.shipping,
						},
						bcc: [
							"taliskafashion@taliskafashion.com.br",
							"pgmatheus@hotmail.com",
							"odontotaliska@hotmail.com",
						],
					});

					user.orders[indexOrder] = {
						...user.orders[indexOrder],
						mailSent: { status: "Pago", sent: true },
						status: "Pago",
					};
					user.markModified("orders");
					await user.save();
				}
			} else if (payStatus === "Pedido enviado" && shippingCode) {
				await nodemailerApp({
					from: "taliskafashion@taliskafashion.com.br",
					to: email,
					subject: "Taliska Fashion - Compra enviada",
					content: {
						product: user.orders[indexOrder].info.product,
						sum: user.orders[indexOrder].info.sum,
						shipping: user.orders[indexOrder].info.shipping,
						shippingCode: shippingCode,
					},
					bcc: "taliskafashion@taliskafashion.com.br",
				});

				const sStatus = await shippingStatus(shippingCode);

				if (sStatus) {
					await insertPurchaseUserArr({
						verifiedPurchase: user.orders[indexOrder].info,
						email: email,
						correios: { objetos: [sStatus.data] },
						shippingCode: shippingCode,
					});
				}
			} else {
				if (orderEvents.includes(payStatus)) {
					user.orders[indexOrder].status = payStatus;
				}
				if (shippingCode) {
					user.orders[indexOrder].shippingCode = shippingCode;
				}
				user.markModified("orders");
				await user.save();
			}

			return res.status(200).json({ success: true });
		} catch (err) {
			console.log(err);
			next(err);
		}
	}
);

router.put(
	"/updatepaymentmethod/:id",
	verifyTokenAndAuthorization,
	async (req, res, next) => {
		try {
			const { index, method } = req.body;

			if (method !== "pix" || method !== "boleto") {
				return res
					.status(400)
					.json({ success: false, message: "method not valid" });
			}

			const userInfo = await User.findOne({ _id: req.params.id });

			if (!userInfo) {
				return res
					.status(400)
					.json({ success: false, message: "user not found" });
			}

			userInfo.orders[index].method = method;
			userInfo.markModified("orders");
			await userInfo.save();

			return res.status(200).json({ success: true, message: "ok" });
		} catch (err) {
			next(err);
			/* console.log(err);
			return res.status(400).json("Requisição inválida"); */
		}
	}
);

router.put("/activateaccount", async (req, res, next) => {
	try {
		let { token } = req.body;

		if (!token) {
			return res.status(400).json({ success: false, message: "Invalid token" });
		}

		const user = User.findOne({ token });

		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid token" });
		}

		user.situation = "active";
		await user.save();

		return res
			.status(200)
			.json({ success: true, message: "Account activated" });
	} catch (err) {
		next(err);
	}
});

router.put("/:id", verifyTokenAndAuthorization, async (req, res, next) => {
	try {
		const userInfo = await User.findOne({ _id: req.params.id });

		if (!userInfo) {
			return res.status(400).json("Preenchimento Inválido");
		}

		let newUserInfo = {
			username: req.body.username || userInfo.username,
			password: /* req.body.password || */ userInfo.password,
			phone: req.body.phone || userInfo.phone,
			currentAddress: req.body.currentAddress || userInfo.currentAddress,
		};

		if (req.body?.adminId) {
			const adminInfo = await User.findOne({ _id: req.body.adminId });
			if (!adminInfo || adminInfo.isAdmin === false) {
				return res.status(400).json("You are not allowed to that");
			}

			newUserInfo = {
				...newUserInfo,
				email: req?.body?.email || userInfo.email,
			};
		}

		let inputV = await verifyInput(newUserInfo);

		if (!inputV) {
			return res.status(400).json("Preenchimento Inválido");
		}

		/* if (req.body.password) {
			let newEncrPass = CryptoJS.AES.encrypt(
				req.body.password,
				process.env.PASS_SEC
			).toString();
			newUserInfo = { ...newUserInfo, password: newEncrPass };
			
		} */

		/* 		if (!req.body.username) {
			req.body.username = userInfo.username;
		}
	
		if (!req.body.phone) {
			req.body.phone = userInfo.phone;
		}
	
		if (!req.body.currentAddress) {
			req.body.currentAddress = userInfo.currentAddress;
		}

		if (!req.body.currentAddress) {
			req.body.currentAddress = userInfo.currentAddress;
		}

		if (!req.body.currentAddress) {
			req.body.currentAddress = userInfo.currentAddress;
		}  */

		const updatedUser = await User.findByIdAndUpdate(
			req.params.id,
			{
				$set: newUserInfo,
			},
			{ new: true, runValidators: true }
		);

		if (!updatedUser) {
			return res.status(400).json("Preenchimento Inválido");
		}
		/* const {
				password,
				loginFailures,
				situation,
				isAdmin,
				loginAfter,
				createdAt,
				...others
			} = updatedUser._doc; */

		const { _id, username, email, phone, updatedAt, currentAddress } =
			updatedUser._doc;

		/* const accessToken = jwt.sign(
				{
					id: updatedUser._id,
					isAdmin: updatedUser.isAdmin,
				},
				process.env.JWT_SEC,
				{ expiresIn: "99999d" }
			); */

		return res.status(200).json({
			_id: _id,
			username: username,
			email: email,
			phone: phone,
			updatedAt: updatedAt,
			currentAddress: currentAddress,
		});
	} catch (err) {
		next(err);
		/* await handleError({
			err: err,
			req: req,
			res: res,
			mode: process.env.MODE,
		}); */
	}
});

//POST

router.post("/changepassword/", async (req, res, next) => {
	try {
		const { token, password1 } = req.body;

		if (!password1 || typeof password1 !== "string" || password1.length < 6) {
			return res
				.status(400)
				.json({ success: false, message: "Password curto" });
		}

		if (!token) {
			return res.status(400).json({ success: false, message: "Error" });
		}

		let tokenDb = await ChangePasswordToken.findOneAndDelete({ token: token });

		if (!tokenDb) {
			return res.status(400).json({ success: false, message: "Error" });
		}

		let email = tokenDb.email;

		let user = await User.findOne({ email });

		if (!user) {
			return res.status(400).json({ success: false, message: "Error" });
		}

		let password = CryptoJS.AES.encrypt(
			password1,
			process.env.PASS_SEC
		).toString();

		user.password = password;
		user.passChange = new Date();

		await user.save();

		return res
			.status(200)
			.json({ success: true, message: "Password atualizado" });
	} catch (err) {
		/* await handleError({
			err: err,
			req: req,
			res: res,
			mode: process.env.MODE,
		}); */
		next(err);
	}
});

router.post("/gettokenpassword/", async (req, res, next) => {
	try {
		const { email } = req.body;

		if (!email) {
			return res.status(200).json({
				message:
					"Caso o e-mail esteja cadastrado, enviaremos instruções de reset por e-mail",
			});
		}

		const user = await User.findOne({ email: email });

		let now = new Date().getTime();

		let sendEmailAfter = user?.emailSent?.getTime() || 91666959924373;

		if (!user || now < sendEmailAfter) {
			return res.status(200).json({
				message:
					"Caso o e-mail esteja cadastrado, enviaremos instruções de reset por e-mail",
			});
		}

		await ChangePasswordToken.findOneAndDelete({ email });

		let newToken = CryptoJS.AES.encrypt(email, tokenPassword).toString();

		newToken = newToken.replace(/[^a-z0-9]/gi, "");

		let savePasswordToken = new ChangePasswordToken({
			token: newToken,
			email: email,
		});

		await savePasswordToken.save();

		user.emailSent = new Date(now + 1000 * 60 * 5);

		await user.save();

		await nodemailerApp({
			from: "taliskafashion@taliskafashion.com.br",
			to: email,
			subject: "Taliska Fashion - Reset password",
			token: newToken,
			bcc: "taliskafashion@taliskafashion.com.br",
		});

		return res.status(200).json({
			message:
				"Caso o e-mail esteja cadastrado, enviaremos instruções de reset por e-mail",
		});
	} catch (err) {
		/* return res.status(400).json({ success: false, message: "Error" }); */
		next(err);
	}
});

router.post(
	"/gettokenpasswordlogged/:id",
	verifyTokenAndAuthorization,
	async (req, res, next) => {
		try {
			let userInfo = await User.findOne({ _id: req.params.id });

			if (!userInfo) {
				return res.status(400).json({
					success: false,
					message: "Usuário não encontrado",
				});
			}

			await ChangePasswordToken.findOneAndDelete({ email: userInfo.email });

			let newToken = CryptoJS.AES.encrypt(
				userInfo.email,
				tokenPassword
			).toString();

			newToken = newToken.replace(/[^a-z0-9]/gi, "");

			let savePasswordToken = new ChangePasswordToken({
				token: newToken,
				email: userInfo.email,
			});

			await savePasswordToken.save();

			return res.status(200).json({
				success: true,
				message: "OK",
				token: newToken,
			});
		} catch (err) {
			next(err);
			/* await handleError({
				err: err,
				req: req,
				res: res,
				mode: process.env.MODE,
			}); */
			/* return res.status(400).json({ success: false, message: "Error" }); */
		}
	}
);

//DELETE
router.delete("/:id", verifyTokenAndAuthorization, async (req, res, next) => {
	try {
		let override = CryptoJS.AES.encrypt(
			new Date().getTime().toString(),
			process.env.PASS_SEC
		).toString();

		let user = await User.findOne({ _id: req?.params?.id });

		user["username"] = override;
		user["email"] = override;
		user["password"] = override;
		user["phone"] = "(11)111111111";
		user["currentAddress"] = [];
		user["passChange"] = new Date();
		user["tokenActivation"] = [];

		await user.save();

		return res.status(200).json("User has been deleted...");
	} catch (err) {
		next(err);
		/* console.log(err);
		return res.status(500).json(err); */
	}
});

//GET USER
router.get("/find/:id", verifyTokenAndAdmin, async (req, res, next) => {
	try {
		const user = await User.findById(req.params.id);
		const { password, ...others } = user._doc;
		return res.status(200).json(others);
	} catch (err) {
		next(err);
		/* return res.status(500).json(err); */
	}
});

//GET ALL USER
router.get("/", verifyTokenAndAdmin, async (req, res, next) => {
	try {
		const query = req.query?.new;
		const users = query
			? await User.find().sort({ _id: -1 }).limit(5)
			: await User.find();
		return res.status(200).json(users);
	} catch (err) {
		next(err);
		/* return res.status(500).json(err); */
	}
});

//GET USER STATS

router.get("/stats", verifyTokenAndAdmin, async (req, res, next) => {
	try {
		const date = new Date();
		const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
		const data = await User.aggregate([
			{ $match: { createdAt: { $gte: lastYear } } },
			{
				$project: {
					month: { $month: "$createdAt" },
				},
			},
			{
				$group: {
					_id: "$month",
					total: { $sum: 1 },
				},
			},
		]);
		return res.status(200).json(data);
	} catch (err) {
		next(err);
		/* return res.status(500).json(err); */
	}
});

// Purchase

const statusListPag = {
	1: "Aguardando pagamento",
	2: "Em análise",
	3: "Paga",
	4: "Disponível",
	5: "Em disputa",
	6: "Devolvida",
	7: "Cancelada",
	8: "Debitado",
	9: "Retenção temporária",
};

const filterOrder = (order) => {
	let productArr = order.info?.product;
	let payMethod = order.info?.method;
	// let payArr = order.pagseguro[0];
	let correios = order.correios;
	let cInfo = order.cInfo?.creditC?.installment || undefined;
	let shippingInfo = order.info.shipping;
	let pixValue = order.pixValue;
	let productTempArr = [];
	/* let boletoLink = order?.pagseguro[0]?.paymentLink
		? order?.pagseguro[0]?.paymentLink[0]
		: undefined; */

	for (let i = 0; i < productArr.length; i++) {
		// product loop
		productTempArr.push({
			img: productArr[i].img[0],
			title: productArr[i].title,
			color: productArr[i].color,
			size: productArr[i].size,
			price: productArr[i].price,
			quantity: productArr[i].quantity,
		});
	}

	/* 	const getUsersShippingInfo = async () => {
		let allUsers = await User.find({});
		if (!allUsers) {
			return { success: false, error: true, message: "error accessing DB" };
		}
		for (let i = 0; i < allUsers.length; i++) {
			for (let j = 0; j < allUsers[i].orders.length; j++) {
				if (allUsers[i].orders[j].status === "Pedido enviado") {
					const status = await shippingStatus(
						allUsers[i].orders[j].shippingCode
					);
					("");
					if (!status) {
						return {
							success: false,
							error: true,
							message: "error getting data from Post Office DB",
						};
					}

					insertPurchaseUserArr({
						verifiedPurchase: allUsers[i].orders[j].info,
						email: allUsers[i].email,
						correios: { objetos: [status.data] },
					});
				}
			}
		}
	};

	getUsersShippingInfo(); */

	return {
		_id: order?._id + "",
		products: productTempArr,
		createdAt: productArr[0].createdAt,
		pixValue: pixValue,
		cInfo: cInfo,
		pdfBoleto: order?.pdfBoleto,
		numberBoleto: order?.numberBoleto,
		correios: correios,
		shippingInfo: shippingInfo,
		method: order?.method,
		status: order?.status,
		sum: order?.info?.sum || undefined,
		shippingCode: order?.shippingCode,
		clientSecret: order?.info?.clientSecret,
	};
};

router.get(
	"/purchases/:id",
	verifyTokenAndAuthorization,
	async (req, res, next) => {
		try {
			const user = await User.findById(req.params.id);
			let filteredArr = [];

			if (!user) {
				return res
					.status(400)
					.json({ error: true, success: false, message: "User not found" });
			}

			if (!user.orders || !user.orders.length) {
				return res.status(400).json({
					error: true,
					success: false,
					message: "User does not have orders",
				});
			}

			for (let i = 0; i < user.orders.length; i++) {
				filteredArr.push(filterOrder(user.orders[i]));
			}

			return res
				.status(200)
				.json({ success: true, error: false, value: filteredArr });
		} catch (err) {
			next(err);
			/* console.error(err);
		return res
			.status(400)
			.json({ success: false, error: true, message: "error" }); */
		}
	}
);

const stat = [
	"Aguardando pagamento",
	"Pagamento Confirmado",
	"Pedido enviado",
	"Recebido",
];

const job = schedule.scheduleJob({ hour: 14, minute: 21 }, async function () {
	try {
		let date = new Date().getTime();

		let allUsers = await User.find({});
		if (!allUsers) {
			return { success: false, error: true, message: "error accessing DB" };
		}
		for (let i = 0; i < allUsers.length; i++) {
			for (let j = 0; j < allUsers[i].orders.length; j++) {
				if (
					allUsers[i].orders[j].status === "Pedido enviado" &&
					allUsers[i].orders[j].shippingCode
				) {
					const status = await shippingStatus(
						allUsers[i].orders[j].shippingCode
					);
					("");

					if (status) {
						let received = await insertPurchaseUserArr({
							verifiedPurchase: allUsers[i].orders[j].info,
							email: allUsers[i].email,
							correios: { objetos: [status.data] },
						});

						if (received.received === true) {
							await nodemailerApp({
								to: allUsers[i].email,
								subject: "Taliska Fashion - Compra recebida",
								content: {
									product: allUsers[i].orders[j].info.product,
									sum: allUsers[i].orders[j].info.sum,
									shipping: allUsers[i].orders[j].info.shipping,
									shippingCode: allUsers[i].orders[j].shippingCode,
								},
								from: "taliskafashion@taliskafashion.com.br",
								bcc: "taliskafashion@taliskafashion.com.br",
							});
						}
					}
				} else if (
					allUsers[i].orders[j].status === "Aguardando pagamento" &&
					allUsers[i].orders[j].info.createdAt.getTime() +
						1000 * 60 * 60 * 24 * 12 <
						date
				) {
					await insertPurchaseUserArr({
						verifiedPurchase: allUsers[i].orders[j].info,
						email: allUsers[i].email,
						expirePurchase: true,
					});
				}
			}
		}
		console.log("The answer to life, the universe, and everything!");
	} catch (err) {
		console.log(err);
	}
});

module.exports = router;
