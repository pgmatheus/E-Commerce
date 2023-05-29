import {
	Add,
	ArrowDownwardOutlined,
	ArrowLeftOutlined,
	ArrowRightOutlined,
	ArrowUpwardOutlined,
	CloseOutlined,
	Fullscreen,
	Remove,
} from "@material-ui/icons";
import { useSelector } from "react-redux";
import styled from "styled-components/macro";
import Announcement from "../components/Announcement";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
/* import Newsletter from "../components/Newsletter"; */
import { mobile } from "../responsive";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { publicRequest } from "../requestMethods";
import { addProduct, removeProduct, addMultiple } from "../redux/cartRedux";
import { useDispatch } from "react-redux";
import { titleConvertValue } from "../data";
import zIndex from "@material-ui/core/styles/zIndex";
import { Hidden } from "@material-ui/core";
import { green } from "@material-ui/core/colors";
import { useHistory } from "react-router";
import { v4 as uuid_v4 } from "uuid";

const Container = styled.div``;

const Wrapper = styled.div`
	padding: 50px;
	display: flex;
	justify-content: center;
	align-items: center;

	${mobile({ padding: "10px", flexDirection: "column" })}
`;

const ImgContainer = styled.div`
	width: 500px;
	height: 70vh;
	display: flex;
	justify-content: center;
	${mobile({ height: "40vh", width: "50vw" })}
`;

const Image = styled.img`
	width: 100%;
	height: 100%;
	object-fit: cover;
	transform-origin: center center;
`;

const InfoContainer = styled.div`
	max-width: 500px;
	min-height: 70vh;
	margin-left: 150px;
	${mobile({
		padding: "10px",
		marginLeft: "0px",
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		height: "50vh",
		minHeight: "50vh",
	})}
`;

const Title = styled.h1`
	font-weight: 600;
`;

const Desc = styled.p`
	margin: 20px 0px 10px 0px;
`;

const Price = styled.span`
	font-weight: 100;
	font-size: 40px;
	margin: 10px 0px;
`;

/* const FilterContainer = styled.div`
  width: 50%;
  margin: 30px 0px;
  display: flex;
  //justify-content: space-between;
  ${mobile({ width: "100%" })}
`; */

const Filter = styled.div`
	display: flex;
	align-items: center;
	margin: 30px 0px;
	${mobile({ margin: "15px 0px" })}
`;

const FilterTitle = styled.span`
	font-size: 20px;
	font-weight: 200;
	margin-right: 5px;
`;

const FilterColor = styled.div`
	width: 20px;
	height: 20px;
	border-radius: 50%;
	background-color: ${(props) => props.color};
	cursor: pointer;
	border: 1px solid black;
`;

const FilterSize = styled.select`
	margin-left: 10px;
	padding: 5px;
`;

const FilterSizeOption = styled.option``;

const AddContainer = styled.div`
	width: 50%;
	display: flex;
	align-items: center;
	justify-content: space-between;
	${mobile({ width: "100%" })}
`;

const AmountContainer = styled.div`
	display: flex;
	align-items: center;
	font-weight: 700;
`;

const Amount = styled.span`
	width: 30px;
	height: 30px;
	border-radius: 10px;
	border: 1px solid teal;
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 0px 5px;
`;

const Button = styled.button`
	color: ${(props) => (props.color == "white" ? "black" : props.color)};
	position: relative;
	padding: 15px;
	border: 2px solid teal;
	/* background-color: white; */
	background-color: ${(props) => props.color};
	cursor: pointer;
	font-weight: 500;
	margin-left: 10px;
	&:hover {
		/* background-color: #f8f4f4; */
		background-color: ${(props) => props.color == "white" && "white"};
	}
`;

const FilterColorContainer = styled.div`
	width: 30px;
	height: 30px;
	margin: 0px 5px;
	// border: 0.5px solid black;
	border: ${(props) =>
		props.activate ? "0.01px solid black" : "0.01px solid white"};
	display: flex;
	justify-content: center;
	align-items: center;
`;

const QuantityContainer = styled.div`
	margin-top: 20px;
`;

const QuantityContainerText = styled.p``;

const MiniImgContainer = styled.div`
	margin-right: 10px;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	align-items: center;
	position: relative;
	${mobile({ display: "none" })}
`;

const MiniImg = styled.div`
	height: 15vh;
	width: 75px;
	border: 0.5px solid lightgrey;
	margin-bottom: 10px;
	object-fit: cover;
	transform: translate(
		0,
		calc(${(props) => props.transf}vh + ${(props) => props.transf} / 15 * 10px)
	);
`;

const MImage = styled.img`
	width: 100%;
	height: 100%;
	object-fit: cover;
`;

const ZoomContainer = styled.div`
	box-shadow: 3px 3px 4px rgba(0, 0, 0, 0.3);
	overflow: hidden;
	width: 100%;
	height: 100%;
	${mobile({ width: "auto", display: "none" })}
`;

const BoxArrow = styled.div`
	width: 40px;
	height: 25px;
	margin-top: 1px;
	cursor: pointer;
	background-color: black;
	display: flex;
	align-items: center;
	justify-content: center;
	position: absolute;
	bottom: ${(props) => props.bot === true && "0"};
	top: ${(props) => props.top === true && "0"};
	z-index: 2;
	&:hover {
		background-color: #8c8c8c;
	}
`;

const Arrow = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 2;
	background-color: black;
	position: absolute;
	left: ${(props) => props.direction === "left" && "0px"};
	right: ${(props) => props.direction === "right" && "0px"};
	width: 35px;
	height: 55px;
	background-color: lightgray;
	cursor: pointer;
`;

const SwipeContainer = styled.div`
	display: none;
	${mobile({
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		width: "100%",
		overflow: "hidden",
		width: "auto",
		position: "relative",
	})}
`;

const FullScreenIconContainer = styled.div`
	position: absolute;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 35px;
	height: 35px;
	background-color: lightgray;
	border-radius: 50%;
	top: 5px;
	right: 5px;
`;

const ImgZoomed = styled.div`
	display: ${(props) => (props.imgZoomed == true ? "flex" : "none")};
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100vh;
	z-index: 999;
	background-color: black;
	position: fixed;
	padding: 0;
	margin: 0;
	top: 0;
	overflow: hidden;
`;

const ImgZommedImg = styled.img`
	// width: auto;
	min-width: 70vw;
	max-width: 90vw;
	min-height: 70vh;
	max-height: 90vh;
	height: 100%;
	min-height: 350px;

	// height: auto;
`;

const CloseIcon = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 2;
	background-color: black;
	position: absolute;
	right: 5px;
	top: 5px;
	/*   top: calc((100vh - ${(props) => props.h.height}px)/2 + 5px);
  right: calc((100vh - ${(props) => props.h.width}px)/2 + 30px); */
	width: 50px;
	height: 50px;
	border-radius: 50%;
	background-color: lightgray;
	cursor: pointer;
`;

const ZoomedImgContainer = styled.div`
	position: relative;
`;

const InfoItemAddedContainer = styled.div`
	margin: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	color: white;
	position: absolute;
	left: 0;
	right: 0;
	margin: auto;
	top: 0;
	bottom: 0;
`;

const InfoItemAdded = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
`;

const Product = (props) => {
	const [loading, setLoading] = useState(true);
	const location = useLocation();
	const id = location.pathname.split("/")[2];
	const [product, setProduct] = useState({});
	const [filteredProductSize, setFilteredProductSize] = useState([
		{ size: "", quantity: 1 },
	]);
	const [addItemCart, setAddItemCart] = useState([
		"ADICIONAR NO CARRINHO",
		"white",
	]);
	const [quantity, setQuantity] = useState(1);
	const [quantityColorSize, setQuantityColorSize] = useState("1");
	const [color, setColor] = useState("");
	const [size, setSize] = useState("");
	const [slideIndex, setSlideIndex] = useState(0);
	const [imgSel, setImgSel] = useState("");
	const [slideMini, setSlideMini] = useState(0);
	const [touchStart, setTouchStart] = useState(null);
	const [touchEnd, setTouchEnd] = useState(null);
	const [imgZoomed, setImgZoomed] = useState(false);
	const [avaiableColors, setAvaiableColors] = useState(undefined);
	const dispatch = useDispatch();
	/* let obj = titleConvertValue(); */
	const cart = useSelector((state) => state.cart);
	const history = useHistory();
	let redHist = (e) => history.push(e);

	// swipe start æ
	const minSwipeDistance = 50;

	const onTouchStart = (e) => {
		setTouchEnd(null); // otherwise the swipe is fired even with usual touch events
		setTouchStart(e.targetTouches[0].clientX);
	};

	const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

	const onTouchEnd = () => {
		if (!touchStart || !touchEnd) return;
		const distance = touchStart - touchEnd;
		const isLeftSwipe = distance > minSwipeDistance;
		const isRightSwipe = distance < -minSwipeDistance;
		if (isLeftSwipe) {
			handleClick2("left");
		} else if (isRightSwipe) {
			handleClick2("right");
		}
		// add your conditional logic here
	};

	// swipe end æ

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	/* 	useEffect(() => {
		if (product !== {} && product !== undefined) {
			let z = product.infoStock?.filter(function (e) {
				if (obj.color[e.color][1] == color && e.quantity !== 0) {
					return e.size;
				}
			});
			
			if (z && z.length > 0) {
				setFilteredProductSize(z);
				/* setSize(z[0].size); 
				updateQuantitySize(z);
				setImgSel(product.img[0]);
				setQuantity(1);
			}
		}
	}, [color]);

/* 	const updateQuantitySize = (arrFiltered) => {
		if (arrFiltered !== undefined) {
			let y = arrFiltered.filter(function (e) {
				if (e.size === size) {
					return e.quantity;
				}
			});

			setQuantityColorSize(y[0].quantity);
			setQuantity(1);
		}
	}; */

	const handleUpdateQuantity = ({ changeColor, changeSize }) => {
		if (product) {
			let calQtd = product.infoStock.filter(
				(e) => e.colorCode === (changeColor ? changeColor : color)
			);

			if (!calQtd || calQtd.length === 0) {
				return;
			}

			if (changeColor) {
				setColor(changeColor);
				setSize(calQtd[0].size);
				setQuantityColorSize(calQtd[0].quantity);
			} else {
				setSize(changeSize);
				let qtdSizeFiltered = calQtd.filter((e) => e.size === changeSize);
				setQuantityColorSize(qtdSizeFiltered?.[0]?.quantity);
			}

			setQuantity(1);
		}
	};

	const verifyStock = (data) => {
		let tempArr = [];
		let tempColor = [];
		for (let i = 0; i < data.infoStock.length; i++) {
			if (data.infoStock[i].quantity !== 0) {
				tempArr.push(data.infoStock[i]);
				if (
					tempColor.filter((e) => e === data.infoStock[i].color).length === 0
				) {
					tempColor.push(data.infoStock[i].color);
				}
			}
		}

		data = { ...data, infoStock: tempArr, color: tempColor };
		return data;
	};

	useEffect(() => {
		const getProduct = async () => {
			try {
				const res = await publicRequest.get("/products/find/" + id.toString());
				let filterData = verifyStock(res.data);
				setProduct(filterData);
				/* setColor(obj.color[filterData.infoStock[0].color][1]); */
				setColor(filterData.infoStock[0].colorCode);
				setSize(filterData.infoStock[0].size);
				setQuantityColorSize(filterData.infoStock[0].quantity);
				setImgSel(filterData.img[0]);
				setQuantity(1);
				setLoading(false);

				let tempArr = [];

				for (let i = 0; i < filterData.infoStock.length; i++) {
					tempArr.push(filterData.infoStock[i].colorCode);
				}
				setAvaiableColors([...new Set(tempArr)]);
			} catch {
				setLoading(false);
			}
		};
		getProduct();
	}, [id]);

	const handleQuantity = (type) => {
		if (type === "dec") {
			quantity > 1 && setQuantity(quantity - 1);
		} else {
			if (quantityColorSize > quantity) {
				setQuantity(quantity + 1);
			}
		}
	};

	const ProductAdded = (phase, color) => {
		setAddItemCart([phase, color]);
		setTimeout(() => {
			setAddItemCart(["ADICIONAR NO CARRINHO", "white"]);
		}, 2500);
	};

	const handleClick = () => {
		if (cart) {
			let index = undefined;

			let equalProducts = cart.products.filter((e, i) => {
				if (e.color == color && e.size == size && e._id == product._id) {
					index = i;
					return e;
				}
			});

			if (equalProducts && equalProducts.length > 0 && quantity) {
				if (quantity + equalProducts[0].quantity <= quantityColorSize) {
					dispatch(
						addMultiple({ product: product, index: index, addN: quantity })
					);
					ProductAdded("ADICIONAR NO CARRINHO!", "#2a9d8f");
				} else {
					ProductAdded("ADICIONAR NO CARRINHO!", "red");
				}
			} else {
				dispatch(addProduct({ ...product, quantity, color, size }));
				ProductAdded("ADICIONAR NO CARRINHO!", "#2a9d8f");
			}
		}
	};

	const handleClick2 = (direction) => {
		if (direction === "left") {
			setSlideIndex(slideIndex > 0 ? slideIndex - 1 : product.img.length - 1);
		} else {
			setSlideIndex(slideIndex < product.img.length - 1 ? slideIndex + 1 : 0);
		}
	};

	useEffect(() => {
		if (product !== {} && product !== undefined) {
			if (product.img !== undefined) {
				setImgSel(product.img[slideIndex]);
			}
		}
	}, [slideIndex]);

	function onZoom(e) {
		if (e.view.innerWidth > 1000) {
			// if not mobile
			const x = e.clientX - e.target.offsetLeft;
			const y = e.clientY - e.target.offsetTop;
			e.target.style.transformOrigin = `${x}px ${y}px`;
			e.target.style.transform = "scale(2.5)";
		}
	}
	function offZoom(e) {
		if (e.view.innerWidth > 1000) {
			e.target.style.transformOrigin = `center center`;
			e.target.style.transform = "scale(1)";
		}
	}

	const changePhoto = (arrow) => {
		if (arrow === "up") {
			if (slideMini < 0) {
				setSlideMini(slideMini + 15);
			}
		} else {
			if (slideMini > -15 * (product.img.length - 4)) {
				setSlideMini(slideMini - 15);
			}
		}
	};

	return (
		<Container>
			<Announcement categoriesGet={props?.categoriesGet} />
			{product?.inStock && !loading && (
				<>
					{product && product.img && (
						<ImgZoomed
							imgZoomed={imgZoomed}
							onTouchStart={onTouchStart}
							onTouchMove={onTouchMove}
							onTouchEnd={onTouchEnd}
						>
							<Arrow direction="left" onClick={() => handleClick2("left")}>
								<ArrowLeftOutlined />
							</Arrow>
							<ZoomedImgContainer>
								<CloseIcon onClick={() => setImgZoomed(false)}>
									<CloseOutlined />
								</CloseIcon>
								<ImgZommedImg src={imgSel} />
							</ZoomedImgContainer>

							<Arrow direction="right" onClick={() => handleClick2("right")}>
								<ArrowRightOutlined />
							</Arrow>
						</ImgZoomed>
					)}
					<Wrapper>
						<ImgContainer>
							<MiniImgContainer>
								{product && product.img && product.img.length > 4 && (
									<BoxArrow top={true} onClick={() => changePhoto("up")}>
										<ArrowUpwardOutlined style={{ color: "white", top: "0" }} />
									</BoxArrow>
								)}

								{product &&
									product.img &&
									product.img.map((e, i) => (
										<MiniImg
											transf={slideMini}
											onMouseOver={() => setImgSel(e)}
											key={uuid_v4()}
										>
											<MImage src={e} />
										</MiniImg>
									))}
								{product && product.img && product.img.length > 4 && (
									<BoxArrow bot={true} onClick={() => changePhoto("down")}>
										<ArrowDownwardOutlined style={{ color: "white" }} />
									</BoxArrow>
								)}
							</MiniImgContainer>

							{product && product.img && (
								<>
									<ZoomContainer
										onMouseMove={(e) => onZoom(e)}
										onMouseOver={(e) => onZoom(e)}
										onMouseLeave={(e) => offZoom(e)}
									>
										<Image src={imgSel} />
									</ZoomContainer>
									<SwipeContainer
										onTouchStart={onTouchStart}
										onTouchMove={onTouchMove}
										onTouchEnd={onTouchEnd}
									>
										<FullScreenIconContainer onClick={() => setImgZoomed(true)}>
											<Fullscreen />
										</FullScreenIconContainer>
										<Arrow
											direction="left"
											onClick={() => handleClick2("left")}
										>
											<ArrowLeftOutlined />
										</Arrow>
										<Image src={imgSel} />
										<Arrow
											direction="right"
											onClick={() => handleClick2("left")}
										>
											<ArrowRightOutlined />
										</Arrow>
									</SwipeContainer>
								</>
							)}
						</ImgContainer>

						<InfoContainer>
							<Title>{product.title}</Title>
							<Desc>{product.desc}</Desc>
							<Price>R$ {product.price}</Price>

							<Filter>
								<FilterTitle>Cor Principal</FilterTitle>
								{avaiableColors?.map((c) => (
									<FilterColorContainer key={uuid_v4()} activate={c === color}>
										<FilterColor
											/* color={obj.color[c][1]} */
											/* onClick={() => setColor(obj.color[c][1])} */
											color={c}
											onClick={() => handleUpdateQuantity({ changeColor: c })}
										/>
									</FilterColorContainer>
								))}
							</Filter>

							<Filter>
								<FilterTitle>Tamanho</FilterTitle>
								{/* <FilterSize onChange={(e) => setSize(e.target.value)}> */}
								<FilterSize
									onChange={(e) =>
										handleUpdateQuantity({ changeSize: e.target.value })
									}
									value={size || ""}
								>
									{product?.infoStock.map((s) => {
										if (s?.colorCode === color) {
											return (
												<FilterSizeOption key={uuid_v4()}>
													{s.size}
												</FilterSizeOption>
											);
										}
									})}
								</FilterSize>
							</Filter>

							<AddContainer>
								<AmountContainer>
									<Remove onClick={() => handleQuantity("dec")} />
									<Amount>{quantity}</Amount>
									<Add onClick={() => handleQuantity("inc")} />
								</AmountContainer>

								<Button color={addItemCart[1]} onClick={() => handleClick()}>
									<p>ADICIONAR NO CARRINHO</p>
									<InfoItemAddedContainer>
										{addItemCart && addItemCart[1] == "#2a9d8f" && (
											<InfoItemAdded>
												<p>ADICIONADO!</p>
											</InfoItemAdded>
										)}

										{addItemCart && addItemCart[1] == "red" && (
											<InfoItemAdded>QTD SUPERIOR AO ESTOQUE</InfoItemAdded>
										)}
									</InfoItemAddedContainer>
								</Button>
							</AddContainer>
							<QuantityContainer>
								<QuantityContainerText>
									{quantityColorSize} unidade(s) em estoque
								</QuantityContainerText>
							</QuantityContainer>
						</InfoContainer>
					</Wrapper>
				</>
			)}
			{product && !product.inStock && !loading && (
				<div>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<h1 style={{ margin: "20px" }}>Produto sem estoque</h1>
						<Button
							onClick={() => redHist("/products")}
							style={{ marginBottom: "40px" }}
						>
							Voltar às compras
						</Button>
					</div>
				</div>
			)}
			{loading && <>{loading && <div style={{ height: "600px" }}></div>}</>}
			{/* <Newsletter /> */}
			<Footer />
		</Container>
	);
};

export default Product;
