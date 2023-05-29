import { ArrowDropDown } from "@material-ui/icons";
import styled from "styled-components/macro";
import { NavMenu, NavItem, DropdownMenu } from "./NavMenuCat";
import { useState, useEffect } from "react";
import { publicRequest } from "../requestMethods";

const Container = styled.div`
	height: 30px;
	background-color: teal; // æCor
	color: white;
	display: flex;
	align-items: center;
	justify-content: center;
`;

const Left = styled.div`
	display: flex;
	justify-content: center;
	max-width: "145.02px";
	background-color: #09d0d0;
	align-items: center;
`;

const Center = styled.div`
	text-align: center;
	font-size: 14px;
	font-weight: 500;
	font-size: 13px;
	width: 100%;
`;

const Announcement = (props) => {
	const [text, setText] = useState(undefined);

	function capitalizeFirstLetter(string) {
		return string?.charAt(0)?.toUpperCase() + string?.slice(1);
	}

	useEffect(() => {
		let tempArray = [];
		if (props?.categoriesGet && props?.categoriesGet.length > 0) {
			for (let i = 0; i < props?.categoriesGet.length; i++) {
				tempArray.push({
					text: capitalizeFirstLetter(props?.categoriesGet[i].cat),
					link: `/products/?categories=${props?.categoriesGet[i].cat}&`,
				});
			}
			setText(tempArray);
		}
	}, [props?.categoriesGet]);

	/* const text = [
		{ text: "Blusa", link: "/cart" },
		{ text: "Conjunto", link: "/" },
		{ text: "Cropped", link: "/cart" },
		{ text: "Jeans", link: "/cart" },
		{ text: "Macacão", link: "/cart" },
		{ text: "Short", link: "/cart" },
		{ text: "Vestido", link: "/product/628e8ebf37155e69952a221d" },
	]; */

	return (
		<Container>
			<Left>
				<NavMenu>
					{props?.categoriesGet !== {} && (
						<NavItem icon={<ArrowDropDown />} text={"CATEGORIAS"}>
							<DropdownMenu style={{ width: "10px" }} text={text} />
						</NavItem>
					)}
				</NavMenu>
			</Left>
			<Center>PROMOÇÕES IMPERDÍVEIS!!!</Center>
		</Container> // æTexto Announcement
	);
};

export default Announcement;
