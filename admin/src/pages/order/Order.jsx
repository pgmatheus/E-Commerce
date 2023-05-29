import styled from "styled-components";
import {
	CalendarToday,
	LocationSearching,
	MailOutline,
	PermIdentity,
	PhoneAndroid,
	Publish,
	Close,
} from "@material-ui/icons";
import app from "../../firebase";
import { Link } from "react-router-dom";
import "./order.css";
import { userRequest } from "../../requestMethods";
import { useEffect, useState } from "react";
import Infostock, {
	returnFiltered,
} from "../../components/infostock/Infostock";
import { v4 as uuid_v4 } from "uuid";
import {
	getStorage,
	ref,
	uploadBytesResumable,
	getDownloadURL,
} from "firebase/storage";
import { returnOnlyNumber } from "../../utilities/returnnumber";
import { compareObjects } from "../../utilities/compareObjects";

const CategoryDiv = styled.div`
	display: flex;
	margin-bottom: 10px;
`;

const CategoryChosen = styled.div`
	display: flex;
	margin-left: 10px;
	background-color: lightgray;
	border-radius: 4px;
	padding: 1px;
`;

const {
	colors,
	sizesAllowed,
	searchColor,
	categoryAllowed,
} = require("../../database/database");
const { consultarCep } = require("correios-brasil");

const ImgPreview = styled.img`
	width: 150px;
	height: 150px;
	object-fit: cover;
	margin-right: 10px;
	/* max-height: 100px; */
`;

const Dropdown = styled.div`
	background-color: white;
	display: flex;
	flex-direction: column;
	position: absolute;
	bottom: 40px;
	z-index: 10;
	width: 200px;
	border: 1px solid gray;
	&:empty {
		border: none;
	}
`;

const ColorDiv = styled.div`
	width: 15px;
	height: 15px;
	border-radius: 50%;
	background-color: ${(props) => props?.color};
	margin-left: 5px;
`;

const OtherImagesContainer = styled.div`
	display: flex;
	max-width: 500px;
	flex-wrap: wrap;
`;

const ImgPreviewContainer = styled.div`
	position: relative;
	display: flex;
`;

const DropdownRow = styled.div`
	cursor: pointer;
	text-align: start;
	margin: 10px 0;
`;

const OrderUpdateItem = styled.div`
	display: flex;
	flex-direction: column;
	margin-top: 10px;
	position: relative;
`;

const Button = styled.button``;

const ErrP = styled.p`
	color: red;
	text-align: center;
	margin-top: 10px;
`;

export default function Order(props) {
	let order = props?.order || undefined;
	const [product, setProduct] = useState(order?.info?.product || []);
	const [shippingValue, setShippingValue] = useState(
		order?.info?.shipping?.pac?.Valor || undefined
	);
	const [totalValue, setTotalValue] = useState(order?.info?.sum || undefined);

	const [address, setAddress] = useState(
		order?.info?.shipping?.cep || undefined
	);

	return (
		<>
			<div className="order">
				<div className="orderTitleContainer">
					<h1 className="orderTitle">Order Info</h1>
					<button
						onClick={() => {
							props?.setShowOrder(false);
						}}
					>
						Back
					</button>
				</div>

				<div className="orderContainer">
					<div className="orderUpdate">
						<span className="orderUpdateTitle">Edit</span>

						<div className="orderUpdateForm">
							<div className="orderUpdateLeft">
								{product?.map((e) => (
									<div className="orderUpdateItem" key={uuid_v4()}>
										<label>{e?.title}</label>
										<div style={{ display: "flex", alignItems: "center" }}>
											<ImgPreview src={e?.img?.[0]} />
											<div>
												<p>Size: {e?.size}</p>
												<div style={{ display: "flex", alignItems: "center" }}>
													<p>Color:</p>
													<ColorDiv color={e?.color} />
												</div>
												<p>Quantity: {e?.quantity}</p>
												<p>Price: R${e?.price}</p>
											</div>
										</div>
									</div>
								))}
								{address && (
									<div className="orderUpdateItem">
										<label>Endereço:</label>
										<div>
											<p>
												Rua: {address?.logradouro}, Nº: {address?.number},{" "}
												{address?.compl ? address?.compl : ""},{" "}
												{address?.bairro}, {address?.localidade}/{address?.uf}.
												CEP: {address?.cep}.
											</p>
										</div>
									</div>
								)}
								{totalValue && shippingValue && (
									<div className="orderUpdateItem">
										<label>Valor Produtos:</label>
										<div>
											<p>R$: {(totalValue - shippingValue).toFixed(2)}</p>
										</div>
									</div>
								)}
								{shippingValue && (
									<div className="orderUpdateItem">
										<label>Valor Frete:</label>
										<div>
											<p>R$: {shippingValue}</p>
										</div>
									</div>
								)}
								{totalValue && (
									<div className="orderUpdateItem">
										<label>Valor Total:</label>
										<div>
											<p>R$: {totalValue}</p>
										</div>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
