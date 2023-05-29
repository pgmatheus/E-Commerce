import { Add, Delete, Remove } from "@material-ui/icons";
import { useSelector } from "react-redux";
import styled from "styled-components/macro";
import Announcement from "../components/Announcement";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { mobile, tablet } from "../responsive";
/* import StripeCheckout from "react-stripe-checkout"; */
import { useEffect, useState } from "react";
import { userRequest } from "../requestMethods";
import { useHistory } from "react-router";
import { useDispatch } from "react-redux";
import {
	removeProduct,
	removeUnit,
	addUnit,
	addCep,
	verifyProduct,
	removeCep,
} from "../redux/cartRedux";
import { publicRequest } from "../requestMethods";
import { keyframes, css } from "styled-components";
/* import useScript from "../library/pagseguro"; */
/* import { DirectPayment } from "pagseguro-react"; */
/* import pagseguro from "../library/pagseguro"; */

/* const KEY = process.env.REACT_APP_STRIPE; */

const Container = styled.div``;

const Wrapper = styled.div`
	padding: 20px;
	${mobile({ padding: "10px" })}
`;

const Title = styled.h1`
	font-weight: 300;
	text-align: center;
`;

const Top = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 20px;
`;

const TopButton = styled.button`
	padding: 10px;
	font-weight: 600;
	cursor: pointer;
	border: ${(props) => props.type === "filled" && "none"};
	background-color: ${(props) =>
		props.type === "filled" ? "black" : "transparent"};
	color: ${(props) => props.type === "filled" && "white"};
`;

const TopTexts = styled.div`
	${mobile({ display: "none" })}
`;
const TopText = styled.span`
	text-decoration: underline;
	cursor: pointer;
	margin: 0px 10px;
`;

const Bottom = styled.div`
	display: flex;
	justify-content: space-between;
	${mobile({ flexDirection: "column" })}
`;

const Info = styled.div`
	flex: 3;
	margin-right: 5px;
`;

const Product = styled.div`
	display: flex;
	justify-content: space-between;
	border: 1px solid lightgray;
	margin-bottom: 5px;
	${mobile({ flexDirection: "column" })}
`;

const ProductDetail = styled.div`
	flex: 2;
	display: flex;
	margin-bottom: 10px;
`;

const Image = styled.img`
	width: 200px;
	cursor: pointer;
`;

const Details = styled.div`
	padding: 20px;
	display: flex;
	flex-direction: column;
	justify-content: space-around;
`;

const ProductName = styled.span`
	cursor: pointer;
`;

const ProductId = styled.span``;

const ProductColorS = styled.div`
	width: 20px;
	height: 20px;
	border-radius: 50%;
	background-color: ${(props) => props.color};
	margin-left: 5px;
`;

const ProductSize = styled.span``;

const ProductColor = styled.div`
	display: flex;
`;

const PriceDetail = styled.div`
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
`;

const ProductAmountContainer = styled.div`
	display: flex;
	align-items: center;
	margin-bottom: 20px;
`;

const ProductAmount = styled.div`
	font-size: 24px;
	margin: 5px;
	${mobile({ margin: "5px 15px" })}
`;

const ProductPrice = styled.div`
	font-size: 30px;
	font-weight: 200;
	margin-bottom: 20px;
	${mobile({ marginBottom: "20px" })}
`;

const Hr = styled.hr`
	background-color: #eee;
	border: none;
	height: 1px;
`;

const Summary = styled.div`
	margin-bottom: 10px;
	border: 0.5px solid lightgray;
	border-radius: 10px;
	padding: 20px;
	height: auto;
`;

const SummaryTitle = styled.h1`
	font-weight: 200;
`;

const SummaryItem = styled.div`
	margin: 30px 0px;
	display: flex;
	justify-content: space-between;
	font-weight: ${(props) => props.type === "total" && "500"};
	font-size: ${(props) => props.type === "total" && "24px"};
`;

const SummaryItemText = styled.span``;

const SummaryItemPrice = styled.span``;

const Button = styled.button`
	width: 100%;
	padding: 10px;
	background-color: black;
	color: white;
	font-weight: 600;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	border-radius: 4px;
`;

const ButtonS = styled.button`
	width: 50px;
	padding: 10px;
	background-color: black;
	color: white;
	font-weight: 600;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	border-radius: 4px;
`;

const SummaryContainer = styled.div`
	flex: 1;
	${mobile({ marginTop: "10px" })};
`;

const Input = styled.input``;

const ChangeAdress = styled.span`
	color: blue;
	cursor: pointer;
	margin-top: 5px;
`;

const ShipContainer = styled.div`
	display: flex;
	flex-direction: column;
`;

const ShippingText = styled.span`
	margin: 5px 0px;
`;
const hourglass = keyframes`
  0% {
    transform: rotate(0);
    animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
  }
  50% {
    transform: rotate(900deg);
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }
  100% {
    transform: rotate(1800deg);
  }
`;

const Spinner = styled.div`
	display: inline-block;
	::after {
		content: " ";
		display: block;
		border-radius: 50%;
		width: 0;
		height: 0;
		// margin: 4px;
		box-sizing: border-box;
		border: 8px solid #fff;
		border-color: #fff transparent #fff transparent;
		animation: ${css`
			${hourglass} 1.2s infinite
		`};
	}
`;

const EmptCartContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 50vh;
`;

const EmptCartContainerTextH2 = styled.h2`
	margin-bottom: 10px;
`;
const EmptCartContainerTextP = styled.p`
	margin: 10px 0px;
`;

const ButtonImgCart = styled.button`
	margin-top: 10px;
	border-radius: 4px;
	width: 150px;
	height: 50px;
	background-color: #00fff2;
	cursor: pointer;
	:hover {
		background-color: #03e6da;
	}
`;

const ErrorInfo = styled.div`
	display: ${(props) => props.show === false && "none"};
`;

const Q = styled.div`
	background-color: black;
	width: 100px;
	height: 100px;
	cursor: pointer;
`;

const Cart = (props) => {
	const cart = useSelector((state) => state.cart);
	const user = useSelector((state) => state.user.currentUser);
	const shipping = useSelector((state) => state.cart.cep);
	/* const [stripeToken, setStripeToken] = useState(null); */
	const history = useHistory();
	const dispatch = useDispatch();
	// const [shipping,setShipping] = useState(undefined);
	const [shipFill, setShipFill] = useState("");
	const [errorShipRef, setErrorShipRef] = useState(false);
	const [loading, setLoading] = useState(false);
	const [loadingF, setLoadingF] = useState(false);
	const [shippingDate, setShippingDate] = useState("");
	const [pagseguroInfo, setPagseguroInfo] = useState({
		session: "",

		env: "sandbox",
		sender: {
			name: "Willy Chagas",
			email: "chagaswc89@gmail.com",
			phone: {
				areaCode: "48",
				number: "991510980",
			},
			document: {
				type: "CPF",
				value: "71783955082",
			},
		},

		shipping: {
			type: 3,
			cost: 10.0,
			street: "Av Campeche",
			number: 1111,
			complement: "Casa",
			district: "Campeche",
			city: "Florianópolis",
			state: "SC",
			country: "BRA",
			postalCode: "88063789",
		},

		billing: {
			street: "Av Campeche",
			number: 1111,
			complement: "Casa",
			district: "Campeche",
			city: "Florianópolis",
			state: "SC",
			country: "BRA",
			postalCode: "88063789",
		},

		items: [
			{
				id: 1,
				description: "Produto 1",
				quantity: 2,
				amount: 2,
			},
			{
				id: 2,
				description: "Produto 2",
				quantity: 1,
				amount: 60.0,
			},
			{
				id: 3,
				description: "Produto 3",
				quantity: 2,
				amount: 20.0,
			},
		],

		creditCard: {
			maxInstallmentNoInterest: 5, // parcelas com desconto
		},
		extraAmount: 10.0,
		reference: "Teste Pagseguro React",
	});
	const [paymentMethods, setPaymentMethods] = useState(undefined);
	const [hash, setHash] = useState(undefined);

	/* 	useEffect(() => {
		let loadScript = function (src) {
			let tag = document.createElement("script");
			tag.async = false;
			tag.src = src;
			let body = document.getElementsByTagName("body")[0];
			body.appendChild(tag);
		};

		loadScript(
			"https://stc.sandbox.pagseguro.uol.com.br/pagseguro/api/v2/checkout/pagseguro.directpayment.js"
		);
	}, []); */

	let redHist = (e) => history.push(e);

	const corrDate = (date, daysP) => {
		let cdate = new Date(date.setDate(date.getDate() + daysP));
		if (cdate.getDay() == 0) {
			return new Date(cdate.setDate(cdate.getDate() + 1));
		} else if (cdate.getDay() == 6) {
			return new Date(cdate.setDate(cdate.getDate() + 2));
		} else {
			return cdate;
		}
	};

	const monthNames = [
		"Janeiro",
		"Fevereiro",
		"Março",
		"Abril",
		"Maio",
		"Junho",
		"Julho",
		"Agosto",
		"Setembro",
		"Outubro",
		"Novembro",
		"Dezembro",
	];

	useEffect(() => {
		if (shipping) {
			if (shipping.pac) {
				let today = new Date();
				let cStartDayShipping = new Date(corrDate(today, 0).getTime());
				let cDayMinEndShipping = corrDate(
					new Date(cStartDayShipping.getTime()),
					parseInt(shipping.pac.PrazoEntrega) + 1
				);
				let cDayMaxEndShipping = corrDate(
					new Date(cStartDayShipping.getTime()),
					parseInt(shipping.pac.PrazoEntrega) + 4
				);

				setShippingDate(
					"Chegará " +
						"entre " +
						cDayMinEndShipping.getDate() +
						" de " +
						monthNames[cDayMinEndShipping.getMonth()] +
						" e " +
						cDayMaxEndShipping.getDate() +
						" de " +
						monthNames[cDayMaxEndShipping.getMonth()]
				);
			}
		}
	}, [shipping]);

	/* const onToken = (token) => {
		setStripeToken(token);
	}; */

	const handleFinish = async () => {
		if (!loadingF) {
			if (!user) {
				redHist("/login");
			} else {
				setLoadingF(true);
				let response = await handleVerify();

				if (response && response.product) {
					redHist("/checkout");
				}
			}
			setLoadingF(false);
		}
	};

	const fProduct = (product) => {
		if (product?.infoStock?.length > 0) {
			for (let i = 0; i < product.infoStock.length; i++) {
				if (
					product.infoStock[i].colorCode === product.color &&
					product.infoStock[i].size === product.size
				) {
					return i;
				}
			}
		}
	};

	const costShipping = () => {
		let onlyNumber = "";
		let onlyNumberArr;

		setLoading(true);

		if (shipFill) {
			onlyNumberArr = shipFill.match(/[0-9]+/g);

			for (let i = 0; i < onlyNumberArr.length; i++) {
				onlyNumber = onlyNumber.concat(onlyNumberArr[i]);
			}
		} else {
			onlyNumber = "";
		}

		if (onlyNumber.length == 8) {
			const getShippingCost = async () => {
				try {
					const res = await publicRequest.get("/postOffice/?cep=" + onlyNumber);
					if (!res.data.error) {
						// setShipping(res.data);
						dispatch(addCep(res.data));
						setLoading(false);
					} else {
						setErrorShipRef(true);
						setLoading(false);
					}
				} catch {
					setErrorShipRef(true);
					setLoading(false);
				}
			};
			getShippingCost();
		} else {
			setLoading(false);
			setErrorShipRef(true);
		}
	};

	const handleVerify = async () => {
		// let tempArr = [];

		if (cart && cart.products && cart.products.length > 0) {
			/* for (let i = 0; i < cart.products.length; i++) {
				tempArr.push({
					id: cart.products[i]._id,
					colorCode: cart.products[i].color,
					quantity: cart.products[i].quantity,
					size: cart.products[i].size,
					price: cart.products[i].price,
				});
			} */

			const verifyProducts = async () => {
				try {
					const res = await publicRequest.post(
						"/verifyproductandshipping/product",
						{ initArr: cart.products, shipping: shipping }
					);
					if (res.data.error === false) {
						dispatch(verifyProduct(res.data.product));
						dispatch(addCep(res.data.shipping));

						if (cart || shipping) {
						}
						return res.data;
						// setShipping(res.data);
						/* dispatch(addCep(res.data));
						setLoading(false); */
					}
				} catch (err) {
					/* setErrorShipRef(true);
					setLoading(false); */
				}
			};
			return verifyProducts();
		}
	};

	useEffect(() => {
		handleVerify();
	}, []);

	const changeQtdItem = (change, product, index) => {
		if (change == "minus") {
			if (product.quantity > 1) {
				dispatch(removeUnit({ product: product, index: index }));
			}
		} else {
			if (
				product.quantity &&
				product.infoStock[fProduct(product)].quantity > product.quantity
			)
				dispatch(addUnit({ product: product, index: index }));
		}
	};

	return (
		<Container>
			{/* <Q onClick={() => handlePayment()}></Q>
			{
				<DirectPayment
					env={pagseguroInfo.env}
					session={pagseguroInfo.session}
					extraAmount={pagseguroInfo.extraAmount}
					reference={pagseguroInfo.reference}
					creditCard={pagseguroInfo.creditCard}
					sender={pagseguroInfo.sender}
					shipping={pagseguroInfo.shipping}
					billing={pagseguroInfo.billing}
					items={pagseguroInfo.items}
				/>
			} */}

			<Announcement categoriesGet={props?.categoriesGet} />
			{cart && cart.products && cart.products.length == 0 ? (
				<Wrapper>
					<EmptCartContainer>
						<EmptCartContainerTextH2>
							Seu carrinho está vazio
						</EmptCartContainerTextH2>
						<EmptCartContainerTextP>
							{" "}
							Clique no botão abaixo para acessar as nossas ofertas
						</EmptCartContainerTextP>
						<ButtonImgCart onClick={() => redHist("/products")}>
							Acessar Ofertas
						</ButtonImgCart>
					</EmptCartContainer>
				</Wrapper>
			) : (
				<Wrapper>
					<Title>SEU CARRINHO</Title>
					<Top>
						<TopTexts>
							<TopText>Carrinho ({cart.products.length})</TopText>
						</TopTexts>
						<TopButton onClick={() => redHist("/products")} type="filled">
							VOLTAR AOS PRODUTOS
						</TopButton>
					</Top>
					<Bottom>
						<Info>
							{cart.products.map((product, i) => (
								<Product key={product._id + product.color + product.size}>
									<ProductDetail>
										<Image
											src={product.img[0]}
											onClick={() => redHist("/product/" + product._id)}
										/>
										<Details>
											<ProductName
												onClick={() => redHist("/product/" + product._id)}
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
										</Details>
									</ProductDetail>
									<PriceDetail>
										<ProductAmountContainer>
											<Add
												style={{ cursor: "pointer" }}
												onClick={() => changeQtdItem("plus", product, i)}
											/>
											<ProductAmount>{product.quantity}</ProductAmount>
											<Remove
												style={{ cursor: "pointer" }}
												onClick={() => changeQtdItem("minus", product, i)}
											/>
										</ProductAmountContainer>
										<ProductPrice>
											R$ {product.price * product.quantity}
										</ProductPrice>
										<Delete
											onClick={() =>
												dispatch(removeProduct({ product: product, index: i }))
											}
											style={{ cursor: "pointer", marginBottom: "20px" }}
										/>
									</PriceDetail>
								</Product>
							))}
							<Hr />
						</Info>
						<SummaryContainer>
							<Summary>
								<SummaryTitle>Frete</SummaryTitle>
								{shipping &&
								shipping.pac &&
								(shipping.pac.Erro == "0" ||
									shipping.pac.Erro == "10" ||
									shipping.pac.Erro == "11") &&
								shipping.cep.logradouro ? (
									<ShipContainer>
										<ShippingText style={{ marginTop: "15px" }}>
											R$ {shipping.pac.Valor}
										</ShippingText>
										<ShippingText>
											{shipping.cep.logradouro}; {shipping.cep.bairro};{" "}
											{shipping.cep.localidade}-{shipping.cep.uf}
										</ShippingText>
										<ShippingText>{shippingDate}</ShippingText>
										<ChangeAdress onClick={() => dispatch(removeCep())}>
											Alterar destino
										</ChangeAdress>
									</ShipContainer>
								) : (
									<ShipContainer>
										<ShippingText>Calcular Frete</ShippingText>
										<div style={{ display: "flex" }}>
											<Input
												onClick={() => setErrorShipRef(false)}
												onKeyDown={(e) => e.key == "Enter" && costShipping()}
												placeholder={"Insira o CEP"}
												value={shipFill}
												onChange={(e) => setShipFill(e.target.value)}
											/>
											<ButtonS onClick={() => costShipping()}>
												{loading ? <Spinner /> : <div>Usar</div>}
											</ButtonS>
										</div>
										<ErrorInfo show={errorShipRef}>CEP Inválido</ErrorInfo>
									</ShipContainer>
								)}
							</Summary>
							<Summary>
								<SummaryTitle>RESUMO COMPRA</SummaryTitle>

								<SummaryItem>
									<SummaryItemText>Subtotal</SummaryItemText>
									<SummaryItemPrice>
										R$ {cart.total.toFixed(2)}
									</SummaryItemPrice>
								</SummaryItem>
								<SummaryItem>
									<SummaryItemText>Frete</SummaryItemText>
									{shipping &&
									shipping.pac &&
									shipping.pac.Erro == "0" &&
									shipping.cep.logradouro ? (
										<div>
											<SummaryItemPrice>
												R$ {parseFloat(shipping?.pac?.Valor).toFixed(2)}
											</SummaryItemPrice>
										</div>
									) : (
										<SummaryItemPrice>-</SummaryItemPrice>
									)}
								</SummaryItem>
								<SummaryItem type="total">
									<SummaryItemText>Total</SummaryItemText>
									<SummaryItemPrice>
										R${" "}
										{(
											cart.total + (parseFloat(shipping?.pac?.Valor) || 0)
										).toFixed(2)}
									</SummaryItemPrice>
								</SummaryItem>
								<Button onClick={() => handleFinish()}>
									{loadingF ? <Spinner /> : <div>CONTINUAR COMPRA</div>}
								</Button>

								{/* <StripeCheckout
									name="Lama Shop"
									image="https://avatars.githubusercontent.com/u/1486366?v=4"
									billingAddress
									shippingAddress
									description={`Your total is $${cart.total}`}
									amount={cart.total * 100}
									token={onToken}
									stripeKey={KEY}
								>
									
								</StripeCheckout> */}
							</Summary>
						</SummaryContainer>
					</Bottom>
				</Wrapper>
			)}
			<Footer />
		</Container>
	);
};

export default Cart;
