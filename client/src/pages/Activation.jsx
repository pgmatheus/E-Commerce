import styled from "styled-components/macro";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { publicRequest } from "../requestMethods";
import { Spinner } from "../styledComponents/css";
import { useHistory } from "react-router";

const Container = styled.div``;

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

const Button = styled.button`
	width: 125px;
	border: none;
	padding: 15px 20px;
	background-color: ${(props) => (props.disabled ? "#677979" : "teal")};
	/* background-color: teal; */
	color: white;
	border-radius: 4px;
	margin: 10px 10px 20px 10px;
	cursor: ${(props) => !props.disabled && "pointer"};
`;

const DivWait = styled.div`
	margin: calc(50vh - 100px) auto;
	height: fit-content;
	width: fit-content;
`;

const Activation = () => {
	const [success, setSuccess] = useState(false);
	const [loading, setLoading] = useState(true);
	const location = useLocation();
	let qsearch = location.search;
	let qobj = new URLSearchParams(qsearch);
	let token = qobj.get("token");
	let redHist = (e) => history.push(e);
	const history = useHistory();

	const requestActivaUser = async () => {
		try {
			const res = await publicRequest.post(`/auth/activateuser`, { token });
			if (res?.data?.success) {
				/* 	setSuccess(true); */
				setSuccess(true);
			} else {
				setSuccess(false);
			}

			return setLoading(false);
		} catch (e) {
			setSuccess(false);
			return setLoading(false);
		}
	};

	useEffect(() => {
		requestActivaUser();
	}, []);

	const handleIr = () => {
		redHist("/login");
	};

	return (
		<Container>
			{success && (
				<EmptCartContainer>
					<EmptCartContainerTextH2>Conta ativada!</EmptCartContainerTextH2>
					<EmptCartContainerTextP>
						Clique no botão abaixo para ser redirecionado para a página de login
					</EmptCartContainerTextP>
					<Button onClick={() => handleIr()}>ir</Button>
				</EmptCartContainer>
			)}

			{loading && !success && (
				<DivWait>
					<Spinner custom={{ size: "25px", color: "salmon" }}></Spinner>
				</DivWait>
			)}

			{!loading && !success && (
				<EmptCartContainer>
					<EmptCartContainerTextH2>Erro de token</EmptCartContainerTextH2>
					<EmptCartContainerTextP>
						Recomendamos tentar novamente mais tarde
					</EmptCartContainerTextP>
					<Button /* onClick={() => handleCancel()} */>Voltar início</Button>
				</EmptCartContainer>
			)}
		</Container>
	);
};

export default Activation;
