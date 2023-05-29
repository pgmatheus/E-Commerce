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
import { loginSuccess, logout } from "../redux/userRedux";

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
	margin-top: 5px;
	/* background-color: gray; */
	max-height: ${(props) => props.recaptcha === true && "600px"};
	min-height: 352px;
	/* max-height: 600px; */
	width: 400px;
	background-color: #f5e8e4;
	position: relative;
	overflow: hidden;
`;

/* const PayMethodContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100px;
	margin-bottom: 10px;
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

	background-color: ${(props) => props.number === props.ch && "#ddc5b1"};
`; */

const InfoContainer = styled.div``;

const InputContainer = styled.div`
	display: flex;
	align-items: left;
	justify-content: center;
	flex-direction: column;
`;

const TextLabel = styled.label`
	margin: 5px 10px;
`;

const Input = styled.input`
	padding: 5px;
	margin: 5px 10px;
`;

const Button = styled.button`
	width: 125px;
	border: none;
	padding: 15px 20px;
	background-color: ${(props) => (props.disabled ? "#677979" : "teal")};
	/* background-color: teal; */
	color: white;
	border-radius: 4px;
	margin: 0px 10px 20px 10px;
	cursor: ${(props) => !props.disabled && "pointer"}; ;
`;

const ButtonContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 10px auto;
`;

/* const BContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
`;
 */

const ErrorContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	text-align: center;
`;

const ErrorInfo = styled.span`
	position: absolute;
	right: 10px;
	color: red;
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

const Profile = () => {
	const user = useSelector((state) => state.user.currentUser);
	const [username, setUsername] = useState(user?.username || "");
	const [phone, setPhone] = useState(user?.phone || "");
	const [chAddress, setChAddress] = useState(user?.currentAddress?.[0] || {});
	const [addresses, setAddresses] = useState([]);
	const [spinner1, setSpinner1] = useState(false);
	const [spinner2, setSpinner2] = useState(false);
	const [loading, setLoading] = useState(false);
	const [showSaved, setShowSaved] = useState(false);
	const [err, setErr] = useState([false, ""]);
	const [token, setToken] = useState("");
	const history = useHistory();
	const dispatch = useDispatch();
	const [modifyAddress, setModifyAddress] = useState(false);
	const [deleteAccount, setDeleteAccount] = useState(false);
	const [spinner3, setSpinner3] = useState(false);

	let redHist = (e) => history.push(e);

	const returnedData = (data) => {
		setChAddress(data.address);
		setAddresses(data.allAddresses);
		setModifyAddress(data.modifyAddress);
	};

	const handleChangePassword = async () => {
		setErr([false, ""]);
		setLoading(true);
		setSpinner1(true);
		setShowSaved(false);
		try {
			const res = await userRequest({ token: user?.accessToken || "" }).post(
				`/users/gettokenpasswordlogged/${user._id}`
			);
			if (res?.data?.token) {
				redHist(`/changepassword/?token=${res.data.token}&page=/profile`);
			} else {
				setErr([true, "Erro de processamento. Tente novamente"]);
			}
			setSpinner1(false);
			return setLoading(false);
		} catch (e) {
			setSpinner1(false);
			setLoading(false);
			return setErr([true, e?.response?.data?.message || "Error"]);
		}
	};

	const handleSave = async () => {
		setErr([false, ""]);
		setLoading(true);
		setSpinner2(true);
		setShowSaved(false);
		try {
			const res = await userRequest({ token: user?.accessToken || "" }).put(
				`/users/${user._id}`,
				{
					username: username,
					phone: phone,
				}
			);

			if (res.status === 200) {
				dispatch(loginSuccess({ ...res.data, accessToken: user.accessToken }));
				setShowSaved(true);
			}
			setSpinner2(false);
			return setLoading(false);
		} catch (e) {
			setSpinner2(false);
			setLoading(false);
			return setErr([true, e?.response?.data?.message || "Error"]);
		}
	};

	const handleDeleteAccount = async () => {
		setSpinner3(true);
		setLoading(true);
		try {
			let res = await userRequest({ token: user?.accessToken }).delete(
				`/users/${user?._id}`
			);
			if (res) {
				dispatch(logout());
			}
			setLoading(false);
			setSpinner3(false);
			return res;
		} catch (e) {
			setSpinner3(false);
			setLoading(false);
		}
	};

	return (
		<Container>
			{user ? (
				<CheckoutContainer>
					{deleteAccount && (
						<InfoContainer
							style={{
								marginTop: "115px",
								display: "flex",
								alignItems: "center",
								flexDirection: "column",
								justifyContent: "center",
							}}
						>
							<h2 style={{ textAlign: "center" }}>Deseja deletar a conta?</h2>
							<ButtonContainer style={{ margin: "20px 0px 0px 0px" }}>
								<Button
									disabled={loading}
									onClick={() => setDeleteAccount(false)}
								>
									<p>Cancelar</p>
								</Button>
								<Button
									style={{ backgroundColor: "red" }}
									onClick={() => handleDeleteAccount()}
								>
									{spinner3 ? (
										<Spinner custom={{ size: "6px" }}></Spinner>
									) : (
										<p>Deletar conta</p>
									)}
								</Button>
							</ButtonContainer>
						</InfoContainer>
					)}
					{!deleteAccount && (
						<InfoContainer>
							<div style={{ marginBottom: "10px" }}></div>
							{!modifyAddress && (
								<>
									<InputContainer>
										<TextLabel>Nome Completo (comprador)</TextLabel>
										<Input
											defaultValue={user?.username || ""}
											onChange={(e) => setUsername(e.target.value)}
											type="text"
										/>
									</InputContainer>
									<InputContainer>
										<TextLabel>Telefone (comprador)</TextLabel>
										<InputMask
											defaultValue={user?.phone}
											onChange={(e) => setPhone(e.target.value)}
											mask="(99) 999999999"
											style={{ padding: "5px", margin: "5px 10px" }}
										/>
									</InputContainer>
								</>
							)}
							<UpdateUserAddress func={returnedData}></UpdateUserAddress>
							{!modifyAddress && (
								<>
									<ButtonContainer style={{ margin: "20px 0px 0px 0px" }}>
										<Button
											style={{ backgroundColor: "red" }}
											disabled={loading}
											onClick={() => setDeleteAccount(true)}
										>
											<p>Deletar conta</p>
										</Button>
										<Button
											disabled={loading}
											onClick={() => handleChangePassword()}
										>
											{spinner1 ? (
												<Spinner custom={{ size: "6px" }}></Spinner>
											) : (
												<p>Alterar senha</p>
											)}
										</Button>
									</ButtonContainer>

									{err[0] && (
										<ErrorContainer>
											<p style={{ color: "red" }}>{err[1]}</p>
										</ErrorContainer>
									)}

									{showSaved && (
										<ErrorContainer>
											<p style={{ color: "green" }}>Salvo!</p>
										</ErrorContainer>
									)}

									<ButtonContainer>
										<Button onClick={() => redHist("/")} disabled={loading}>
											Cancelar
										</Button>
										<Button onClick={() => handleSave()} disabled={loading}>
											{spinner2 ? (
												<Spinner custom={{ size: "6px" }}></Spinner>
											) : (
												<p>Salvar</p>
											)}
										</Button>
									</ButtonContainer>
								</>
							)}
						</InfoContainer>
					)}
				</CheckoutContainer>
			) : (
				<>
					{deleteAccount ? (
						<div> Conta Deletada com sucesso </div>
					) : (
						<div> Necessário estar logado </div>
					)}
				</>
			)}
		</Container>
	);
};

export default Profile;
