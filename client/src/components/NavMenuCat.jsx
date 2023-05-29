import { useState } from "react";
import styled from "styled-components/macro";
import { CSSTransition } from "react-transition-group";
import { Link } from "react-router-dom";
import ClickAwayListener from "@mui/material/ClickAwayListener";

const root = {
	bg: "inherit",
	bgAccent: "rgb(220,220,220)",
	textColor: "black",
	navSize: "30px",
	border: "1px solid #474a4d",
	borderRadius: "8px",
	speed: "500ms",
	buttonSize: "20px",
	distbar: "74px",
	wbar: "145.02px",
	ttransfor: "translateX(-85%)",
	br: "brightness(0.7)",
	itemSize: "20px",
	paddingItem: "0.5rem 0.5rem 0.5rem 0.5rem",
};

const NavUl = styled.ul`
	list-style: none;
	margin: 0;
	padding: 0;
	max-width: 100%;
	height: 100%;
	display: flex;
	justify-content: flex-end;
	color: ${root.textColor};
`;
const NavLi = styled.li`
	// width: calc(${root.navSize}*0.8);
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const Nava = styled.a`
	// padding: 5px;
	// margin: 2px;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: filter 300ms;
	color: ${root.textColor};
	filter: ${root.br};
	&:hover {
		cursor: pointer;
	}
`;

const NavUser = styled.nav`
	height: ${root.navSize};
	padding: 0px 10px;
	background-color: ${root.bg};
	// padding: 0 1rem;
`;

const MenuItem = styled.a`
	height: ${root.itemSize};
	color: ${root.textColor};
	display: flex;
	align-items: center;
	// border-radius: ${root.borderRadius};
	transition: background ${root.speed};
	padding: ${root.paddingItem};
	background-color: ${root.bgAccent};
	&:hover {
		filter: brightness(0.7);
	}
`;

const Dropdown = styled.div`
	position: absolute;
	top: ${root.distbar};
	width: ${root.wbar};
	transform: ${root.ttransfor};
	border-radius: ${root.borderRadius};
	padding: 1rem;
	z-index: 10;
	overflow: hidden;
	transition: height ${root.speed};
`;
const Menu = styled.div`
	width: 100%;
`;

const Navap = styled.p`
	margin-right: 5px;
	max-width: 100px;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
`;

const NavMenu = (props) => {
	return (
		<NavUser>
			<NavUl>{props.children}</NavUl>
		</NavUser>
	);
};

const NavItem = (props) => {
	const [open, setOpen] = useState(false);
	return (
		<ClickAwayListener onClickAway={() => setOpen(false)}>
			<NavLi>
				<Nava onClick={() => setOpen(!open)}>
					{props.icon} <Navap> {props.text}</Navap>
				</Nava>
				{open ? (
					<div onClick={() => setOpen(!open)}>{props.children}</div>
				) : null}
			</NavLi>
		</ClickAwayListener>
	);
};

const DropdownMenu = (e) => {
	const [activeMenu, setActiveMenu] = useState("main");
	const DropdownItem = (props) => {
		return (
			<MenuItem onClick={() => props.goToMenu && setActiveMenu(props.goToMenu)}>
				{props.children}
			</MenuItem>
		);
	};

	return (
		<Dropdown>
			<CSSTransition
				in={activeMenu === "main"}
				unmountOnExit
				timeout={500}
				classNames="menu-primary"
			>
				<Menu>
					{e?.text &&
						e?.text?.map((ar) => (
							<Link to={ar.link} style={{ textDecoration: "none" }}>
								<DropdownItem>{ar.text}</DropdownItem>
							</Link>
						))}
				</Menu>
			</CSSTransition>
		</Dropdown>
	);
};

export { NavMenu, NavItem, DropdownMenu };
