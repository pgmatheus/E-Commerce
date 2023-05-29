import React, { useEffect, useState } from "react";
import styled from "styled-components/macro";
import {
	PaymentElement,
	useStripe,
	useElements,
} from "@stripe/react-stripe-js";
import { Spinner } from "../../styledComponents/css";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useHistory } from "react-router";

const Button = styled.button`
	margin: 0px auto;
	width: 125px;
	border: none;
	padding: 15px 20px;
	background-color: #4bb543;
	color: white;
	border-radius: 4px;
	cursor: pointer;
`;

const ProcessedContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
`;

const ProcessedH1 = styled.h1`
	/* margin-top: -10px; */
	/* margin-bottom: 15px; */
`;

const ProcessedP = styled.p`
	margin-top: 10px;
	margin-bottom: 15px;
`;

export default function CheckoutForm(props) {
	const stripe = useStripe();
	const elements = useElements();
	const [message, setMessage] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [paymentProcessed, setPaymentProcessed] = useState(false);
	const history = useHistory();
	let redHist = (e) => history.push(e);

	useEffect(() => {
		setTimeout(() => {
			setIsLoading(false);
		}, 5000);
	}, []);

	useEffect(() => {
		if (!stripe) {
			return;
		}

		const clientSecret = new URLSearchParams(window.location.search).get(
			"payment_intent_client_secret"
		);

		if (!clientSecret) {
			return;
		}

		stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
			switch (paymentIntent.status) {
				case "succeeded":
					setMessage("Pagamento Realizado!");
					break;
				case "processing":
					setMessage("Processando pagamento...");
					break;
				case "requires_payment_method":
					setMessage("Pagamento sem sucesso, por favor, tente novamente.");
					break;
				default:
					setMessage("Algo deu errado.");
					break;
			}
		});
	}, [stripe]);

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!stripe || !elements || isLoading) {
			// Stripe.js has not yet loaded.
			// Make sure to disable form submission until Stripe.js has loaded.
			return;
		}

		setIsLoading(true);

		const { error } = await stripe.confirmPayment({
			elements,
			confirmParams: {
				// Make sure to change this to your payment completion page
				return_url: "http://localhost:3000", // inserir
			},
			redirect: "if_required",
		});

		// This point will only be reached if there is an immediate error when
		// confirming the payment. Otherwise, your customer will be redirected to
		// your `return_url`. For some payment methods like iDEAL, your customer will
		// be redirected to an intermediate site first to authorize the payment, then
		// redirected to the `return_url`.

		if (error /* === "card_error" || error.type === "validation_error" */) {
			setMessage(error?.message);
		} else {
			setMessage("Pagamento Processado");
			setPaymentProcessed(true);
		}
		setIsLoading(false);
	};

	return (
		<>
			{paymentProcessed ? (
				<ProcessedContainer>
					<div
						style={{
							marginTop: "-5px",
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						<ProcessedH1>Compra processada</ProcessedH1>
						<CheckCircleIcon
							style={{ fontSize: "40px", marginLeft: "5px", color: "#03dcd1" }}
						/>
					</div>
					{props?.purchasePage ? (
						<ProcessedP>
							Informações atualizadas! Atualize a página para obter os dados.
						</ProcessedP>
					) : (
						<>
							<ProcessedP>
								Você pode acessar os detalhes em meus pedidos
							</ProcessedP>
							<Button
								onClick={() => redHist("/purchases")}
								style={{ backgroundColor: "#03dcd1" }}
							>
								Meus pedidos
							</Button>
						</>
					)}
				</ProcessedContainer>
			) : (
				<form
					style={{
						display: "flex",
						flexDirection: "column",
					}}
					id="payment-form"
					onSubmit={handleSubmit}
				>
					<PaymentElement id="payment-element" />
					<Button disabled={isLoading || !stripe || !elements} id="submit">
						<span id="button-text">
							{isLoading ? (
								<Spinner
									custom={{ size: "6px" }}
									className="spinner"
									id="spinner"
								></Spinner>
							) : (
								"Pagar"
							)}
						</span>
					</Button>
					{/* Show any error or success messages */}
					{message && (
						<div style={{ textAlign: "center" }} id="payment-message">
							{message}
						</div>
					)}
				</form>
			)}
		</>
	);
}
