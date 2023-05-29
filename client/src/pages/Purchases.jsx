import React from "react";
import Announcement from "../components/Announcement";
import Categories from "../components/Categories";
import Footer from "../components/Footer";
/* import Newsletter from "../components/Newsletter"; */
import Purchase from "../components/Purchase";
import styled from "styled-components/macro";
import { useSelector } from "react-redux";
import { userRequest } from "../requestMethods";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";

const Container = styled.div``;

const Wrapper = styled.div`
	margin: 30px auto;
	/* 	background-color: green; */
	max-width: 1000px;
	width: 100%;
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

const Purchases = (props) => {
	const [orders, setOrders] = useState([]);
	const user = useSelector((state) => state.user.currentUser);
	const history = useHistory();
	const [loading, setLoading] = useState(true);
	let redHist = (e) => history.push(e);

	const handleGetOrders = async () => {
		const getOrders = async () => {
			try {
				const res = await userRequest({ token: user?.accessToken || "" }).get(
					`/users/purchases/${user._id}`
				);
				if (res) {
					setOrders(res.data.value);
				}
			} catch (e) {
				setLoading(false);
			}
		};
		await getOrders();
		setLoading(false);
	};

	useEffect(() => {
		window.scrollTo(0, 0);
		if (user) {
			handleGetOrders();
		}
	}, [user]);

	return (
		<Container>
			<Announcement categoriesGet={props.categoriesGet} />
			{!user && !loading && <div>Necessário estar logado</div>}
			{user && orders?.length > 0 && !loading && (
				<>
					{orders.map((e, i) => (
						<Wrapper>
							<Purchase key={i} numberOrder={i} orders={e}></Purchase>
						</Wrapper>
					))}
				</>
			)}
			{user && !orders.length && !loading && (
				<Wrapper>
					<EmptCartContainer>
						<EmptCartContainerTextH2>
							Sem histórico de compras!
						</EmptCartContainerTextH2>
						<EmptCartContainerTextP>
							Clique no botão abaixo para aproveitar as nossas ofertas
						</EmptCartContainerTextP>
						<ButtonImgCart onClick={() => redHist("/products")}>
							Acessar Ofertas
						</ButtonImgCart>
					</EmptCartContainer>
				</Wrapper>
			)}{" "}
			{loading && <>{loading && <div style={{ height: "600px" }}></div>}</>}
			{/* 	<Newsletter /> */}
			<Footer />
		</Container>
	);
};

export default Purchases;
