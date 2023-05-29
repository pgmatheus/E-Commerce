import {
	FavoriteBorderOutlined,
	SearchOutlined,
	ShoppingCartOutlined,
} from "@material-ui/icons";
import React from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components/macro";
import { useEffect } from "react";

const PriceContainer = styled.div`
	flex: 1;
	padding-top: 5px;
	max-width: 176px;
`;

const Container = styled.div`
	width: 197px;
	height: 321px;
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: center;
	position: relative;
	margin-bottom: 20px;
`;

const Image = styled.img`
	object-fit: cover;
	width: 100%;
	height: 100%;
	z-index: 2;
`;

const ImgContainer = styled.div`
	flex: 4;
	display: flex;
	align-items: center;
	justify-content: center;
	overflow: hidden;
	max-height: 269px;
	max-width: 176px;
`;

const TitleT = styled.p`
	text-align: center;
	margin-bottom: 5px;
	overflow: hidden;
	color: black;
	text-overflow: ellipsis;
`;

const PriceD = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	text-overflow: ellipsis;
	overflow: hidden;
`;

const APrice = styled.p`
	margin-right: 5px;
	color: black;
`;

const BPrice = styled.p`
	color: gray;
	text-decoration: line-through;
`;

const ProdContainer = styled.div`
	display: flex;
	flex-direction: column;
	height: 100%;
	max-width: 176px;
	white-space: nowrap;
	cursor: pointer;
`;

const Product = ({ item }) => {
	let history = useHistory();
	let redHist = (e) => history.push("/product/" + e);

	return (
		<Container>
			<ProdContainer onClick={() => redHist(item._id)}>
				<ImgContainer>
					<Image loading="lazy" src={item.img[0]} />
				</ImgContainer>
				<PriceContainer>
					<TitleT> {item.title}</TitleT>

					<PriceD>
						<APrice> R$: {item.price}</APrice>
						<BPrice> {item.bprice ? "R$: " + item.bprice : ""}</BPrice>
					</PriceD>
				</PriceContainer>
			</ProdContainer>
		</Container>
	);
};

export default Product;
