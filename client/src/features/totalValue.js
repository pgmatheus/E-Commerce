import { ProductionQuantityLimits } from "@mui/icons-material";

export const totalValue = (productsAndShipping) => {
	const { product, shipping } = productsAndShipping;
	let sum = 0;

	for (let i = 0; i < product.length; i++) {
		sum += product[i].price * product[i].quantity;
	}
	sum += parseFloat(shipping.pac.Valor);

	return sum;
};
