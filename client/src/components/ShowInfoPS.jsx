import styled from "styled-components/macro";
import { useSelector } from "react-redux";
import {
	Product,
	ProductDetail,
	Details,
	ProductName,
	ProductColor,
	ProductSize,
	PriceDetail,
	ProductAmountContainer,
	ProductPrice,
	ProductAmount,
	Info,
	Image,
	ProductColorS,
	SummaryTitle,
	ShipContainer,
	Container,
} from "../styledComponents/css";
import { shippingDelivery } from "../features/shippingDelivery";

const TitleContainer = styled.div`
	margin: 10px 0px;
`;

const Summary = styled.div`
	margin-bottom: 10px;
	border: 0.5px solid lightgray;
	border-radius: 10px;
	padding: 20px;
	height: auto;
`;

const ShippingText = styled.p`
	margin-bottom: 10px;
`;

const ShowInfoPS = (props) => {
	const strPay = ["Pix", "Pix", "Outros"];

	const shipping = props.returnedValidData.shipping || undefined;
	const cart = props.returnedValidData.product || undefined;
	const sum = props.returnedValidData.sum || undefined;
	const method = props.returnedValidData.method || undefined;
	const installmentsP =
		props?.returnedValidData?.cInfo?.creditC?.installment?.quantity ||
		undefined;
	const installmentsV =
		props?.returnedValidData?.cInfo?.creditC?.installment?.value || undefined;

	return (
		<Container>
			{props && props.returnedValidData !== {} && <div></div>}
			<TitleContainer>
				<h2 style={{ textAlign: "center" }}>Resumo da Compra</h2>
			</TitleContainer>

			<Summary>
				<SummaryTitle style={{ marginBottom: "15px" }}>Entrega</SummaryTitle>
				{shipping && (
					<ShipContainer>
						<ShippingText>CEP: {shipping?.cep?.cep}</ShippingText>

						<ShippingText>
							Endereço:{" "}
							{/* Rua João Mendes da Costa Filho; Armação; Salvador-BA */}
							{shipping?.cep?.logradouro}; {shipping?.cep?.bairro};{" "}
							{shipping?.cep?.localidade}-{shipping?.cep?.uf}
						</ShippingText>

						<ShippingText>Número: {shipping?.cep?.number}</ShippingText>
						<ShippingText>Compl: {shipping?.cep?.compl}</ShippingText>

						<ShippingText>{shippingDelivery(shipping)?.value}</ShippingText>

						<ShippingText>
							Valor: R$ {shipping?.pac?.Valor}
							{/* R$ {shipping.pac.Valor} */}
						</ShippingText>
					</ShipContainer>
				)}
			</Summary>

			{cart && (
				<Info>
					{cart.map((product, i) => (
						<Product key={product._id + product.color + product.size}>
							<ProductDetail>
								<Image
									src={product.img[0]}
									/* onClick={() => redHist("/product/" + product._id)} */
								/>
								<Details>
									<ProductName /* onClick={() => redHist("/product/" + product._id)} */
									>
										<b>Produto:</b> {product.title}
									</ProductName>
									<ProductColor>
										<b>Cor principal:</b>
										<ProductColorS color={product.color} />
									</ProductColor>
									<ProductSize>
										<b>Tamanho:</b> {product.size}
									</ProductSize>
									<ProductSize>
										<b>Quantidade:</b> {product.quantity}
									</ProductSize>
									<ProductSize>
										<b>Preço Unitário:</b> R$ {product.price}
									</ProductSize>
								</Details>
							</ProductDetail>
						</Product>
					))}
				</Info>
			)}

			<Summary>
				<SummaryTitle style={{ marginBottom: "15px" }}>Pagamento</SummaryTitle>
				<ShippingText>Método: {strPay[props?.method]}</ShippingText>
				{/* {method && method !== "creditCard" ? ( */}
				<ShippingText>Total: R$ {sum.toFixed(2) || ""} </ShippingText>
				{/* ) : ( */}
				{/* <>
						<ShippingText>
							Parcela(s): {installmentsP || ""}x de R$ {installmentsV || ""}
						</ShippingText>
						<ShippingText>Total: R$ {sum.toFixed(2) || ""}</ShippingText>
					</> */}
				{/* )} */}

				<ShippingText></ShippingText>
			</Summary>
		</Container>
	);
};

export default ShowInfoPS;
