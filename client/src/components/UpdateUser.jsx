import React from "react";
import styled from "styled-components";
import { mobile } from "../responsive";

const Container = styled.div`
	height: calc(100vh - 60px);
	background: linear-gradient(
			rgba(255, 255, 255, 0.5),
			rgba(255, 255, 255, 0.5)
		),
		url("https://images.pexels.com/photos/6984661/pexels-photo-6984661.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940")
			center;
	background-size: cover;
	display: flex;
	justify-content: center;
	position: relative;
`;

const Wrapper = styled.div`
	padding: 20px;
	background-color: white;
	// ${mobile({ width: "75%" })};
	position: absolute;
	top: 25px;
	display: flex;
	align-items: center;
	flex-direction: column;
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

const InputContainer = styled.div`
	position: relative;
	width: 100%;
`;

const TextLabel = styled.p`
	margin: 10px 0px 0px 0px;
	min-width: 90%;
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

const UpdateUser = () => {
	return (
		<Container>
			<Wrapper>
				<Title>ALTERAR DADOS CADASTRAIS</Title>
				<Form>
					<InputContainer>
						<TextLabel>Nome completo</TextLabel>
						<Input
							/* color={errP1} */
							number={0}
							/* value={name} */
							/* onChange={(e) => setName(e.target.value)} */
							placeholder="Ex: Maria Silva Santos"
						/>
					</InputContainer>

					<InputContainer>
						<TextLabel>Telefone</TextLabel>
						<Input
							/* color={errP1} */
							/* value={phone} */
							number={1}
							/* onChange={(e) => setPhone(e.target.value)} */
							placeholder="EX: 71912341234"
						/>
					</InputContainer>
				</Form>
			</Wrapper>
		</Container>
	);
};

export default UpdateUser;
