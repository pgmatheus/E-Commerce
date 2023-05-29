import { useEffect, useState } from "react";
import styled from "styled-components";
import Product from "./Product";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { publicRequest } from "../requestMethods";

const Container = styled.div`
	display: flex;
	// width: 15vw;
	flex-wrap: wrap;
	justify-content: center;
`;

const Products = ({ search, filters, sort, fProducts }) => {
	const [products, setProducts] = useState([]);
	const [filteredProducts, setFilteredProducts] = useState([]);

	useEffect(() => {
		if (!fProducts) {
			const getProducts = async () => {
				try {
					const res = await publicRequest.get("/products");
					setProducts(res.data);
					/*         if (Object.keys(filters).length == 0){
          setFilteredProducts(res.data);
        } */
				} catch (err) {}
			};
			getProducts();
		}
	}, [search]);

	/* useEffect(() => {
  if (filters !== undefined && filters !== []){
    setFilteredProducts(
      products.filter((item) =>
        Object.entries(filters).every(([key, value]) =>
          item[key].includes(value)
        )
      )
    )
  }
  }, [filters]); */

	/*   useEffect(() => {
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
  }, [sort]); */

	return (
		<Container>
			{fProducts
				? fProducts.map((item) => <Product item={item} key={item._id} />)
				: products
						.slice(0, 14)
						.map((item) => <Product item={item} key={item._id} />)}
		</Container>
	);
};

export default Products;
