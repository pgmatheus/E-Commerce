import styled from "styled-components/macro";
import { months } from "../utilities/months";
import { useEffect, useState } from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { mobile, tablet } from "../responsive";
import Stripe from "../components/stripe/Stripe";
import PixIcon from "@mui/icons-material/Pix";
import ReceiptIcon from "@mui/icons-material/Receipt";
import QRCodeFull from "../components/QrCodeFull";
import { userRequest } from "../requestMethods";
import { useSelector } from "react-redux";

const Container = styled.div``;

const Wrapper = styled.div`
	border-radius: 4px;
	background-color: #f5f1f0;
`;

const Info = styled.div`
	flex: 3;
`;

const HeaderText = styled.h3`
	text-align: left;
	margin: 10px;
`;

const HeaderTextP = styled.p`
	color: ${(props) => {
		if (props.color === "Aguardando pagamento") {
			return "black";
		} else if (
			props.color === "Pago" ||
			props.color === "Entregue" ||
			props.color === "Pedido enviado"
		) {
			return "#6cc070";
		} else {
			return "#f32013";
		}
	}};
`;

const Product = styled.div`
	display: flex;
	justify-content: space-between;
	border-bottom: 1px solid rgba(0, 0, 0, 0.1);
	height: fit-content;
`;

const ProductDetail = styled.div`
	flex: 2;
	display: flex;
	/* margin-bottom: 10px; */
`;

const Image = styled.img`
	width: 100px;
`;

const Details = styled.div`
	padding: 20px;
	display: flex;
	flex-direction: column;
	justify-content: space-around;
`;

const ProductName = styled.span``;

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

const Hr = styled.hr`
	background-color: #eee;
	/* border: none;
	height: 1px; */
`;

const Header = styled.div`
	background-color: #f5e8e4;
	display: flex;
	align-items: center;
	justify-content: left;
	border-bottom: 1px solid rgba(0, 0, 0, 0.1);
`;

const ShowHideContainer = styled.div`
	background-color: #f5e8e4;
	display: flex;
	align-items: center;
	justify-content: right;
	cursor: pointer;
`;

const HiddenContainer = styled.div`
	display: flex;
	${mobile({ flexDirection: "column" })};
	${tablet({ flexDirection: "column" })};
`;

const Summary = styled.div`
	flex: 2;
	padding: 20px 50px;
	/* width: 500px; */
	/* margin-bottom: 10px; */
	border: 0.5px solid lightgray;
	/* padding: ${(props) => (props.padding === true ? "20px 80px" : "20px")};
	${tablet({ padding: "20px" })}
	${mobile({ padding: "20px" })} */
`;

const SummaryTitle = styled.h1`
	text-align: center;
	font-weight: 200;
`;

const SummaryItem = styled.div`
	margin: 20px 0px 0px 0px;
	display: flex;
	justify-content: space-between;
	font-weight: ${(props) => props.type === "total" && "500"};
	font-size: ${(props) => props.type === "total" && "24px"};
`;

const SummaryItemText = styled.span``;

const SummaryItemPrice = styled.span``;

const SumaryProductListContainer = styled.div`
	display: flex;
	flex-direction: column;
`;

const SumaryProductList = styled.span`
	text-align: right;
`;

const ShippingInfoContainer = styled.div`
	display: flex;
	flex-direction: column;
`;

const InfoQuery = styled.div`
	margin-top: 15px;
`;

const LeftInfoText = styled.p`
	margin: 15px 0px 5px 0px;
`;

const RightInfoText = styled.p``;

const ModifyContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
`;

const Button = styled.button`
	margin: 10px;
	border-radius: 4px;
	width: 150px;
	height: 50px;
	background-color: white;
	cursor: pointer;
`;

const PayMethodContainer = styled.div`
	display: flex;
	height: 100px;
	/* margin-bottom: 10px; */
`;

const PayMethod = styled.div`
	box-sizing: border-box;
	width: calc(100% / 2);
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	/* cursor: pointer; */
	background-color: ${(props) => props.number !== props.ch && "#ddc5b1"};
`;

const PayMethodInside = styled.div`
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
`;

const BoletoA = styled.a`
	text-decoration: none !important;
`;

const Purchase = (props) => {
	const user = useSelector((state) => state.user.currentUser);
	const [moreInfo, setMoreInfo] = useState(false);
	const [showOthers, setShowOthers] = useState(false);
	const [showPdf, setShowPdf] = useState(false);
	const [showPayments, setShowPayments] = useState(false);
	const [subtotal, setSubtotal] = useState("");
	const [address, setAddress] = useState(
		props?.orders?.shippingInfo?.cep
			? props?.orders?.shippingInfo?.cep
			: undefined
	);
	const [payMethod, setPayMethod] = useState(props?.orders?.method || "");

	const methodMod = {
		card: "cartão",
		pix: "pix",
		boleto: "boleto",
	};

	useEffect(() => {
		let sum = 0;
		if (props?.orders?.products) {
			for (let i = 0; i < props.orders.products.length; i++) {
				sum +=
					props.orders.products[i].price * props.orders.products[i].quantity;
			}
		}
		setSubtotal(sum.toFixed(2).toString().replace(".", ","));
	}, [props?.orders?.products]);

	/* const status = () => {
		if (!props) {
			return "";
		}
	}; */

	const day = props?.orders?.createdAt
		? new Date(props?.orders?.createdAt).getDate()
		: "";
	const month = props?.orders?.createdAt
		? new Date(props?.orders?.createdAt).getMonth()
		: "";
	const year = props?.orders?.createdAt
		? new Date(props?.orders?.createdAt).getFullYear()
		: "";

	const handleChangePagePix = () => {
		setShowPdf(true);
		setShowPayments(false);
		setShowOthers(false);
	};

	const handleClose = () => {
		setShowPdf(false);
		setShowPayments(false);
		setShowOthers(false);
	};

	const handlePix = () => {
		setShowPdf(true);
		setShowPayments(false);
		setShowOthers(false);
		setPayMethod("pix");
		updateDB("pix");
	};

	const updateDB = async (method) => {
		try {
			const res = await userRequest({ token: user?.accessToken || "" }).put(
				`/users/updatepaymentmethod/${user._id}`,
				{
					index: props?.numberOrder,
					method: method,
				}
			);
		} catch (e) {}
	};

	const handleOthers = () => {
		setShowPdf(false);
		setShowPayments(false);
		setShowOthers(true);
	};

	const handleBoleto = () => {
		setPayMethod("boleto");
		updateDB("boleto");
		handleClose();
	};

	return (
		<Container>
			{props?.orders && (
				<Wrapper>
					<Header>
						{/* <HeaderText>
							{day?.length > 1 ? day : "0" + day}
							{" de "}
							{month ? months[month] : ""} {"de"} {year}
						</HeaderText>
						<HeaderText>Pagamento:</HeaderText> */}
						<HeaderText>Status:</HeaderText>
						<HeaderTextP color={props?.orders?.status}>
							{props?.orders?.status} - {methodMod[payMethod]}
						</HeaderTextP>
					</Header>

					<Info>
						{props?.orders?.products?.map((product, i) => (
							<Product key={product.title + product.color + product.size}>
								<ProductDetail>
									<Image src={product.img} />
									<Details>
										<ProductName>
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
									</Details>
								</ProductDetail>
							</Product>
						))}
						{/* 	<Hr /> */}
					</Info>
					{props?.orders?.status === "Aguardando pagamento" && (
						<>
							{showPayments === false &&
								showPdf === false &&
								showOthers === false && (
									<ModifyContainer>
										<Button onClick={() => setShowPayments(true)}>
											Modificar método de pagamento
										</Button>
										{payMethod === "boleto" && (
											<BoletoA
												href={
													payMethod === "boleto" ? props?.orders?.pdfBoleto : ""
												}
												target="_blank"
												onClick={() => handleClose()}
											>
												<Button>Acessar PDF/Código para pagamento</Button>
											</BoletoA>
										)}
										{payMethod === "pix" && (
											<Button onClick={() => handleChangePagePix()}>
												Acessar PDF/Código para pagamento
											</Button>
										)}
									</ModifyContainer>
								)}

							{showPayments === true &&
								showPdf === false &&
								showOthers === false && (
									<PayMethodContainer>
										<PayMethod /* number={0} ch={payM} onClick={() => setPayM(0)} */
										/* onClick={() =>
												handlePix()
											} */
										>
											<PayMethodInside
												onClick={() => handlePix()}
												/* style={{ cursor: "pointer" }} */
											>
												<PixIcon style={{ marginBottom: "5px" }} />
												<p>PIX</p>
											</PayMethodInside>
										</PayMethod>
										<PayMethod /* number={2} ch={payM} onClick={() => setPayM(2)} */
										/* onClick={() =>
												handleOthers()
											} */
										>
											{props?.orders?.pdfBoleto ? (
												<BoletoA
													href={props?.orders?.pdfBoleto}
													target="_blank"
													onClick={() => handleBoleto()}
												>
													<PayMethodInside
														style={{
															textDecoration: "none",
														}}
													>
														<ReceiptIcon
															style={{
																marginBottom: "5px",
																textDecoration: "none",
															}}
														/>
														<p>Boleto</p>
													</PayMethodInside>
												</BoletoA>
											) : (
												<PayMethodInside
													/* style={{ cursor: "pointer", display: flex }} */
													onClick={() => handleOthers()}
												>
													<ReceiptIcon style={{ marginBottom: "5px" }} />
													<p>Outros</p>
												</PayMethodInside>
											)}
										</PayMethod>
									</PayMethodContainer>
								)}
							{showPayments === false &&
								showPdf === true &&
								showOthers === false &&
								payMethod === "pix" && (
									<div
										style={{
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											flexDirection: "column",
										}}
									>
										<div
											style={{
												maxWidth: "400px",
												/* marginBottom: "15px", */
											}}
										>
											<QRCodeFull
												pixValue={props?.orders?.pixValue}
												info={props?.orders}
											></QRCodeFull>
										</div>
										<Button
											onClick={() => handleClose()}
											style={{ marginBottom: "15px" }}
										>
											Fechar
										</Button>
									</div>
								)}
							{showPayments === false &&
								showPdf === false &&
								showOthers === true && (
									<div>
										<Stripe
											purchasePage={true}
											clientKey={props?.orders?.clientSecret}
										/>
									</div>
								)}
						</>
					)}
					<ShowHideContainer onClick={() => setMoreInfo(!moreInfo)}>
						{!moreInfo && (
							<>
								<p>Expandir detalhes da compra</p>
								<ArrowDropDownIcon></ArrowDropDownIcon>
							</>
						)}
						{moreInfo && (
							<>
								<p>Esconder detalhes da compra</p>
								<ArrowDropUpIcon></ArrowDropUpIcon>
							</>
						)}
					</ShowHideContainer>
					{moreInfo && (
						<HiddenContainer>
							<Summary padding={true}>
								<SummaryTitle>RESUMO COMPRA</SummaryTitle>

								<SummaryItem style={{ margin: "20px 0px 10px 0px" }}>
									<SummaryItemText>
										{day?.length > 1 ? day : "0" + day}
										{" de "}
										{month ? months[month] : ""} {"de"} {year}
									</SummaryItemText>
									<SummaryItemPrice></SummaryItemPrice>
								</SummaryItem>

								<SummaryItem style={{ margin: "20px 0px 0px 0px" }}>
									<SummaryItemText>Items</SummaryItemText>
									<SummaryItemPrice></SummaryItemPrice>
								</SummaryItem>

								{props?.orders?.products?.map((product, i) => (
									<SummaryItem
										style={{ margin: "0px 0px 0px 0px" }}
										key={product.title + i}
									>
										<SummaryItemText>{product.title}</SummaryItemText>
										<SummaryItemPrice>
											{product.quantity}xR$
											{product.price.toString().replace(".", ",")}
										</SummaryItemPrice>
									</SummaryItem>
								))}

								<SummaryItem>
									<SummaryItemText>Subtotal: </SummaryItemText>
									<SummaryItemPrice>
										R$ {subtotal ? subtotal.toString().replace(".", ",") : ""}
									</SummaryItemPrice>
								</SummaryItem>

								<SummaryItem>
									<SummaryItemText>Frete</SummaryItemText>

									<SummaryItemPrice>
										R$
										{props?.orders?.shippingInfo?.pac?.Valor
											? props?.orders?.shippingInfo?.pac?.Valor.toString().replace(
													".",
													","
											  )
											: ""}
									</SummaryItemPrice>
								</SummaryItem>
								<SummaryItem type="total">
									<SummaryItemText>Total</SummaryItemText>
									<SummaryItemPrice>
										R${props?.orders?.sum ? props?.orders?.sum : ""}
									</SummaryItemPrice>
								</SummaryItem>
							</Summary>
							<Summary padding={false}>
								<SummaryTitle>ENTREGA</SummaryTitle>
								<SummaryItem style={{ margin: "20px 0px 0px 0px" }}>
									<SummaryItemText>Endereço:</SummaryItemText>
									<SummaryItemPrice></SummaryItemPrice>
								</SummaryItem>
								<SummaryItem style={{ margin: "0px 0px 0px 0px" }}>
									<SummaryItemText>
										{address
											? `
                                        ${address.logradouro}, ${address.number}, ${address.compl}, ${address.bairro}, ${address.localidade}/${address.uf}`
											: ""}
									</SummaryItemText>
								</SummaryItem>
								{props?.orders?.correios?.codObjeto &&
									props?.orders?.correios?.eventos?.length > 0 && (
										<ShippingInfoContainer>
											<InfoQuery>
												<Hr></Hr>
												<LeftInfoText>
													Código de rastreamento:{" "}
													{props?.orders?.correios?.codObjeto}
												</LeftInfoText>
											</InfoQuery>
											{props?.orders?.correios?.eventos.map(
												(shippingEvent, i) => (
													<InfoQuery
														key={shippingEvent.data + shippingEvent.hora}
													>
														<Hr></Hr>
														<LeftInfoText>
															{shippingEvent.data} - {shippingEvent.hora} -{" "}
															{shippingEvent.origem
																? shippingEvent?.origem
																: shippingEvent?.local}
														</LeftInfoText>
														<RightInfoText>
															{shippingEvent.status}
														</RightInfoText>
													</InfoQuery>
												)
											)}
										</ShippingInfoContainer>
									)}
							</Summary>
						</HiddenContainer>
					)}

					{/* <div>
						<Stripe
							clientKey={
								"pi_3LvKZcFdGzKGygku1d2e3Iqc_secret_Tb4qanYMT2ZdNEmfqwpFYrcJ4"
							}
						/>
					</div> */}
				</Wrapper>
			)}
		</Container>
	);
};

export default Purchase;
