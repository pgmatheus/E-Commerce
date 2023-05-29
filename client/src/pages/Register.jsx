import { returnOnlyNumber } from "../features/returnnumber";
import { useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import styled from "styled-components/macro";
import { mobile } from "../responsive";
import Recaptcha from "../components/Recaptcha";
import axios from "axios";
import { publicRequest } from "../requestMethods";
import InputMask from "react-input-mask";
import { Close } from "@material-ui/icons";
import Terms from "../components/Terms";

const { consultarCep } = require("correios-brasil");

const Container = styled.div`
	min-height: calc(100vh - 60px);
	background: linear-gradient(
			rgba(255, 255, 255, 0.5),
			rgba(255, 255, 255, 0.5)
		),
		url("https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/Register%202%20(Copy).jpg?alt=media&token=2dc94b39-a36f-476e-8cc2-65f5d4793630")
			center;
	background-size: cover;
	display: flex;
	justify-content: center;
	flex-direction: column;
	align-items: center;
`;

const Wrapper = styled.div`
	padding: 20px;
	background-color: white;
	height: fit-content;
	// ${mobile({ width: "75%" })};
	/* position: absolute; */
	margin-top: 25px;
	display: flex;
	align-items: center;
	flex-direction: column;
	max-width: 400px;
`;

const Title = styled.h1`
	font-size: 24px;
	font-weight: 300;
`;

const Form = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	max-width: 600px;
	min-width: 250px;
`;

const Input = styled.input`
	width: calc(100% - 20px);
	padding: 10px;
	/* border: 1px solid black; */

	border: ${(props) =>
		props.color && props.color[0] == props.number
			? "1px solid red"
			: "1px solid black"};

	/* 	border: ${(props) =>
		props.color && props.color[0] == props.number
			? "1px solid red"
			: "1px solid black"}; */
`;

const Agreement = styled.span`
	font-size: 12px;
	margin: 20px 0px;
	text-align: center;
`;

const Button = styled.button`
	width: 125px;
	border: none;
	padding: 15px 20px;
	background-color: teal;
	color: white;
	border-radius: 4px;
	cursor: pointer;
`;

const InputContainer = styled.div`
	position: relative;
	width: 100%;
`;

const TextLabel = styled.p`
	margin: 10px 0px 0px 0px;
	min-width: 90%;
`;

const ButtonContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	margin-top: 20px;
`;

const Error = styled.span`
	color: red;
	margin-top: 20px;
`;

const FinishedRegisterContainer = styled.div`
	/* position: absolute; */
	min-width: 400px;
	/* height: 100%; */
	background-color: white;
	top: 0;
	left: 0;
	z-index: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
`;

const FinishedRegisterButton = styled.input`
	background-color: #14cccc;
	cursor: pointer;
	padding: 10px;
	margin-top: 20px;
`;

const Register = (props) => {
	const [name, setName] = useState("");
	const [phone, setPhone] = useState("");
	const [cep, setCep] = useState("");
	const [numb, setNumb] = useState("");
	const [comp, setComp] = useState("");
	const [address, setAddress] = useState("");
	const [addressS, setAddressS] = useState("");
	const [email1, setEmail1] = useState("");
	const [pass1, setPass1] = useState("");
	const [pass2, setPass2] = useState("");
	const [page, setPage] = useState(1);
	const [errP1, setErrP1] = useState([undefined, undefined]);
	const [errP2, setErrP2] = useState([undefined, undefined]);
	const [showPolicy, setShowPolicy] = useState(false);
	const [capToken, setCapToken] = useState(undefined);
	const [registered, setRegistered] = useState(false);
	let history = useHistory();
	let redHist = (e) => history.push("/login");

	const resReg = () => {
		const sendReq = async () => {
			try {
				const res = await publicRequest.post("/auth/register", {
					username: name,
					phone: phone,
					number: numb,
					complement: comp,
					currentAddress: {
						...addressS,
						...{ number: numb },
						...{ compl: comp },
					},
					email: email1.toLocaleLowerCase(),
					password: pass1,
					token: capToken,
				});
				if (res.data.register) {
					setRegistered(true);
				} else {
					setErrP2([3, res.data.message]);
				}
			} catch {}
		};
		sendReq();
	};

	const verifyFormP1 = () => {
		if (
			!name ||
			!(
				name &&
				name.length > 2 &&
				name.includes(" ") &&
				!returnOnlyNumber(name) &&
				/^[A-Za-z\s]*$/.test(name)
			)
		) {
			setErrP1([0, "Nome inválido"]);
		} else if (
			!cep ||
			!(cep && returnOnlyNumber(cep) && returnOnlyNumber(cep).length == 8)
		) {
			setErrP1([2, "Para o cep, são necessários 8 números"]);
		} else if (!addressS || !(addressS && addressS.logradouro)) {
			setErrP1([2, "Erro no número do CEP inserido"]);
		} else if (!numb || !(numb && numb.length > 0)) {
			setErrP1([3, "Faltou adicionar o número"]);
		} else {
			setErrP1([undefined, undefined]);
			setPage(2);
		}
	};

	const verifyFormP2 = () => {
		let validRegex =
			/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

		if (!email1 || !(email1.length > 5) || !email1.match(validRegex)) {
			setErrP2([0, "E-mail inválido"]);
		} else if (!pass1 || !(pass1.length > 5)) {
			setErrP2([1, "Senha curta"]);
		} else if (!pass2 || !(pass1 == pass2)) {
			setErrP2([2, "As senhas inseridas, não conferem"]);
		} else if (!capToken) {
			setErrP2([3, "Necessita validação de captcha"]);
		} else {
			setErrP2([undefined, undefined]);
			resReg();
		}
	};

	useEffect(() => {
		let onlyNumber = returnOnlyNumber(cep);
		if (onlyNumber && onlyNumber.length == 8) {
			consultarCep(onlyNumber).then((response) => {
				if (response && response.cep) {
					setAddressS(response);
					setAddress(
						response.logradouro +
							"; " +
							response.bairro +
							"; " +
							response.localidade
					);
				}
			});
		} else {
			setAddress("");
			setAddressS("");
		}
	}, [cep]);

	const returnedData = (data) => {
		setCapToken(data);
	};

	const returnedData3 = (data) => {};

	return (
		<>
			<Container>
				<Wrapper>
					{registered && (
						<FinishedRegisterContainer>
							<p>Conta Criada!</p>
							<br />
							<p>Um email foi enviado para a ativação da conta.</p>
							<FinishedRegisterButton
								onClick={() => redHist()}
								type="button"
								value="Retornar ao Site!"
							></FinishedRegisterButton>
						</FinishedRegisterContainer>
					)}
					{!registered && (
						<>
							<Title>CRIAR UMA CONTA</Title>
							{page == 1 && (
								<Form>
									<InputContainer>
										<TextLabel>Nome completo</TextLabel>
										<Input
											color={errP1}
											number={0}
											value={name}
											onChange={(e) => setName(e.target.value)}
											placeholder="Ex: Maria Silva Santos"
										/>
									</InputContainer>

									<InputContainer>
										<TextLabel>Telefone (opcional)</TextLabel>
										{/* <Input
									color={errP1}
									value={phone}
									number={1}
									onChange={(e) => setPhone(e.target.value)}
									placeholder="EX: 71912341234"
								/> */}

										<InputMask
											/* defaultValue={user?.phone} */

											/* onChange={(e) =>
										updatePhone(returnOnlyNumber(e.target.value))
									} */

											/* width: calc(100% - 20px);
	padding: 10px; */

											onChange={(e) =>
												setPhone(returnOnlyNumber(e.target.value))
											}
											placeholder="EX: 71912341234"
											mask="(99) 999999999"
											style={{
												width: "calc(100% - 20px)",
												padding: "10px",
												/* margin: "5px 10px", */
												border: "1px solid black",
											}}
										/>
									</InputContainer>

									<InputContainer>
										<TextLabel>CEP</TextLabel>
										{/* <Input
									color={errP1}
									value={cep}
									number={2}
									onChange={(e) => setCep(e.target.value)}
									placeholder="Ex: 17560246"
								/> */}
										<InputMask
											mask="99999-999"
											style={{
												width: "calc(100% - 20px)",
												padding: "10px",
												/* margin: "5px 10px", */
												border: `1px solid ${
													errP1 && errP1[0] === 2 ? "red" : "black"
												}`,
											}}
											/* color={errP1}
								
								number={2}
								
								placeholder="Ex: 17560246" */
											value={cep}
											onChange={(e) => setCep(returnOnlyNumber(e.target.value))}
										/>
									</InputContainer>

									<InputContainer>
										<TextLabel>Número</TextLabel>
										<Input
											color={errP1}
											number={3}
											value={numb}
											onChange={(e) => setNumb(e.target.value)}
											placeholder="Ex: 123"
										/>
									</InputContainer>

									<InputContainer>
										<TextLabel>Complemento</TextLabel>
										<Input
											color={errP1}
											number={4}
											value={comp}
											onChange={(e) => setComp(e.target.value)}
											placeholder="Ex: Bloco A, Apto 1002"
										/>
									</InputContainer>

									<InputContainer>
										<TextLabel>Endereço</TextLabel>
										<Input
											color={errP1}
											number={4}
											type="text"
											value={address}
											style={{ backgroundColor: "lightGray" }}
											readonly
										/>
									</InputContainer>

									{errP1 && errP1[1] && <Error>{errP1[1]}</Error>}

									<Agreement>
										Ao criar uma conta, você concorda com nossa{" "}
										<span
											style={{ cursor: "pointer" }}
											onClick={() => setShowPolicy(!showPolicy)}
										>
											<b>POLÍTICA DE PRIVACIDADE</b>
										</span>
									</Agreement>
									<Button
										onClick={() =>
											verifyFormP1()
										} /* onClick={() => setPage(2)} */
									>
										Próximo
									</Button>
								</Form>
							)}
							{page == 2 && (
								<Form>
									<InputContainer>
										<TextLabel>E-mail</TextLabel>
										<Input
											color={errP2}
											number={0}
											value={email1}
											onChange={(e) => setEmail1(e.target.value)}
											type={"email"}
											placeholder=" Ex: nomemail@outlook.com"
											required
										/>
									</InputContainer>

									<InputContainer>
										<TextLabel>Senha (6 caracteres no mínimo)</TextLabel>
										<Input
											color={errP2}
											number={1}
											value={pass1}
											onChange={(e) => setPass1(e.target.value)}
											type="password"
											placeholder="password"
											required
										/>
									</InputContainer>

									<InputContainer>
										<TextLabel>Por favor, repetir a senha</TextLabel>
										<Input
											color={errP2}
											number={2}
											type="password"
											value={pass2}
											onChange={(e) => setPass2(e.target.value)}
											placeholder="confirmar password"
											required
										/>
									</InputContainer>

									{errP2 && errP2[1] && <Error>{errP2[1]}</Error>}

									<Agreement>
										Ao criar uma conta, você concorda com nossa{" "}
										<span
											style={{ cursor: "pointer" }}
											onClick={() => setShowPolicy(!showPolicy)}
										>
											<b>POLÍTICA DE PRIVACIDADE</b>
										</span>
									</Agreement>

									<Recaptcha
										func2={returnedData3}
										func={returnedData}
									></Recaptcha>

									<ButtonContainer>
										<Button
											onClick={() => setPage(1)}
											style={{ marginRight: "10px" }}
										>
											Voltar
										</Button>
										<Button onClick={() => verifyFormP2()}>Finalizar</Button>
									</ButtonContainer>
								</Form>
							)}
						</>
					)}
				</Wrapper>
				{showPolicy && (
					<Wrapper>
						<div style={{ position: "relative", textAlign: "justify" }}>
							<Close
								onClick={() => setShowPolicy(false)}
								style={{
									position: "absolute",
									right: "5px",
									cursor: "pointer",
								}}
							></Close>
							<Terms />
						</div>
					</Wrapper>
				)}
			</Container>
		</>
	);
};

export default Register;
