import { ArrowLeftOutlined, ArrowRightOutlined } from "@material-ui/icons";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components/macro";
import { mobile } from "../responsive";
import { keyframes, css } from "styled-components";
import { publicRequest } from "../requestMethods";

const Container = styled.div`
	max-width: 100vw;
	height: 70vh;
	display: flex;
	position: relative;
	overflow: hidden;
	// ${mobile({ display: "none" })}
`;

const FadeInAnimation = keyframes`  
  from { opacity: 0; }
  to { opacity: 1; }
`;

const Arrow = styled.div`
	width: 50px;
	height: 50px;
	background-color: #fff7f7;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	position: absolute;
	top: 0;
	bottom: 0;
	left: ${(props) => props.direction === "left" && "10px"};
	right: ${(props) => props.direction === "right" && "10px"};
	margin: auto;
	cursor: pointer;
	opacity: 0.5;
	z-index: 2;
`;

const Wrapper = styled.div`
	height: 100%;
	display: flex;
	// transform: translateX(${(props) => props.slideIndex * -100}vw);
`;

const Slide = styled.div`
	width: 100vw;
	height: 100vh;
	display: flex;
	justify-content: center;
	// background-color: #${(props) => props.bg};
	/* background-color: #ff3cac;
	background-image: linear-gradient(
		225deg,
		#ff3cac 0%,
		#784ba0 50%,
		#2b86c5 100%
	); */
`;

const ImgContainer = styled.div`
	height: 100%;
	width: 100%;
	position: absolute;
	display: flex;
	justify-content: center;
	left: 0px;
`;

const Image = styled.img`
	/* 	height: 100vh; */
	width: 100%;
	opacity: ${(props) => (props.active === "true" ? 1 : 0)};
	transition: opacity ease-in-out 0.4s;
	animation: ${(props) =>
		props.active === "true"
			? css`
					${FadeInAnimation} 3s
			  `
			: "none"};
	object-fit: cover;
`;

const InfoContainer = styled.div`
	padding: 50px;
`;

const Title = styled.h1`
	font-size: 70px;
`;

const Desc = styled.p`
	margin: 50px 0px;
	font-size: 20px;
	font-weight: 500;
	letter-spacing: 3px;
`;

const Button = styled.button`
	padding: 10px;
	font-size: 20px;
	background-color: transparent;
	cursor: pointer;
`;

const Dot = styled.div`
	border-radius: 100%;
	width: 18px;
	height: 18px;
	background-color: ${(props) =>
		props.active === "true" ? "black" : "lightgray"};
	border: 1px solid black;
	margin: 0px 4px;
	cursor: pointer;
	&:hover {
		filter: brightness(0.9);
	}
`;

const DotContainer = styled.div`
	position: absolute;
	bottom: 10px;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 200px;
`;

const Slider = () => {
	const [slideIndex, setSlideIndex] = useState(0);
	const [sliderItems, setSliderItems] = useState({});

	const handleClick = (direction) => {
		if (direction === "left") {
			setSlideIndex(slideIndex > 0 ? slideIndex - 1 : sliderItems.length - 1);
		} else {
			setSlideIndex(slideIndex < sliderItems.length - 1 ? slideIndex + 1 : 0);
		}
	};

	const delay = 6000;
	const timeoutRef = useRef(null);
	function resetTimeout() {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
	}
	const tOut = useEffect(() => {
		resetTimeout();
		timeoutRef.current = setTimeout(
			() =>
				setSlideIndex((prevIndex) =>
					prevIndex === sliderItems.length - 1 ? 0 : prevIndex + 1
				),
			delay
		);
		return () => {};
	}, [slideIndex]);

	useEffect(() => {
		const getSlider = async () => {
			try {
				const res = await publicRequest.get("/slider");
				setSliderItems(res.data);
			} catch {}
		};
		getSlider();
	}, []);

	return (
		<Container>
			<Arrow direction="left" onClick={() => handleClick("left")}>
				<ArrowLeftOutlined />
			</Arrow>
			<Wrapper slideIndex={slideIndex}>
				<Slide>
					{Object.values(sliderItems)?.map((item, i) => (
						<ImgContainer key={i}>
							<Image
								active={slideIndex == i ? "true" : "false"}
								src={item.img}
							/>
						</ImgContainer>
					))}
					<DotContainer>
						{Object.values(sliderItems)?.map((slider, i) => (
							<Dot
								key={i}
								active={slideIndex == i ? "true" : "false"}
								onClick={() => setSlideIndex(i)}
							></Dot>
						))}
					</DotContainer>
				</Slide>
			</Wrapper>
			<Arrow direction="right" onClick={() => handleClick("right")}>
				<ArrowRightOutlined />
			</Arrow>
		</Container>
	);
};

export default Slider;
