import styled from "styled-components/macro";
import { categories } from "../data";
import { mobile } from "../responsive";
import CategoryItem from "./CategoryItem";
import { useState, useEffect } from "react";
import { publicRequest } from "../requestMethods";

const Container = styled.div`
	margin: 5px 0px;
	display: flex;
	flex-wrap: wrap;
	padding: 20px;
	justify-content: center;
	${mobile({ padding: "0px", flexDirection: "column", flexWrap: "nowrap" })}
`;

const Categories = (props) => {
	return (
		<Container>
			{props?.categoriesGet &&
				Object.values(props?.categoriesGet)?.map((item) => (
					<CategoryItem item={item} key={item._id} />
				))}
		</Container>
	);
};

export default Categories;
