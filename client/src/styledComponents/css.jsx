import styled from "styled-components/macro";
import { keyframes, css } from "styled-components";
import { mobile, tablet } from "../responsive";

const hourglass = keyframes`
  0% {
    transform: rotate(0);
    animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
  }
  50% {
    transform: rotate(900deg);
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }
  100% {
    transform: rotate(1800deg);
  }
`;

const Spinner = styled.div`
	display: inline-block;
	::after {
		content: " ";
		display: block;
		border-radius: 50%;
		width: 0;
		height: 0;
		// margin: 4px;
		box-sizing: border-box;
		/* border: 8px solid #fff;
		border-color: #fff transparent #fff transparent; */

		border: ${(props) =>
			props.custom === undefined
				? "8px solid white"
				: `${props.custom.size || "8px"} solid ${
						props.custom.color || "white"
				  }`};
		border-color: ${(props) =>
			props.custom === undefined
				? " white transparent white transparent"
				: `${props.custom.color || "white"} transparent ${
						props.custom.color || "white"
				  } transparent`};

		animation: ${css`
			${hourglass} 1.2s infinite
		`};
	}
`;

const Product = styled.div`
	display: flex;
	justify-content: space-between;
	border: 1px solid lightgray;
	margin-bottom: 5px;
	border-radius: 4px;
	/* ${mobile({ flexDirection: "column" })} */
`;

const ProductDetail = styled.div`
	flex: 2;
	display: flex;
	margin-bottom: 10px;
`;

const Details = styled.div`
	padding: 20px;
	display: flex;
	flex-direction: column;
	justify-content: space-around;
`;

const ProductName = styled.span`
	cursor: pointer;
`;

const ProductColor = styled.div`
	display: flex;
`;

const ProductSize = styled.span``;

const PriceDetail = styled.div`
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
`;

const ProductAmountContainer = styled.div`
	display: flex;
	align-items: center;
	margin-bottom: 20px;
`;

const ProductPrice = styled.div`
	font-size: 30px;
	font-weight: 200;
	margin-bottom: 20px;
	${mobile({ marginBottom: "20px" })}
`;

const ProductAmount = styled.div`
	font-size: 24px;
	margin: 5px;
	${mobile({ margin: "5px 15px" })}
`;

const Info = styled.div`
	flex: 3;
`;

const Image = styled.img`
	width: 200px;
	cursor: pointer;
`;

const ProductColorS = styled.div`
	width: 20px;
	height: 20px;
	border-radius: 50%;
	background-color: ${(props) => props.color};
	margin-left: 5px;
`;

const Summary = styled.div`
	margin-bottom: 10px;
	border: 0.5px solid lightgray;
	border-radius: 10px;
	padding: 20px;
	height: auto;
`;

const SummaryTitle = styled.h1`
	font-weight: 200;
`;

const ShipContainer = styled.div`
	display: flex;
	flex-direction: column;
`;

const ShippingText = styled.span`
	margin: 5px 0px;
`;

const Container = styled.div``;

export {
	Spinner,
	Product,
	ProductDetail,
	Details,
	ProductName,
	ProductColor,
	ProductSize,
	PriceDetail,
	ProductAmountContainer,
	ProductPrice,
	ProductAmount,
	Info,
	Image,
	ProductColorS,
	Summary,
	SummaryTitle,
	ShipContainer,
	ShippingText,
	Container,
};
