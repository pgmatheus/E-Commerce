import { Link } from "react-router-dom";
import styled from "styled-components/macro";
import { mobile } from "../responsive";

const Container = styled.div`
	// flex: 1;
	margin: 3px;
	height: 60vh;
	width: 22vw;
	position: relative;
	${mobile({ flex: "1", width: "100vw" })}
`;

const Image = styled.img`
	width: 100%;
	height: 100%;
	object-fit: cover;
	${mobile({ height: "20vh" })};
`;

const Info = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
`;

const Title = styled.h1`
	color: white;
	margin-bottom: 20px;
`;

const Button = styled.button`
	border: none;
	padding: 10px;
	background-color: white;
	color: black;
	cursor: pointer;
	font-weight: 600;
`;

const CategoryItem = ({ item }) => {
	return (
		<Container>
			<Link to={`/products/?categories=${item.cat}&`}>
				<Image loading="lazy" src={item.img} alt={item.cat} />
				<Info>
					<Title>{item.title}</Title>
					<Button>COMPRE JÁ!</Button>
				</Info>
			</Link>
		</Container>
	);
};

export default CategoryItem;
