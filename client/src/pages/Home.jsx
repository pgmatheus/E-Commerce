import React from "react";
import Announcement from "../components/Announcement";
import Categories from "../components/Categories";
import Footer from "../components/Footer";
/* import Newsletter from "../components/Newsletter"; */
import Products from "../components/Products";
import Slider from "../components/Slider";
import { useEffect } from "react";

const Home = (props) => {
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	return (
		<div style={{ backgroundColor: "#f8f9fa" }}>
			<Announcement categoriesGet={props?.categoriesGet} />
			<Slider />
			<Categories categoriesGet={props?.categoriesGet} />
			<Products />
			{/* <Newsletter /> */}
			<Footer />
		</div>
	);
};

export default Home;
