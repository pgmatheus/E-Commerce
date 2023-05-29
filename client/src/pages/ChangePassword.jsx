import styled from "styled-components/macro";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { publicRequest } from "../requestMethods";
import { Spinner } from "../styledComponents/css";
import { useHistory } from "react-router";
import { fabClasses } from "@mui/material";

const Container = styled.div`
	background-color: ${(props) =>
		props.success === true ? "white" : "#f5e8e4"};
	width: 400px;
	margin: auto;
`;

const Wrapper = styled.div`
	/* display: flex;
	align-items: left;
	justify-content: center;
	flex-direction: column; */
`;

const InputContainer = styled.div`
	display: flex;
	align-items: left;
	justify-content: center;
	flex-direction: column;
`;

const TextLabel = styled.label`
	margin: 5px 20px;
`;

const Input = styled.input`
	padding: 5px;
	margin: 5px 20px;
`;

const ErrorContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	text-align: center;
	margin-top: 10px;
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
	margin: 20px auto;
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

const ChangePassword = () => {
	const [password1, setPassword1] = useState("");
	const [password2, setPassword2] = useState("");
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [err, setErr] = useState([false, ""]);
	const location = useLocation();
	let qsearch = location.search;
	let qobj = new URLSearchParams(qsearch);
	let token = qobj.get("token");
	let page = qobj.get("page");
	let redHist = (e) => history.push(e);
	const history = useHistory();

	const handleCancel = () => {
		if (page) {
			redHist("/profile");
		} else {
			redHist("/");
		}
	};

	const handleConfirm = async () => {
		if (password1 !== password2) {
			return setErr([true, "Password diferentes"]);
		}

		if (password1.length < 6) {
			return setErr([true, "Password curto"]);
		}

		setLoading(true);
		setErr([false, ""]);

		try {
			const res = await publicRequest.post("/users/changepassword", {
				token,
				password1,
			});

			if (res?.data?.success) {
				setSuccess(true);
			}
			return setLoading(false);
		} catch (e) {
			setErr([true, e?.response?.data?.message || "Error"]);
			return setLoading(false);
		}
	};

	return (
		<Container success={success}>
			{!success ? (
				<Wrapper>
					<h1 style={{ padding: "10px 10px 10px 20px" }}>Mudar senha:</h1>
					<InputContainer>
						<TextLabel>Nova senha (6 caracteres no mínimo)</TextLabel>
						<Input
							onChange={(e) => setPassword1(e.target.value)}
							type="password"
						/>
					</InputContainer>

					<InputContainer>
						<TextLabel>Por favor, repetir a senha</TextLabel>
						<Input
							onChange={(e) => setPassword2(e.target.value)}
							type="password"
						/>
					</InputContainer>
					{err[0] && (
						<ErrorContainer>
							<p style={{ color: "red" }}>{err[1]}</p>
						</ErrorContainer>
					)}
					<ButtonContainer>
						<Button onClick={() => handleCancel()} disabled={loading}>
							Cancelar
						</Button>
						<Button disabled={loading} onClick={() => handleConfirm()}>
							{loading ? (
								<Spinner custom={{ size: "6px" }}></Spinner>
							) : (
								<p>Confirmar</p>
							)}
						</Button>
					</ButtonContainer>
				</Wrapper>
			) : (
				<EmptCartContainer>
					<EmptCartContainerTextH2>
						Password atualizado!
					</EmptCartContainerTextH2>
					<EmptCartContainerTextP>
						Clique no botão abaixo para ser redirecionado
					</EmptCartContainerTextP>
					<ButtonImgCart onClick={() => handleCancel()}>Voltar</ButtonImgCart>
				</EmptCartContainer>
			)}
		</Container>
	);
};

export default ChangePassword;
