import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import "./Stripe.css";

const key = process.env.REACT_APP_STRIPE;

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is a public sample test API key.
// Don’t submit any personally identifiable information in requests made with this key.
// Sign in to see your own test API key embedded in code samples.
/* const stripePromise = loadStripe("pk_test_XKUpwPvvEnNxMsSzoLm8H3i8"); */

const stripePromise = loadStripe(key);

export default function Stripe(props) {
	const [clientSecret, setClientSecret] = useState(props?.clientKey || "");

	/* useEffect(() => {
		// Create PaymentIntent as soon as the page loads
		fetch("/create-payment-intent", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ items: [{ id: "xl-tshirt" }] }),
		})
			.then((res) => res.json())
			.then((data) => setClientSecret(data.clientSecret));
	}, []);

	
 */

	let appearance = {
		theme: "stripe",
	};

	let options = {
		clientSecret,
		appearance,
	};

	return (
		<div
			style={{
				padding: "25px",
			}}
			className="Stripe"
		>
			<Elements stripe={stripePromise} options={options}>
				<CheckoutForm purchasePage={props?.purchasePage || false} />
			</Elements>

			{/* {clientSecret && (
				<Elements options={options} stripe={stripePromise}>
					<CheckoutForm />
				</Elements>
			)} */}
		</div>
	);
}
