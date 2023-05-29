import { useEffect, useState } from "react";
import Recaptcha from "../components/Recaptcha";
import styled from "styled-components";
import { login } from "../redux/apiCalls";
import { mobile } from "../responsive";
import { useDispatch, useSelector } from "react-redux";
import Announcement from "../components/Announcement";
import { useHistory } from "react-router-dom";
import { publicRequest } from "../requestMethods";
import { Spinner } from "../styledComponents/css";

const Container = styled.div`
	width: 100vw;
	height: calc(100vh - 90px);
	background: linear-gradient(
			rgba(255, 255, 255, 0.5),
			rgba(255, 255, 255, 0.5)
		),
		url("https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/login%20(Copy).jpg?alt=media&token=c10aa494-7328-42bc-9295-a4f1ad8a7bfd")
			center;
	background-size: cover;
	display: flex;
	align-items: flex-start;
	justify-content: center;
`;

const Wrapper = styled.div`
	margin-top: 60px;
	/* width: 25%; */
	/* max-width: 600px; */
	padding: 20px;
	background-color: white;
	position: relative;
	/* 	${mobile({ width: "75%" })} */
`;

const Title = styled.h1`
	font-size: 24px;
	font-weight: 300;
`;

const Form = styled.div`
	display: flex;
	flex-direction: column;
`;

const Input = styled.input`
	flex: 1;
	min-width: 40%;
	margin: 10px 0;
	padding: 10px;
`;

const Button = styled.button`
	width: 125px;
	border: none;
	padding: 15px 20px;
	background-color: ${(props) => (props.disabled ? "#677979" : "teal")};
	/* background-color: teal; */
	color: white;
	border-radius: 4px;
	margin: 10px 10px 20px 0px;
	cursor: ${(props) => !props.disabled && "pointer"}; ;
`;

const ButtonDiv = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	margin-top: 10px;
`;

const Link = styled.a`
	margin: 5px 0px;
	font-size: 12px;
	text-decoration: underline;
	cursor: pointer;
`;

const Error = styled.span`
	color: red;
	margin-bottom: 10px;
`;

const Ptext = styled.p`
	text-align: center;
`;

const Login = (props) => {
	/* const { isFetching, error } = useSelector((state) => state.user); */

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [token, setToken] = useState(undefined);
	const [err, setErr] = useState(undefined);
	const [recoveryPassword, setRecoveryPassword] = useState(false);
	const dispatch = useDispatch();
	const [recoveryEmail, setRecoveryEmail] = useState("");
	const [recoveryReqSent, setRecoveryReqSent] = useState(false);
	const [loading, setLoading] = useState(false);

	let history = useHistory();

	const redhist = (e) => {
		history.push(e);
	};

	const handleClick = (e) => {
		setLoading(true);
		let awaitRes = async () => {
			let res = await login(dispatch, { username, password, token });
			setErr(res);
			setLoading(false);
		};
		awaitRes();
	};

	const returnedData = (data) => {
		setToken(data);
	};

	const returnedData3 = (data) => {};

	const handleEmailInfo = () => {
		setLoading(false);
		setRecoveryPassword(true);
		setErr(undefined);
	};

	const handleSend = async () => {
		setLoading(true);
		let validRegex =
			/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

		if (
			!recoveryEmail ||
			!(recoveryEmail.length > 5) ||
			!recoveryEmail.match(validRegex)
		) {
			setLoading(false);
			return setErr({ message: "E-mail inválido" });
		}

		try {
			const res = await publicRequest.post("/users/gettokenpassword", {
				email: recoveryEmail,
			});
			setRecoveryReqSent(true);
			setErr(undefined);
			return setLoading(false);
		} catch (e) {
			setLoading(false);
			return setErr(e?.response?.data?.message || "Error");
		}
	};

	const returnBeginning = () => {
		setRecoveryReqSent(false);
		setRecoveryPassword(false);
		setErr(undefined);
	};

	return (
		<>
			<Announcement categoriesGet={props?.categoriesGet} />
			<Container>
				<Wrapper>
					{!recoveryPassword && !recoveryReqSent && (
						<>
							<Title>LOGIN</Title>
							<Form>
								<Input
									placeholder="e-mail"
									onChange={(e) => setUsername(e.target.value)}
								/>
								<Input
									placeholder="password"
									type="password"
									onChange={(e) => setPassword(e.target.value)}
								/>
								<Recaptcha
									func2={returnedData3}
									func={returnedData}
								></Recaptcha>
								<Button onClick={() => handleClick()} disabled={loading}>
									{loading ? (
										<Spinner custom={{ size: "6px" }}></Spinner>
									) : (
										<p>LOGIN</p>
									)}
								</Button>
								{err && <Error>{err}</Error>}
								<Link onClick={() => handleEmailInfo()}>ESQUECEU A SENHA?</Link>
								<Link onClick={() => redhist("/register")}>
									CRIAR NOVA CONTA
								</Link>
							</Form>
						</>
					)}
					{recoveryPassword && !recoveryReqSent && (
						<>
							<Title>DIGITE O E-MAIL CADASTRADO</Title>
							<Form>
								<Input
									style={{ marginTop: "15px" }}
									placeholder="e-mail cadastrado"
									onChange={(e) => setRecoveryEmail(e.target.value)}
								/>
								{err && (
									<Error style={{ margin: "auto" }}>{err || "Error"}</Error>
								)}

								<ButtonDiv>
									<Button
										style={{ margin: "0px 10px" }}
										onClick={() => {
											setRecoveryPassword(false);
											setErr(undefined);
										}}
										disabled={loading}
									>
										VOLTAR
									</Button>
									<Button
										style={{ margin: "0px 10px" }}
										onClick={() => handleSend()}
										disabled={loading}
									>
										ENVIAR
									</Button>
								</ButtonDiv>
							</Form>
						</>
					)}
					{recoveryReqSent && (
						<>
							<Ptext>Se o e-mail estiver cadastrado,</Ptext>
							<Ptext>foram enviadas informações para</Ptext>
							<Ptext>o reset de password</Ptext>
							<Form style={{ marginTop: "15px" }}>
								<ButtonDiv>
									<Button
										style={{ margin: "0px 10px" }}
										onClick={() => returnBeginning()}
										/* disabled={isFetching} */
									>
										VOLTAR
									</Button>
								</ButtonDiv>
							</Form>
						</>
					)}
				</Wrapper>
			</Container>
		</>
	);
};

export default Login;
