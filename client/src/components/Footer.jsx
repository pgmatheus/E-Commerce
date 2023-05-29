import {
	Facebook,
	Instagram,
	MailOutline,
	Phone,
	Pinterest,
	Room,
	Twitter,
	WhatsApp,
} from "@material-ui/icons";
import styled from "styled-components";
import { mobile } from "../responsive";
import { useHistory } from "react-router";
import { useEffect, useState } from "react";
import Terms from "./Terms";
import { Close } from "@material-ui/icons";

const Container = styled.div`
	display: flex;
	${mobile({ flexDirection: "column" })}
	max-width: 100vw;
`;

const Left = styled.div`
	flex: 1;
	display: flex;
	flex-direction: column;
	padding: 20px;
`;

const Logo = styled.h1``;

const Desc = styled.p`
	margin: 10px 0px;
`;

const SocialContainer = styled.div`
	display: flex;
`;

const SocialIcon = styled.div`
	width: 40px;
	height: 40px;
	border-radius: 50%;
	color: white;
	background-color: #${(props) => props.color};
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 20px;
`;

const Center = styled.div`
	flex: 1;
	padding: 20px;
	${mobile({ display: "none" })}
`;

const Title = styled.h3`
	margin-bottom: 30px;
`;

const List = styled.ul`
	margin: 0;
	padding: 0;
	list-style: none;
	display: flex;
	flex-wrap: wrap;
`;

const ListItem = styled.li`
	width: 50%;
	margin-bottom: 10px;
`;

const Right = styled.div`
	flex: 1;
	padding: 20px;
	${mobile({ backgroundColor: "#fff8f8" })}
`;

const ContactItem = styled.div`
	margin-bottom: 20px;
	display: flex;
	align-items: center;
`;

const Payment = styled.img`
	width: 50%;
`;

const Footer = () => {
	const [showTerms, setShowTerms] = useState(false);
	const history = useHistory();
	let redHist = (e) => history.push(e);

	const handleClick = (link) => {
		window.open(link, "_blank");
	};

	return (
		<>
			<Container>
				<Left>
					<Logo>Taliska Fashion</Logo>
					<Desc>
						Loja de moda feminina com qualidade e preços imbatíveis! Visite-nos
						no nosso instagram!
					</Desc>
					<SocialContainer>
						{/* <SocialIcon color="3B5999">
						<Facebook />
					</SocialIcon> */}
						<SocialIcon
							color="E4405F"
							style={{ cursor: "pointer" }}
							onClick={() =>
								handleClick("https://www.instagram.com/taliska_fashion/")
							}
						>
							<Instagram />
						</SocialIcon>
						<SocialIcon
							style={{ cursor: "pointer" }}
							onClick={() =>
								handleClick(
									"https://api.whatsapp.com/send/?phone=5571991162035"
								)
							}
							color="128c7e"
						>
							<WhatsApp />
						</SocialIcon>
						{/* <SocialIcon color="E60023">
						<Pinterest />
					</SocialIcon> */}
					</SocialContainer>
					<p style={{ marginTop: "10px" }}>
						Ao utilizar o site, você concorda com nossos{" "}
						<span
							onClick={() => setShowTerms(!showTerms)}
							style={{ fontWeight: "bold", cursor: "pointer" }}
						>
							TERMOS DE SERVIÇO
						</span>
					</p>
				</Left>
				<Right>
					<Title>Contact</Title>
					<ContactItem>
						<Room style={{ marginRight: "10px" }} /> Salvador, Brasil
					</ContactItem>
					<ContactItem>
						<Phone style={{ marginRight: "10px" }} /> 71 99116-2035
					</ContactItem>
					<ContactItem>
						<MailOutline style={{ marginRight: "10px" }} />{" "}
						contato@taliskafashion.com.br
					</ContactItem>
					{/* 	<Payment src="https://i.ibb.co/Qfvn4z6/payment.png" /> */}
				</Right>
			</Container>
			{showTerms && (
				<Container
					style={{
						alignItems: "center",
						justifyContent: "center",
						position: "relative",
					}}
				>
					<div style={{ width: "80vw" }}>
						<Close
							onClick={() => setShowTerms(false)}
							style={{
								position: "absolute",
								right: "8vw",
								cursor: "pointer",
							}}
						/>
						<Terms />
					</div>
				</Container>
			)}
		</>
	);
};

export default Footer;
