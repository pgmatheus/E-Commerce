import styled from "styled-components/macro";
import { useHistory } from "react-router";

const Container = styled.div``;

const TextContainer = styled.div`
	margin-bottom: 20px;
`;

const HeaderText = styled.h1`
	text-align: center;
	margin: 20px 0px 10px 0px;
`;

const InfoText = styled.h3`
	text-align: center;
	margin-bottom: 5px;
`;

const ButtonContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 20px 0px 30px 0px;
`;

const Button = styled.button`
	width: 150px;
	border: none;
	padding: 15px 20px;
	background-color: #6cc070;
	color: white;
	border-radius: 4px;
	cursor: pointer;
`;

const ConfirmationCreditCard = () => {
	const history = useHistory();
	let redHist = (e) => history.push(e);
	return (
		<Container>
			<TextContainer>
				<HeaderText>Parabéns!</HeaderText>
				<InfoText>Sua compra foi processada com sucesso!</InfoText>
				<InfoText>Mandaremos atualizações de sua compra por e-mail!</InfoText>
			</TextContainer>
			<ButtonContainer>
				<Button onClick={() => redHist("/")}>Voltar ao site</Button>
			</ButtonContainer>
		</Container>
	);
};

export default ConfirmationCreditCard;
