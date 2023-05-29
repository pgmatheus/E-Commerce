const ReturnedValidData = require("../models/ReturnedValidData");
const User = require("../models/User");

const insertPurchaseUserArr = async (obj) => {
	try {
		// rastreio correios https://proxyapp.correios.com.br/v1/sro-rastro/ {código de rastreamento}
		let {
			verifiedPurchase,
			pagseguro,
			correios,
			code,
			email,
			pixValue,
			expirePurchase,
			shippingCode,
		} = obj;
		/* let tempArr = []; */
		let received = false;

		let user = await User.findOne({
			email: email || verifiedPurchase.payment.sender.email,
		});

		if (!user) {
			return { success: false, error: true, message: "user not found" };
		}

		if (!verifiedPurchase) {
			for (let i = 0; i < user.orders.length; i++) {
				if (user.orders[i].code === code) {
					/* verifiedPurchase = await ReturnedValidData.findOne({ code: code }); */
					verifiedPurchase = user.orders[i].info;
				}
			}
		}

		/* if (!verifiedPurchase) {
			return res
				.status(400)
				.json({ success: false, error: true, message: " purchase not found" });
		} */

		if (!verifiedPurchase) {
			return { success: false, error: true, message: "purchase not found" };
		}

		/* if (!code) {
			code = verifiedPurchase._id + "";
		} */

		/* let purchase = await ReturnedValidData.findOne({ _id: id }); */

		// Objeto entregue ao destinatário

		if (
			user.orders.filter((e) => e.info._id + "" === verifiedPurchase._id + "")
				.length === 0
		) {
			user.orders.unshift({
				_id: verifiedPurchase._id,
				method: verifiedPurchase.method,
				info: verifiedPurchase,
				/* pagseguro: [{ status: ["1"] }], */
				/* pagseguro: pagseguro
					? [pagseguro]
					: [{ status: ["1"], paymentLink: "" }], */
				correios: { codObjeto: "", eventos: [] },
				code: code,
				pixValue: pixValue || "",
				shippingCode: "",
				status: "Aguardando pagamento",
				mailSent: { status: "Aguardando pagamento", sent: false },
			});
		} else {
			for (let i = 0; i < user.orders.length; i++) {
				if (user.orders[i].info._id + "" === verifiedPurchase._id + "") {
					/* if (pagseguro) {
						user.orders[i].pagseguro.unshift(pagseguro);
					} */
					if (shippingCode) {
						user.orders[i].shippingCode = shippingCode;
					}
					if (correios?.objetos) {
						user.orders[i].correios = correios?.objetos[0] || {
							codObjeto: "",
							eventos: [],
						};

						if (
							correios?.objetos[0] &&
							correios?.objetos[0]?.eventos[0] &&
							correios?.objetos[0]?.eventos[0]?.status ===
								"Objeto entregue ao destinatário"
						) {
							user.orders[i].status = "Entregue";
							user.orders[i].mailSent = {
								status: "Entregue",
								sent: true,
							};
							received = true;
						} else {
							user.orders[i].status = "Pedido enviado";
							user.orders[i].mailSent = {
								status: "Pedido enviado",
								sent: true,
							};
						}
					}
					if (expirePurchase) {
						user.orders[i].status = "Compra expirada";
					}
					if (pixValue) {
						user.orders[i].pixValue = pixValue;
					}
				}
			}
		}

		user.markModified("orders");
		await user.save();
		return {
			success: true,
			error: false,
			message: "updated user",
			received: received,
		};

		/* if (arrShop){
			
		}
	
		[{arrShop: tObj, pagseguro: {status: '1'}, shippingStatus: {} ]; */
	} catch (err) {
		console.log(err);
		return { success: false, error: true, message: "error" };
	}
};

module.exports = insertPurchaseUserArr;
