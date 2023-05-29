import styled from "styled-components/macro";
import Announcement from "../components/Announcement";
import Products from "../components/Products";
/* import Newsletter from "../components/Newsletter"; */
import Footer from "../components/Footer";
import { mobile } from "../responsive";
import { useLocation } from "react-router";
import { useState, useEffect } from "react";
import FilterProd from "../components/FilterProd";
import axios from "axios";
import { titleConvertValue, filterCategories } from "../data";
import { publicRequest } from "../requestMethods";
import { useSelector } from "react-redux";
/* import { dog } from "../data"; */

/* let sidebar = document.querySelector(".sidebar");
let top = localStorage.getItem("sidebar-scroll"); */

const Container = styled.div``;

const Title = styled.h1`
	margin: 20px 0 0 20px;
`;

const FilterContainer = styled.div`
	display: flex;
	justify-content: flex-end;
`;

const Filter = styled.div`
	margin: 20px;
	${mobile({ width: "0px 20px", display: "flex", flexDirection: "column" })}
`;

const FilterText = styled.span`
	font-size: 20px;
	font-weight: 600;
	margin-right: 20px;
	${mobile({ marginRight: "0px" })}
`;

const Select = styled.select`
	padding: 10px;
	margin-right: 20px;
	${mobile({ margin: "10px 0px" })}
`;
const Option = styled.option``;

const FilterProductContainer = styled.div`
	display: flex;

	margin: auto;
`;

const CFilter = styled.div`
	min-width: 150px;
`;

const CProducts = styled.div`
	padding: 0px 50px;
`;

const UpContainter = styled.div`
	display: flex;
	justify-content: space-between;
`;

/* const inp2 = [
	
	{
		title: "Categoria",
		value: [
			["Vestido", "100"],
			["Cropped", "58"],
			["Saia", "500"],
		],
		filter: "categories",
		valueFilter: ["vestido", "cropped", "saia"],
	},
	{
		title: "Tamanho",
		value: [
			["P", "200"],
			["M", "300"],
			["G", "40"],
		],
		filter: "size",
		valueFilter: ["p", "m", "g"],
	},
	{
		title: "Cor Principal",
		value: [
			["Preto", "200", "#000000"],
			["Amarelo", "300", "#FFFF00"],
			["Verde", "40", "#00ff3c"],
		],
		filter: "color",
		valueFilter: ["preto", "amarelo", "verde"],
	},
	{
		title: "Preço",
		value: [["Até R$50"], ["R$50 a R$100"], ["Acima de R$100"]],
		filter: "price",
		valueFilter: ["[0,50]", "[50,100]", "[100,Infinity]"],
	},
]; */

const returnFilter = (dataServer, filterCategories) => {
	// return the quantity of items in each category
	let total = {};

	for (let i in filterCategories) {
		total[filterCategories[i]] = {};
		for (let j = 0; j < dataServer.length; j++) {
			for (let k in dataServer[j][filterCategories[i]]) {
				if (
					total[filterCategories[i]][dataServer[j][filterCategories[i]][k]] ==
					undefined
				) {
					total[filterCategories[i]][dataServer[j][filterCategories[i]][k]] = 1;
				} else {
					total[filterCategories[i]][dataServer[j][filterCategories[i]][k]]++;
				}
			}
		}
	}

	let cobj = titleConvertValue();
	let resObj = [];

	for (let o in filterCategories) {
		let tobj = {};
		// let value = [];
		let tarr = [];
		let cont = 0;
		let tobj2 = {};
		// let y = {};
		let z = "";
		tobj["title"] = cobj["title"][filterCategories[o]][0];
		tobj["filter"] = filterCategories[o];
		tobj["valueFilter"] = [];
		for (let l in total[filterCategories[o]]) {
			z = cobj[filterCategories[o]];

			tarr[cont] = [z?.[l]?.[0]];
			tarr[cont].push(total[filterCategories[o]][l]);

			if (z?.[l]?.[1] !== undefined) {
				tarr[cont].push(z[l][1]);
			}
			tobj["valueFilter"].push(l);
			cont++;
		}
		tobj["value"] = tarr;
		tarr = [];

		resObj.push(tobj);
	}
	resObj.push({
		title: "Preço",
		value: [["Até R$50"], ["R$50 a R$100"], ["Acima de R$100"]],
		filter: "price",
		valueFilter: ["[0,50]", "[50,100]", "[100,Infinity]"],
	});

	return resObj;
};

const filterProductsPrice = (products, allns, objV) => {
	let filteredProducts = [];

	if (objV !== undefined) {
		try {
			let price = objV.replace("[", "").replace("]", "").split(",");
			if (price[1] == Infinity) {
				price[1] = Math.exp(30);
			}
			/*       if (parseInt(price[0]) <= products[0]["price"]){
      } */
			for (let i = 0; i < products.length; i++) {
				if (
					parseInt(price[0]) <= products[i]["price"] &&
					parseInt(price[1]) >= products[i]["price"]
				) {
					filteredProducts.push(products[i]);
				}
			}
		} catch {
			filteredProducts = products;
		}
	} else {
		filteredProducts = products;
	}
	return filteredProducts;
};

const ProductList = (props) => {
	const [products, setProducts] = useState([]);
	const [filters, setFilters] = useState(undefined);
	const [filteredProducts, setFilteredProducts] = useState(undefined);
	const [urlToken, setUrlToken] = useState([]);
	const location = useLocation();
	let qsearch = location.search;
	let qobj = new URLSearchParams(qsearch);
	let search = qobj.get("search");
	let all = {};
	let allns = {};
	let queryns = ""; // query without search
	let cond = true;

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	qobj.forEach((val, key) => {
		all[key] = val;
		if (key !== "search") {
			allns[key] = val;
			queryns = queryns + key + "==" + val + ";;";
		}
		cond = false;
	});

	if (cond) {
		all = undefined;
		allns = undefined;
	}

	useEffect(() => {
		const getProducts = async () => {
			try {
				const res = await publicRequest.get(
					search ? `/products?search=${search}&filters=${filters}` : "/products"
				);

				setProducts(res.data);
			} catch (err) {}
		};
		getProducts();
	}, [search]);

	useEffect(() => {
		let cond = true;
		let cond2 = false;
		let objV = undefined;

		if (allns !== undefined) {
			for (let i in allns) {
				if (!filterCategories.includes(i) && i !== "price") {
					cond = false;
				}
				if (i == "price") {
					cond2 = true;
					objV = allns[i];
					delete allns["price"];
				}
			}
			if (cond) {
				setFilteredProducts(
					filterProductsPrice(
						products.filter((item) =>
							Object.entries(allns).every(([key, value]) =>
								item[key].includes(value)
							)
						),
						allns,
						objV
					)
				);
			}
		} else {
			setFilteredProducts(products);
		}
	}, [products, qsearch]);

	useEffect(() => {
		if (filteredProducts) {
			setFilters(returnFilter(filteredProducts, filterCategories));
		}
	}, [filteredProducts]);

	const [sort, setSort] = useState("newest");

	useEffect(() => {
		if (sort === "newest") {
			setFilteredProducts((prev) =>
				[...prev].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
			);
		} else if (sort === "asc") {
			setFilteredProducts((prev) =>
				[...prev].sort((a, b) => a.price - b.price)
			);
		} else {
			setFilteredProducts((prev) =>
				[...prev].sort((a, b) => b.price - a.price)
			);
		}
	}, [sort]);

	return (
		<Container>
			{/* <button onClick={() => handleGetToken()}>vaiiiii</button> */}
			<Announcement categoriesGet={props?.categoriesGet} />
			<UpContainter>
				<Title>{qobj.get("search")}</Title>
				<Filter>
					<FilterText>Ordenar por:</FilterText>
					<Select onChange={(e) => setSort(e.target.value)}>
						<Option value="newest">Novidades</Option>
						<Option value="asc">Preço (asc)</Option>
						<Option value="desc">Preço (desc)</Option>
					</Select>
				</Filter>
			</UpContainter>

			<FilterProductContainer>
				<CFilter>
					<FilterProd inp={filters} all={all} qsearch={qsearch}></FilterProd>
				</CFilter>
				<CProducts>
					<Products
						search={search}
						fProducts={filteredProducts}
						filters={allns}
						sort={sort}
					/>
				</CProducts>
			</FilterProductContainer>
			{/* <Newsletter /> */}
			<Footer />
		</Container>
	);
};

export default ProductList;
