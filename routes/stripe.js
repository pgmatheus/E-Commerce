const router = require("express").Router();
const express = require("express");
// const stripe = require("stripe")(process.env.STRIPE_KEY);
const KEY = process.env.STRIPE_KEY;
const stripe = require("stripe");
const User = require("../models/User");
const nodemailerApp = require("../features/nodemailerApp");

const endpointSecret = process.env.STRIPE_WEB;
const orderEvents = [
	"Aguardando pagamento",
	"Expirado/Recusado",
	"Pago",
	"Pedido enviado",
	"Entregue",
	"Reembolsado",
	"Compra expirada",
];

//#region

//#endregion

const verifyOrder = (orderNew, orderOld) => {
	try {
		// Verify order events
		let indexNewEvent;
		let indexOldEvent;

		for (let i = 0; i < orderEvents.length; i++) {
			if (orderNew === orderEvents[i]) {
				indexNewEvent = i;
			}
			if (orderOld === orderEvents[i]) {
				indexOldEvent = i;
			}
		}

		if (indexNewEvent > indexOldEvent) {
			return { success: true };
		} else {
			return { success: false };
		}
	} catch (err) {
		console.log(err);
	}
};

const findPurchase = async (event, updatedStatus) => {
	try {
		let email = event.data.object.description;
		let clientKey =
			event?.data?.object?.payment_intent || event?.data?.object?.id;
		let boletoInfo = {};
		let mod = false;

		/* console.dir(event, { depth: null }); */

		let paymentTypeCompletedTr =
			event?.data?.object?.payment_method_details?.type ||
			event?.data?.object?.charges?.data[0]?.payment_method_details?.type;

		if (event.data?.object?.next_action?.boleto_display_details) {
			boletoInfo.pdfBoleto =
				event.data?.object?.next_action.boleto_display_details.hosted_voucher_url;
			boletoInfo.numberBoleto =
				event.data?.object?.next_action.boleto_display_details.number;
		}

		const user = await User.findOne({ email: email });

		if (!user) {
			return { success: false, error: true, message: "User not found" };
		}

		let orders = user.orders;
		let index;

		for (let i = 0; i < orders.length; i++) {
			if (orders[i].info.clientKey === clientKey) {
				index = i;
			}
		}

		if (index !== undefined) {
			let verifyOrderUpdate = verifyOrder(
				updatedStatus,
				user.orders[index].status
			);

			if (boletoInfo?.pdfBoleto) {
				user.orders[index] = {
					...user.orders[index],
					pdfBoleto: boletoInfo.pdfBoleto,
					numberBoleto: boletoInfo.numberBoleto,
					method: "boleto",
				};
				mod = true;
			}

			if (verifyOrderUpdate?.success) {
				user.orders[index] = {
					...user.orders[index],
					status: updatedStatus,
				};
				mod = true;
			}

			if (paymentTypeCompletedTr) {
				user.orders[index] = {
					...user.orders[index],
					method: paymentTypeCompletedTr,
				};
				mod = true;
			}

			if (updatedStatus === "Pago") {
				await nodemailerApp({
					from: "taliskafashion@taliskafashion.com.br",
					to: email,
					subject: "Taliska Fashion - Pagamento aprovado",
					content: {
						product: user.orders[index].info.product,
						sum: user.orders[index].info.sum,
						shipping: user.orders[index].info.shipping,
					},
					bcc: [
						"taliskafashion@taliskafashion.com.br",
						"pgmatheus@hotmail.com",
						"odontotaliska@hotmail.com",
					],
				});

				user.orders[index] = {
					...user.orders[index],
					mailSent: { status: "Pago", sent: true },
				};
				mod = true;
			}

			if (updatedStatus === "Aguardando pagamento") {
				await nodemailerApp({
					from: "taliskafashion@taliskafashion.com.br",
					to: email,
					subject: "Taliska Fashion - Compra processada",
					content: {
						product: user.orders[index].info.product,
						sum: user.orders[index].info.sum,
						shipping: user.orders[index].info.shipping,
					},
					bcc: "taliskafashion@taliskafashion.com.br",
				});

				user.orders[index] = {
					...user.orders[index],
					mailSent: { status: "Aguardando pagamento", sent: true },
				};
				mod = true;
			}

			if (mod) {
				user.markModified("orders");
				await user.save();
			}

			return { success: true, error: false, message: "updated user" };
		}

		return { success: false, error: true, message: "Order not found" };
	} catch (err) {
		console.log(err);
	}
};

router.post(
	"/stripewebhook",
	express.raw({ type: "application/json" }),
	async (req, res, next) => {
		try {
			const sig = req.headers["stripe-signature"];
			let event;
			let index;

			event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);

			/* console.dir(event, { depth: null }); */

			/* console.log(event); */

			/* if (event.) */

			// example creditCard with error 4000 0000 0000 4954

			switch (event.type) {
				case "charge.succeeded":
					index = await findPurchase(event, "Pago");
					break;
				/*case "charge.refunded":
					 index = await findPurchase(event, "Reembolsado");
					
					break; 
				*/
				case "payment_intent.payment_failed":
					index = await findPurchase(event, "Expirado");
					break;
				case "payment_intent.requires_action":
					index = await findPurchase(event, "Aguardando pagamento");
					break;
				case "charge.refunded":
					index = await findPurchase(event, "Reembolsado");
					break;
				default:
					return res
						.status(200)
						.json({ success: true, error: false, message: "success" });
			}

			if (!index || !index?.success) {
				return res
					.status(400)
					.json({ success: false, error: true, message: "User not updated" });
			} else {
				return res
					.status(200)
					.json({ success: true, error: false, message: "success" });
			}
		} catch (err) {
			next(err);
			/* return res.status(400).send(`Webhook Error: ${err.message}`); */
		}

		// Handle the event
	}
);

module.exports = router;
