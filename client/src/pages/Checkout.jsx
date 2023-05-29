import { useEffect, useState } from "react";
import styled from "styled-components/macro";
import { useSelector } from "react-redux";
import PixIcon from "@mui/icons-material/Pix";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import ReceiptIcon from "@mui/icons-material/Receipt";
import UpdateUser from "../components/UpdateUser";
import { publicRequest } from "../requestMethods";
import UpdateUserAddress from "../components/UpdateUserAddress";
import { useDispatch } from "react-redux";
import {
	verifyCpf,
	verifyName,
	verifyCep,
	verifyPhone,
} from "../features/verifyUserInput";
import { returnOnlyNumber } from "../features/returnnumber";
import { updateUser } from "../features/updateUser";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { userRequest } from "../requestMethods";
import CreditCard from "../components/CreditCard";
import InputMask from "react-input-mask";
import axios from "axios";
import { loginSuccess } from "../redux/userRedux";
import { Spinner } from "../styledComponents/css";
import { verifyProduct, emptyCart } from "../redux/cartRedux";
import session from "redux-persist/lib/storage/session";
import { totalValue } from "../features/totalValue";
import ShowInfoPS from "../components/ShowInfoPS";
import { useHistory } from "react-router";
import QRCodeFull from "../components/QrCodeFull";
import Boleto from "../components/Boleto";
import ConfirmationCreditCard from "../components/ConfirmationCreditCard";
import Stripe from "../components/stripe/Stripe";
import Recaptcha from "../components/Recaptcha";

const Container = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
`;

const CheckoutContainer = styled.div`
	/* background-color: gray; */
	max-height: ${(props) => props.recaptcha === true && "600px"};
	/* max-height: 600px; */
	width: 400px;
	background-color: #f5e8e4;
	position: relative;
	overflow: hidden;
`;

const PayMethodContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100px;
	margin-bottom: 10px;

	// background-color: #e8ccb6;
`;

const PayMethod = styled.div`
	box-sizing: border-box;
	width: calc(100% / 2);
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	cursor: pointer;
	background-color: ${(props) => props.number !== props.ch && "#ddc5b1"};
`;

const InfoContainer = styled.div``;

const InputContainer = styled.div`
	display: flex;
	align-items: left;
	justify-content: center;
	flex-direction: column;
	height: 100%;
`;

const TextLabel = styled.label`
	margin: 5px 10px;
`;

const Input = styled.input`
	padding: 5px;
	margin: 5px 10px;
`;

/* const CurrentAddressContainer = styled.div`
	width: 40%;
	border-radius: 4px;
	border: 1px solid black;
	cursor: pointer;
	padding: 5px;
	margin: 10px 10px;
`; */

/* const CurrentAddressText = styled.p`
	font-size: 12px;
`; */

/* const AddressContainer = styled.div`
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
`; */

/* const IconContainer = styled.div`
	width: 40%;
	margin: 10px 10px;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	cursor: pointer;
`; */

/* const InfoContainerCollapse = styled.div`
	margin: 5px 0px;
	background-color: #edede9;
	display: flex;
	align-items: center;
	cursor: pointer;
`; */

const Button = styled.button`
	width: 125px;
	border: none;
	padding: 15px 20px;
	background-color: ${(props) => (props.disabled ? "#677979" : "teal")};
	/* background-color: teal; */
	color: white;
	border-radius: 4px;
	cursor: ${(props) => !props.disabled && "pointer"}; ;
`;

const ButtonContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 10px 10px;
`;

const BContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
`;

const ErrorContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	text-align: center;
	margin-top: 10px;
`;

const ErrorInfo = styled.span`
	position: absolute;
	right: 10px;
	color: red;
`;

const RecaptchaContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
`;

function CpfInput(props) {
	return (
		<InputMask
			mask="999.999.999-99"
			onChange={props.onChange}
			value={props.value}
			style={{ padding: "5px", margin: "5px 10px" }}
		/>
	);
}

const Checkout = () => {
	const user = useSelector((state) => state.user.currentUser);
	const cart = useSelector((state) => state.cart);
	const dispatch = useDispatch();
	const [payM, setPayM] = useState(0);
	const [token, setToken] = useState("");
	const [showInfo, setShowInfo] = useState(false);
	const [errP1, setErrP1] = useState([false, undefined]);
	const [addresses, setAddresses] = useState([]);
	const [hash, setHash] = useState(undefined);
	const [cInfo, setCInfo] = useState(undefined);
	const strPay = ["pix", "creditCard", "creditCard"];
	const [page, setPage] = useState(0);
	const [spinner1, setSpinner1] = useState(false);
	const [username, setUsername] = useState(user?.username || "");
	const [phone, setPhone] = useState(user?.phone || "");
	const [chAddress, setChAddress] = useState(user?.currentAddress?.[0] || {});
	const [cpf, setCpf] = useState("");
	const [sessionId, setSessionId] = useState(undefined);
	const [shippingCost, setShippingCost] = useState({});
	const [loading, setLoading] = useState(false);
	const [tValue, setTValue] = useState(0);
	const [errCpf, setErrCpf] = useState(false);
	const history = useHistory();
	const [returnedValidData, setReturnedValidData] = useState({});
	const [idFinal, setIdFinal] = useState(undefined);
	const [cNumber, setCNumber] = useState(undefined);
	const [cvvCC, setcvvCC] = useState(undefined);
	const [date, setdate] = useState(undefined);
	const [name, setname] = useState(undefined);
	const [img, setImg] = useState(undefined);
	const [phoneCC, setPhoneCC] = useState(undefined);
	const [cpfCC, setCpfCC] = useState(undefined);
	const [pixValue, setPixValue] = useState(undefined);
	const [metRet, setMetRet] = useState(undefined);
	const [boletoLink, setBoletoLink] = useState(undefined);
	const [creditCard, setCreditCard] = useState(undefined);
	const [clientKey, setClientKey] = useState(undefined);
	const [showRecaptcha, setShowRecaptcha] = useState(false);
	const [modifyAddress, setModifyAddress] = useState(false);

	let redHist = (e) => history.push(e);

	const returnedCCData = (data) => {
		setCpfCC(data.cpf);
		setPhoneCC(data.phone);
		setImg(data.img);
		setname(data.name);
		setdate(data.date);
		setCNumber(data.cNumber);
		setcvvCC(data.cvvCC);
		setCInfo(data.sCCInfo);
	};

	const [pagseguroInfo, setPagseguroInfo] = useState({});

	/* const [pagseguroInfo, setPagseguroInfo] = useState({
		session: "",
		mode: "default", // verificar inserir
		method: "pix", // boleto ou creditCard inserir
		receiverEmail: "", // email da loja inserir
		currency: "BRL", // inserir
		notificationURL: "", // inserir 
		env: "sandbox", 
		sender: {
			name: "",
			email: "",
			phone: {
				areaCode: "",
				number: "",
			},

			// arrumar na db inserir
			document: {
				type: "CPF",
				value: "",
			},
			hash: "", // inserir
		},

		shipping: {
			addressRequired: true,
			type: 1,
			cost: "", // modificar depois
			street: "",
			number: "",
			complement: "",
			district: "",
			city: "",
			state: "",
			country: "BRA",
			postalCode: "",
		},

		billing: {
			street: "",
			number: "",
			complement: "",
			district: "",
			city: "",
			state: "",
			country: "BRA",
			postalCode: "",
		},

		items: [],

		extraAmount: "0.00", 
		reference: "", 
		}); */

	const returnedData = (data) => {
		/* setPagseguroInfo({
			...pagseguroInfo,
			shipping: {
				...pagseguroInfo.shipping,
				city: data.address.localidade,
				postalCode: returnOnlyNumber(user.currentAddress.cep),
				number: data.address.number,
				complement: data.address.compl,
				district: data.address.bairro,
				state: data.address.uf,
				street: data.address.logradouro,
			},
			billing: {
				...pagseguroInfo.billing,
				city: data.address.localidade,
				postalCode: returnOnlyNumber(user.currentAddress.cep),
				number: data.address.number,
				complement: data.address.compl,
				district: data.address.bairro,
				state: data.address.uf,
				street: data.address.logradouro,
			},
		}); */
		setChAddress(data.address);
		setAddresses(data.allAddresses);
		setModifyAddress(data.modifyAddress);
	};

	/* 	items: [
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
	], */

	/* 	const updateAddress = () => {
		if (
			user &&
			user.currentAddress &&
			returnOnlyNumber(user.currentAddress.cep)
		) {
			setPagseguroInfo({
				...pagseguroInfo,
				shipping: {
					...pagseguroInfo.shipping,
					city: user.currentAddress.localidade,
					postalCode: returnOnlyNumber(user.currentAddress.cep),
					number: user.currentAddress.number,
					complement: user.currentAddress.compl,
					district: user.currentAddress.bairro,
					state: user.currentAddress.uf,
					street: user.currentAddress.logradouro,
				},
				billing: {
					...pagseguroInfo.billing,
					city: user.currentAddress.localidade,
					postalCode: returnOnlyNumber(user.currentAddress.cep),
					number: user.currentAddress.number,
					complement: user.currentAddress.compl,
					district: user.currentAddress.bairro,
					state: user.currentAddress.uf,
					street: user.currentAddress.logradouro,
				},
			});
		} else {
			setShowInfo(true);
		}
	}; */

	const costShipping = async (cep) => {
		try {
			if (!cep) {
				return { error: true, response: "Cep inválido" };
			}

			const res = await publicRequest.post(
				"/verifyproductandshipping/shipping",
				{ shipping: cep }
			);
			return res.data;
		} catch {
			setLoading(false);
		}
	};

	const handleVerify = async (gen = false) => {
		if (cart && cart.products && cart.products.length > 0) {
			const verifyProducts = async () => {
				try {
					const res = await publicRequest.post(
						"/verifyproductandshipping/product",
						{
							initArr: cart.products,
							shipping: chAddress,
							gen: gen,
							cInfo: cInfo,
							info: pagseguroInfo,
							hash: sessionId,
							cpfR: cpf,
							method: strPay[payM], //"pix" /* strPay[payM] */,
						}
					);
					if (res.data.error === false) {
						setShippingCost(res.data.shipping.pac.Valor);
						dispatch(verifyProduct(res.data.product));
						if (res.data.product.length !== cart.products.length) {
							return {
								error: true,
								response: "Erro no estoque inserido, favor refazer a operação",
							};
						}

						return res.data;
					} else {
						return { error: true, response: res.data.response || "error" };
					}
				} catch (err) {
					setLoading(false);
				}
			};
			return verifyProducts();
		} else {
			return { error: true, response: "invalid product array" };
		}
	};

	const updateUserInfo = async (productAndShipping) => {
		if (
			!productAndShipping ||
			!productAndShipping.product ||
			productAndShipping.product.length < 1
		) {
			return { error: true, value: undefined, response: "Invalid Input" };
		}

		const cartP = productAndShipping.product;

		let obj = {
			session: "",
			mode: "default", // verificar inserir
			method: "pix", // boleto ou creditCard inserir
			receiverEmail: "", // email da loja inserir
			currency: "BRL", // inserir
			notificationURL: "", // inserir */
			/* env: "sandbox", */
			sender: {
				name: "",
				email: "",
				phone: {
					areaCode: "",
					number: "",
				},

				// arrumar na db inserir
				document: {
					type: "CPF",
					value: "",
				},
				hash: "", // inserir
			},

			shipping: {
				addressRequired: true,
				type: 1,
				cost: "", // modificar depois
				street: "",
				number: "",
				complement: "",
				district: "",
				city: "",
				state: "",
				country: "BRA",
				postalCode: "",
			},

			billing: {
				street: "",
				number: "",
				complement: "",
				district: "",
				city: "",
				state: "",
				country: "BRA",
				postalCode: "",
			},

			items: [],

			/* extraAmount: "0.00", // verificar inserir
			reference: "", //verificar inserir */
		};
		let tempObj = [];
		/* if (
			user &&
			user.currentAddress &&
			returnOnlyNumber(user.currentAddress.cep)
		) { */
		obj = {
			...obj,
			shipping: {
				city: chAddress.localidade,
				postalCode: returnOnlyNumber(chAddress.cep),
				number: chAddress.number,
				complement: chAddress.compl,
				district: chAddress.bairro,
				state: chAddress.uf,
				street: chAddress.logradouro,
				country: "BRA",
			},
			billing: {
				city: chAddress.localidade,
				postalCode: returnOnlyNumber(chAddress.cep),
				number: chAddress.number,
				complement: chAddress.compl,
				district: chAddress.bairro,
				state: chAddress.uf,
				street: chAddress.logradouro,
			},
		};
		// }

		/* if (
			user &&
			user.username &&
			user.email &&
			user.phone &&
			user.phone.length > 3
		) { */
		obj = {
			...obj,
			sender: {
				name: username,
				email: user.email,
				phone: {
					areaCode: phone.slice(0, 2),
					number: phone.slice(2),
				},
			},
		};
		//}

		for (let i = 0; i < cartP.length; i++) {
			tempObj.push({
				id: cartP[i]._id,
				quantity: cartP[i].quantity.toString(),
				amount: (Math.round(cartP[i].price * 100) / 100).toFixed(2).toString(),
				description: cartP[i].title,
			});
		}

		obj = { ...obj, items: tempObj };
		return { error: false, value: obj, response: "" };

		/* if (user) {
			let rValue = {
				...pagseguroInfo,
				shipping: {
					...pagseguroInfo.shipping,
					...obj.shipping,
				},
				billing: {
					...pagseguroInfo.billing,
					...obj.billing,
				},
				sender: {
					...pagseguroInfo.sender,
					...obj.sender,
				},
				items: obj.items,
			};
			
			
		} */

		/* return { error: true, value: undefined, response: "Error cart" }; */
	};

	const compareAddr = (obj1, obj2, options = undefined) => {
		if (obj1.length != obj2.length) {
			return { error: true, response: "Mismatch size" };
		}

		for (let i = 0; i < obj1.length; i++) {
			if (
				obj1[i].cep !== obj2[i].cep ||
				obj1[i].compl !== obj2[i].compl ||
				obj1[i].number !== obj2[i].number
			) {
				return { error: true, response: "Mismatch client address" };
			}
		}

		return { error: false, response: "" };
	};

	const handleCheckInfo = async () => {
		setSpinner1(true);
		setErrP1([false, undefined]);

		try {
			if (page === 0) {
				const verName = verifyName(username);
				if (verName.error === true) {
					setSpinner1(false);
					return setErrP1([true, verName.response]);
				}

				const verPhone = verifyPhone(returnOnlyNumber(phone));

				if (verPhone.error === true) {
					setSpinner1(false);
					return setErrP1([true, verPhone.response]);
				}

				const verCep = await verifyCep(chAddress);

				if (verCep[0] === false) {
					setSpinner1(false);
					return setErrP1([true, verCep[1]]);
				}

				let infoUpdate = await updateUser(
					{ token: user?.accessToken || "" },
					user._id
				);

				if (!infoUpdate) {
					setSpinner1(false);
					return setErrP1([true, "Erro, por favor, tente novamente"]);
				}

				const { currentAddress } = infoUpdate.data;

				let comparedAddr = compareAddr(currentAddress, addresses);

				if (!comparedAddr || comparedAddr.error === true) {
					dispatch(
						loginSuccess({ ...infoUpdate.data, accessToken: user.accessToken })
					);
					setSpinner1(false);

					return setErrP1([
						true,
						"Erro nas informações inseridas. Por favor, tente novamente",
					]);
				}

				let sShipping = await costShipping(chAddress);

				if (!sShipping || sShipping.error === true) {
					setSpinner1(false);
					return setErrP1([true, "Endereço Inválido"]);
				}

				const productsAndShipping = await handleVerify();

				setTValue(totalValue(productsAndShipping));

				if (!productsAndShipping || productsAndShipping.error === true) {
					setSpinner1(false);
					return setErrP1([true, productsAndShipping.response || "Error"]);
				}

				const updateArr = await updateUserInfo(productsAndShipping);

				if (!updateArr || updateArr.error === true) {
					setSpinner1(false);
					return setErrP1([true, updateArr.response]);
				}

				// verify update shipping cost and products
				/*


 */

				// update All values
				setPagseguroInfo({
					...updateArr.value,
					shipping: {
						...updateArr.value.shipping,
						cost: sShipping.shipping.pac.Valor,
					},
				});

				/* let obj = updateArr.value;

				setPagseguroInfo({
					...pagseguroInfo,
					shipping: {
						...pagseguroInfo.shipping,
						...obj.shipping,
					},
					billing: {
						...pagseguroInfo.billing,
						...obj.billing,
					},
					sender: {
						...pagseguroInfo.sender,
						...obj.sender,
					},
					items: obj.items,
				}); */
				/* await loadPagseguro(); */

				setSpinner1(false);
				setErrP1([false, undefined]);
				setPage(1);
				/* getPay(totalValue(productsAndShipping)); */
			} else if (page === 1) {
				/* 	const verCpf = verifyCpf(infoSend.sender.document.value); */
				/* if (payM === 1 || 2) {
					let verCpf = verifyCpf(returnOnlyNumber(cpf));

					if (verCpf[0] === false && payM !== 0) {
						setSpinner1(false);
						return setErrCpf(true);
					}

					if (payM === 1 && (!cInfo || cInfo.status === false)) {
						setSpinner1(false);
						return setErrP1([true, "Erro nas informações inseridas do cartão"]);
					}
					setErrCpf(false);
				} */

				const productsAndShipping = await handleVerify(true);

				if (!productsAndShipping || productsAndShipping.error === true) {
					setSpinner1(false);
					return setErrP1([true, productsAndShipping.response || "Error"]);
				}

				setClientKey(productsAndShipping.clientKey);

				setReturnedValidData(productsAndShipping);

				setSpinner1(false);
				setErrP1([false, undefined]);
				return setPage(2);
			} else if (page === 2) {
				if (!returnedValidData || returnedValidData._id === undefined) {
					return setErrP1([true, "Error processing payment"]);
				}

				//if (payM === 0) {

				const res = await userRequest({ token: user?.accessToken || "" }).post(
					`/verifycart/${user._id}`,
					{
						_id: returnedValidData._id,
						token: token,
					}
				);

				setPixValue(res.data.data.pixValue);

				/* setMetRet("pix");
				 */
				dispatch(emptyCart());
				//}

				/* if (payM === 1) {
					setCreditCard(res.data.data.value);
				}

				if (payM === 2) {
					setBoletoLink(res.data.data.value);
				} */

				setSpinner1(false);
				return setPage(3);
			}
		} catch (e) {
			setLoading(false);
			setSpinner1(false);
			setErrP1([true, e?.response?.data?.message || ""]);
		}
	};

	const handleCpfChange = (e) => {
		setCpf(e.target.value);
	};

	const handlePage = () => {
		setErrP1([false, undefined]);
		if (page === 0) {
			redHist("/cart");
		} else {
			setPage(() => page - 1);
		}
	};

	const returnedData2 = (data) => {
		setToken(data);
	};

	const returnedData3 = (data) => {
		setShowRecaptcha(data);
	};

	return (
		<Container>
			{/* <button onClick={() => handleSendReq()}>aaaaaaaaa</button> */}
			{user ? (
				<CheckoutContainer recaptcha={showRecaptcha}>
					{page === 0 && (
						<InfoContainer>
							<div style={{ marginBottom: "10px" }}></div>

							<InputContainer>
								<TextLabel>Nome Completo (comprador)</TextLabel>
								<Input
									defaultValue={user?.username || ""}
									/* onChange={(e) =>
										setPagseguroInfo({
											...pagseguroInfo,
											sender: { ...pagseguroInfo.sender, name: e.target.value },
										}) */

									onChange={(e) => setUsername(e.target.value)}
									type="text"
								/>
							</InputContainer>
							<InputContainer>
								<TextLabel>Telefone (comprador)</TextLabel>
								<InputMask
									defaultValue={user?.phone}
									/* onChange={(e) =>
										updatePhone(returnOnlyNumber(e.target.value))
									} */

									onChange={(e) => setPhone(e.target.value)}
									mask="(99) 999999999"
									style={{ padding: "5px", margin: "5px 10px" }}
								/>
							</InputContainer>

							<UpdateUserAddress func={returnedData}></UpdateUserAddress>
						</InfoContainer>
					)}

					{page === 1 && (
						<>
							<PayMethodContainer>
								<PayMethod number={0} ch={payM} onClick={() => setPayM(0)}>
									<PixIcon />
									<p>PIX</p>
								</PayMethod>
								<PayMethod number={2} ch={payM} onClick={() => setPayM(2)}>
									<ReceiptIcon />
									<p>Outros</p>
								</PayMethod>
							</PayMethodContainer>
						</>
					)}

					{page === 2 && (
						<>
							<ShowInfoPS
								returnedValidData={returnedValidData}
								method={payM}
							></ShowInfoPS>
						</>
					)}

					{page === 3 && payM === 0 && (
						<QRCodeFull
							pixValue={pixValue}
							info={returnedValidData}
						></QRCodeFull>
					)}

					{page === 3 && payM !== 0 && (
						<>
							{/* <p>Valor: R${returnedValidData?.sum || ""} </p> */}

							<Stripe purchasePage={false} clientKey={clientKey}></Stripe>
						</>
					)}

					{/* {(page === 3 && payM === 1) ||
						((payM === 2 || payM === 1) && <Stripe></Stripe>)} */}

					{/* {page === 3 && payM === 1 && (
						<ConfirmationCreditCard></ConfirmationCreditCard>
					)}

					{page === 3 && payM === 2 && (
						<Boleto value={boletoLink} info={returnedValidData}></Boleto>
					)} */}

					{/* {page !== 0 && ( */}

					{page === 2 && (
						<RecaptchaContainer>
							<Recaptcha
								backgroundColor={"black"}
								func2={returnedData3}
								func={returnedData2}
							></Recaptcha>
						</RecaptchaContainer>
					)}

					{page !== 3 && errP1 && errP1[0] === true && (
						<ErrorContainer>
							<p style={{ color: "red" }}>{errP1[1]}</p>
						</ErrorContainer>
					)}

					{/* 	)} */}
					{page !== 3 && !modifyAddress && (
						<BContainer>
							<ButtonContainer>
								<Button disabled={spinner1} onClick={() => handlePage()}>
									{page === 0 ? "Voltar" : "Anterior"}
								</Button>
							</ButtonContainer>
							<ButtonContainer>
								{spinner1 ? (
									<Button disabled={spinner1}>
										<Spinner custom={{ size: "6px" }} />
									</Button>
								) : (
									<Button
										disabled={page === 2 ? !token || spinner1 : false}
										onClick={() => handleCheckInfo()}
									>
										{page !== 2 ? "Próximo" : "Confirmar"}
									</Button>
								)}
							</ButtonContainer>
						</BContainer>
					)}
				</CheckoutContainer>
			) : (
				<div>Necessário estar logado</div>
			)}
		</Container>
	);
};

export default Checkout;
