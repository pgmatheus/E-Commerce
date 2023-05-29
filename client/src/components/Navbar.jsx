import { Badge } from "@material-ui/core";
import {
	AccountCircle,
	Search,
	ShoppingCartOutlined,
} from "@material-ui/icons";
import React from "react";
import styled from "styled-components/macro";
import { mobile } from "../responsive";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory, useLocation } from "react-router-dom";
import { NavMenu, NavItem, DropdownMenu } from "./NavMenu";
import { useState } from "react";
import { data } from "../search";
import { useEffect } from "react";
import { publicRequest } from "../requestMethods";
import { userRequest } from "../requestMethods";
import { logout } from "../redux/userRedux";
import { addPrevLocation, addCurrentLocation } from "../redux/locationRedux";

// import NavItem from "./NavItem";

const Container = styled.div`
	height: 60px;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: salmon;
`;

const Wrapper = styled.div`
	padding: 10px 20px;
	width: 1250px;
	display: flex;
	align-items: center;
	justify-content: space-between;
`;

const Left = styled.div`
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: flex-end;
	margin-right: 10px;
`;

const SearchContainer = styled.div`
	border: 0.5px solid lightgray;
	display: flex;
	align-items: center;
	width: 100%;
	margin: 0px 10px;
	padding: 5px;
	background-color: white;
`;

const Input = styled.input`
	border: none;
	max-width: 750 px;
	width: 100%;
`;

const Center = styled.div`
	flex: 4;
	display: flex;
	align-items: center;
`;

const Logo = styled.h2`
	display: block;
	font-weight: bold;
	font-style: italic;
	${mobile({ fontSize: "24px" })};
	cursor: pointer;
	color: black;
`;

const Right = styled.div`
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: flex-start;
	// ${mobile({ flex: 2, justifyContent: "center" })};
`;

const MenuItem = styled.h3`
	// font-size: 14px;
	cursor: pointer;
	margin: 0px 10px;
	// ${mobile({ fontSize: "12px", marginLeft: "10px" })};
	color: black;
`;

const UserLText = styled.h3``;

const text = [
	{ text: "Início", link: "/" },
	{ text: "Meus pedidos", link: "/purchases" },
	{ text: "Meu perfil", link: "/profile" },
	{ text: "Logout", link: "/" },
];

const Dropdown = styled.div`
	background-color: white;
	display: flex;
	flex-direction: column;
	position: absolute;
	top: 40px;
	z-index: 10;
	width: 200px;
	border: 1px solid gray;
	&:empty {
		border: none;
	}
`;

const DropdownRow = styled.div`
	cursor: pointer;
	text-align: start;
	margin: 10px 0;
`;

const TextContainer = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
`;

const Navbar = (props) => {
	const quantity = useSelector((state) => state.cart.quantity);
	const user = useSelector((state) => state.user.currentUser);
	const [searchStr, setSearchStr] = useState("");
	const dispatch = useDispatch();

	const onChange = (e) => {
		setSearchStr(e.target.value);
	};

	let history = useHistory();

	let redLog = (e) => history.push("/login");

	let redHist = (e) => history.push("/products/?search=" + e);

	const onSearch = (searchTerm) => {
		setSearchStr(searchTerm);
		redHist(searchTerm);
	};

	const handleKeyDown = (e) => {
		if (e.key == "Enter") {
			redHist(searchStr);
		}
	};

	useEffect(() => {
		const getCat = async () => {
			try {
				const res = await publicRequest.get("/category");
				if (res?.data) {
					props.setCategoriesGet(res.data);
				}
			} catch {}
		};
		getCat();
	}, []);

	const verifyLogged = async () => {
		try {
			const res = await userRequest({ token: user?.accessToken || "" }).get(
				`/auth/checktoken/${user._id}`
			);
		} catch (e) {
			dispatch(logout());
			redLog();
		}
	};

	useEffect(() => {
		if (user) {
			verifyLogged();
		}
	}, [user]);

	return (
		<Container>
			<Wrapper>
				<Left>
					<Link to="/" style={{ textDecoration: "none" }}>
						<Logo>Taliska Fashion</Logo>
					</Link>
				</Left>
				<Center>
					<SearchContainer>
						<TextContainer>
							<Input
								value={searchStr}
								onKeyDown={handleKeyDown}
								onChange={onChange}
								placeholder="Buscar produtos"
								type="search"
							/>
							<Dropdown>
								{data
									.filter((item) => {
										const searchTerm = searchStr.toLowerCase();
										const fullName = item.term.toLowerCase();
										return (
											searchTerm &&
											fullName.startsWith(searchTerm) &&
											fullName !== searchTerm
										);
									})
									.slice(0, 10)
									.map((item) => (
										<DropdownRow
											onClick={() => {
												onSearch(item.term);
											}}
											key={item.term}
										>
											{item.term}
										</DropdownRow>
									))}
							</Dropdown>
						</TextContainer>
						<Link
							to={"/products/?search=" + searchStr}
							style={{
								textDecoration: "none",
								display: "inline-flex",
								marginLeft: "10px",
							}}
						>
							<Search
								to="/cart"
								onClick={() => onSearch(searchStr)}
								style={{
									backgroundColor: "white",
									cursor: "pointer",
									border: "1px solid gray",
									color: "black",
									fontSize: 16,
									display: "inline-table",
								}}
							/>
						</Link>
					</SearchContainer>
				</Center>
				{user ? (
					<Right>
						<NavMenu>
							<NavItem icon={<AccountCircle />} text={user.username}>
								<DropdownMenu text={text} />
							</NavItem>
						</NavMenu>
						<Link to="/cart">
							<MenuItem>
								<Badge badgeContent={quantity} color="primary">
									<ShoppingCartOutlined />
								</Badge>
							</MenuItem>
						</Link>
					</Right>
				) : (
					<Right>
						{/* <Link to="/register" style={{ textDecoration: 'none' }}>
              <MenuItem>REGISTRAR</MenuItem>
            </Link> */}
						<Link to="/login" style={{ textDecoration: "none" }}>
							<MenuItem>LOGIN</MenuItem>
						</Link>
						<Link to="/cart">
							<MenuItem>
								<Badge badgeContent={quantity} color="primary">
									<ShoppingCartOutlined />
								</Badge>
							</MenuItem>
						</Link>
					</Right>
				)}
			</Wrapper>
		</Container>
	);
};

export default Navbar;
