import { useEffect, useState } from "react";
import styled from "styled-components";
import { compareObjects } from "../../utilities/compareObjects";
import { verifyAllowedList } from "../../utilities/verifyAllowedList";
import { v4 as uuid_v4 } from "uuid";
import { capitalize } from "../../utilities/capitalize";

const Container = styled.div``;

const ProductUpdateItem = styled.div`
	display: flex;
	flex-direction: column;
	margin-top: 10px;
	position: relative;
`;

const Button = styled.button`
	max-width: 100px;
	margin-right: 10px;
`;

const ChangeContainer = styled.div`
	border: 1px solid black;
	padding: 5px;
`;

const Label = styled.label`
	margin-bottom: 5px;
	font-size: 14px;
`;

const ProductUpdateInput = styled.input`
	border: none;
	width: 250px;
	height: 30px;
	border-bottom: 1px solid gray;
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

const ErrP = styled.p`
	color: red;
	text-align: center;
	margin-top: 10px;
`;

const DropdownRow = styled.div`
	cursor: pointer;
	text-align: start;
	margin: 10px 0;
`;

export const returnFiltered = ({ searchedTerm, DBsearch }) => {
	let filterOptions = DBsearch.filter((item) => {
		const searchTerm = searchedTerm;
		const fullName = item;
		return searchTerm && fullName.startsWith(searchedTerm);
	}).slice(0, 15);

	let z = filterOptions.filter((e) => {
		return e.toLowerCase() === searchedTerm;
	});

	if (z?.length === 1) {
		return undefined;
	}

	return filterOptions;
};

const Infostock = (props) => {
	const colors = props?.colors || undefined;
	const [infoStock, setInfoStock] = useState(
		props?.infoStock || {
			color: "",
			quantity: 1,
			size: "",
		}
	);
	const [quantity, setQuantity] = useState(
		(infoStock?.quantity && infoStock?.quantity > -1) ||
			infoStock?.quantity === 0
			? infoStock.quantity
			: 1
	);
	const [color, setColor] = useState(
		infoStock?.colorDisplay /* ?.colorDisplay?.toLowerCase() */ || ""
	);
	const [size, setSize] = useState(
		infoStock?.size?.toString()?.toUpperCase() || ""
	);
	const [showAddInfo, setShowAddInfo] = useState(false);
	const searchColor = props?.searchColor || [];
	const sizesAllowed = props?.sizesAllowed || [];
	const [dropdownColors, setDropdownColors] = useState(undefined);
	const [showDropdown, setShowDropdown] = useState(false);
	const [showDropdownSize, setShowDropdownSize] = useState(false);
	const [dropdownSize, setDropdownSize] = useState(undefined);
	const [edit, setEdit] = useState(color ? false : true);
	const [showError, setShowError] = useState([false, ""]);

	const [tempColor, setTempColor] = useState(
		props?.colors?.[color?.replaceAll(" ", "")]?.colorCode || ""
	);

	const verifyInput = () => {
		try {
			let cond1 = verifyAllowedList([color], props.searchColor);
			let cond2 = verifyAllowedList([size], props.sizesAllowed);
			let cond3 = Number.isInteger(quantity);

			if (!cond1.success) {
				throw new Error("Color not allowed");
			}

			if (!cond2.success) {
				throw new Error("Size not allowed");
			}

			if (!cond3) {
				throw new Error("Quantity error");
			}

			return { success: true };
		} catch (err) {
			return { success: false, message: err.message || "Error" };
		}
	};

	useEffect(() => {
		if (color && searchColor) {
			setShowDropdown(true);
			let colorLower = color?.toLowerCase();
			let result = returnFiltered({
				searchedTerm: colorLower,
				DBsearch: searchColor,
			});
			setDropdownColors(result);
		} else {
			setDropdownColors(undefined);
		}
	}, [color]);

	useEffect(() => {
		if (size && sizesAllowed) {
			setShowDropdownSize(true);
			let colorLower = size?.toString();

			let result = returnFiltered({
				searchedTerm: colorLower,
				DBsearch: sizesAllowed,
			});
			if (colorLower === result?.[0] && result?.length === 1) {
				return setDropdownSize(undefined);
			}
			setDropdownSize(result);
		} else {
			setDropdownSize(undefined);
		}
	}, [size]);

	/* 	let z = compareObjects(
		{
			colorDisplay: color,
			quantity: quantity,
			size: size,
		},
		infoStock
	);

	if (z && !z.success) {
		props.func({
			value: {
				colorDisplay: color,
				quantity: quantity,
				size: size,
			},
			index: props?.index,
			success: verifyInput(),
		});
	} */

	useEffect(() => {
		if (infoStock?.size) {
			setShowAddInfo(true);
		}
	}, []);

	const handleAdd = () => {
		props.setInfoStockIndex((st) => st + 1);
		setShowAddInfo(true);
	};

	const handleSave = () => {
		try {
			setShowError([false, ""]);
			let verify = verifyInput();
			if (verify.success !== true) {
				throw new Error(verify?.message || "Error input");
			}
			let z = compareObjects(
				{
					colorDisplay: color,
					quantity: quantity,
					size: size,
				},
				infoStock
			);

			if (z && !z.success) {
				props.func({
					value: {
						colorDisplay: color,
						quantity: quantity,
						size: size,
					},
					index: props?.index,
					delete: false,
					success: verifyInput(),
				});
			}
			setEdit(false);
		} catch (err) {
			return setShowError([
				true,
				err?.response?.data?.message || err?.message || "Error",
			]);
		}
	};

	const handleDelete = () => {
		props.func({
			delete: true,
			success: true,
			index: props?.index,
		});
	};

	return (
		<Container>
			{/* {!showAddInfo && (
				<ProductUpdateItem>
					<Button onClick={() => handleAdd()}>Add info</Button>
				</ProductUpdateItem>
			)}
			{showAddInfo && ( */}
			<ChangeContainer>
				<ProductUpdateItem>
					{/* <button onClick={() => verifyInput()}>verifyAllowedList</button> */}
					<Label>Quantidade</Label>
					<ProductUpdateInput
						value={quantity}
						onChange={(e) => setQuantity(parseInt(e.target.value))}
						type="number"
						min={0}
						disabled={!edit}
					></ProductUpdateInput>
				</ProductUpdateItem>
				<ProductUpdateItem>
					<Label>Tamanho</Label>
					<ProductUpdateInput
						value={size}
						onChange={(e) => setSize(e.target.value?.toString()?.toUpperCase())}
						type="text"
						disabled={!edit}
					></ProductUpdateInput>
					<Dropdown>
						{showDropdownSize &&
							dropdownSize?.map((item) => (
								<DropdownRow
									onClick={() => {
										setSize(item?.toString()?.toUpperCase());
										setShowDropdownSize(false);
									}}
									key={uuid_v4()}
								>
									{item}
								</DropdownRow>
							))}
					</Dropdown>
				</ProductUpdateItem>
				<ProductUpdateItem>
					<div style={{ display: "flex", alignItems: "center" }}>
						<Label>Cor</Label>
						<div
							style={{
								width: "10px",
								height: "10px",
								borderRadius: "50%",
								backgroundColor: tempColor,
								marginLeft: "5px",
								border: "0.5px solid black",
							}}
						></div>
					</div>
					<ProductUpdateInput
						value={color}
						onChange={(e) => {
							setColor(e.target.value?.toString()?.toLowerCase());
							setTempColor(
								props?.colors?.[e?.target?.value?.replaceAll(" ", "")]
									?.colorCode || ""
							);
						}}
						type="text"
						disabled={!edit}
					></ProductUpdateInput>

					<Dropdown>
						{showDropdown &&
							dropdownColors?.map((item) => (
								<DropdownRow
									onClick={() => {
										setColor(item);
										setTempColor(
											props?.colors?.[item?.replaceAll(" ", "")]?.colorCode ||
												""
										);
										setShowDropdown(false);
									}}
									key={uuid_v4()}
								>
									{item}
								</DropdownRow>
							))}
					</Dropdown>
				</ProductUpdateItem>
				{showError?.[0] && <ErrP>{showError[1]}</ErrP>}
				<ProductUpdateItem style={{ flexDirection: "row" }}>
					{!edit ? (
						<Button onClick={() => setEdit(true)}>Edit</Button>
					) : (
						<div>
							<Button onClick={() => handleDelete()}>Delete</Button>
							<Button onClick={() => handleSave()}>Save</Button>
						</div>
					)}
				</ProductUpdateItem>
			</ChangeContainer>
			{/* )} */}
		</Container>
	);
};

export default Infostock;
