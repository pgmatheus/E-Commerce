import { useEffect, useState } from "react";
import Recaptcha from "../../components/Recaptcha";
import styled from "styled-components";
import { login } from "../../redux/apiCalls";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { publicRequest } from "../../requestMethods";

const Container = styled.div`
	width: 100vw;
	height: calc(100vh - 90px);
	background: linear-gradient(
			rgba(255, 255, 255, 0.5),
			rgba(255, 255, 255, 0.5)
		),
		url("") center;
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

const Login = () => {
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

	return (
		<>
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
									<p>LOGIN</p>
								</Button>
								{err && <Error>{err.message}</Error>}
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
									<Error style={{ margin: "auto" }}>
										{err?.message || "Error"}
									</Error>
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
				</Wrapper>
			</Container>
		</>
	);
};

export default Login;
