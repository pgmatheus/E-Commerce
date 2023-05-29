import styled from "styled-components/macro";
import { useEffect, useState } from "react";

const Container = styled.div``;

const TextContainer = styled.div``;

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

const Boleto = (props) => {
	const [link, setLink] = useState(props.value || "");

	const handleClick = () => {
		window.open(
			link,
			"_blank" // <- This is what makes it open in a new window.
		);
	};

	return (
		<Container>
			<TextContainer>
				<HeaderText>Parabéns!</HeaderText>
				<InfoText>Sua compra foi processada com sucesso!</InfoText>
				<InfoText>Para acessar o boleto, clique no botão abaixo.</InfoText>
			</TextContainer>
			<ButtonContainer>
				<Button onClick={() => handleClick()}>Acessar Boleto</Button>
			</ButtonContainer>

			{/* {props.value || ""} */}
		</Container>
	);
};

export default Boleto;
