import styled from "styled-components/macro";
import { mobile, tablet } from "../responsive";
import { useHistory } from "react-router";

const Container = styled.div``;

const Wrapper = styled.div`
	padding: 20px;
	${mobile({ padding: "10px" })}
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

const NotFound = (props) => {
	const history = useHistory();
	let redHist = (e) => history.push(e);

	return (
		<Container>
			<Wrapper>
				<EmptCartContainer>
					<EmptCartContainerTextH2>
						Página Não Encontrada!
					</EmptCartContainerTextH2>
					<EmptCartContainerTextP>
						{" "}
						Clique no botão abaixo para acessar as nossas ofertas
					</EmptCartContainerTextP>
					<ButtonImgCart onClick={() => redHist("/")}>
						Acessar Ofertas
					</ButtonImgCart>
				</EmptCartContainer>
			</Wrapper>
		</Container>
	);
};

export default NotFound;
