import { Close, ArrowRightSharp } from "@material-ui/icons";
import { React, useState } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components/macro";
import { titleConvertValue } from "../data";

const Container = styled.div`
	width: 100%;
	margin-left: 20px;
`;

const ItemContainer = styled.div`
	margin-bottom: 30px;
`;

const NameContainer = styled.div`
	margin-bottom: 10px;
`;

const NameContainerText = styled.h4``;
const ListContainer = styled.div``;
const ListContainerItem = styled.div`
	display: flex;
	align-items: center;
	margin: 3px 0;
	cursor: pointer;
	width: fit-content;
`;
const ListContainerItemName = styled.p`
	margin-right: 4px;
	color: #666;
`;

const ListContainerItemQtd = styled.h6`
	color: lightgray;
	margin-right: 5px;
`;

const ColorContainer = styled.div`
	width: 12px;
	height: 12px;
	border-radius: 50%;
	background-color: ${(props) => props.color};
	border: 0.5px solid lightgray;
`;

const FilterBox = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	border: 0.5px solid black;
	width: fit-content;
	cursor: pointer;
	padding: 1px;
	margin: 3px 3px 3px 0;
`;

const FilterBoxText = styled.a`
	font-size: 10px;
	padding-left: 2px;
	width: fit-content;
`;

const FilterBoxContainer = styled.div`
	width: 100%;
	display: flex;
	flex-wrap: wrap;
`;

const PriceBoxContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: left;
`;

const BoxPrice = styled.input`
	width: 40px;
	height: 15px;
	margin-right: 10px;
	border: solid black 0.5 px;
`;

const FilterProd = ({ inp, all, qsearch }) => {
	const [searchStr1, setSearchStr1] = useState("");
	const [searchStr2, setSearchStr2] = useState("");
	let history = useHistory();
	let redHist = (e) => history.push("/products/" + e);
	let allm = []; // Unmodified query object
	Object.assign(allm, all);

	const onChange1 = (e) => {
		setSearchStr1(e.target.value);
	};

	const onChange2 = (e) => {
		setSearchStr2(e.target.value);
	};

	if (all !== undefined) {
		if (all.price !== undefined) {
			let z = all.price.replace("[", "").replace("]", "").split(","); // Unchanged array of price
			let strPrice = "";
			if (z[0] == 0) {
				strPrice = "Até R$" + z[1];
			} else if (z[0] != 0 && z[1] == Infinity) {
				strPrice = "Mais de R$" + z[0];
			} else {
				strPrice = "R$" + z[0] + " a R$" + z[1];
			}
			all.price = strPrice;
		}
		all = Object.entries(all);
	}

	// Escape regex special characters
	const escapeRegExp = (text) => {
		return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
	};

	const deleteFilter = (query, qsearch, allm) => {
		let strRep = query[0] + "=" + allm[query[0]];
		let nQuery = qsearch;

		if (nQuery.search(new RegExp(escapeRegExp(strRep + "&"))) > 0) {
			nQuery = nQuery.replace(strRep + "&", "");
		} else if (nQuery.search(escapeRegExp(strRep)) > 0) {
			nQuery = nQuery.replace(strRep, "");
		}
		redHist(nQuery);
	};

	const addFilter = (inp, qsearch, inpFilter) => {
		let aQuery = "";
		// aQuery = inp[i].filter + "=" + inp[i].valueFilter[k]
		aQuery = inp + "=" + inpFilter;

		if (qsearch.charAt(qsearch.length - 1) !== "&") {
			if (qsearch) {
				aQuery = "&" + aQuery;
			} else {
				aQuery = "?" + aQuery + "&";
			}
		}
		aQuery = qsearch + aQuery;

		redHist(aQuery);
	};

	let cObj = titleConvertValue();

	const priceRed = (searchStr1, searchStr2, qsearch) => {
		let temp = 0;

		if (parseInt(searchStr1) > parseInt(searchStr2)) {
			temp = searchStr1;
			searchStr1 = searchStr2;
			searchStr2 = temp;
		}

		if (!(parseInt(searchStr1) == 0 && parseInt(searchStr2) == 0)) {
			if (Number.isInteger(parseInt(searchStr1))) {
				searchStr1 = parseInt(searchStr1);
			} else {
				searchStr1 = 0;
			}
			if (Number.isInteger(parseInt(searchStr2))) {
				searchStr2 = parseInt(searchStr2);
			} else {
				searchStr2 = Infinity;
			}
			addFilter("price", qsearch, [searchStr1, searchStr2]);
		}
	};

	return (
		<Container>
			<ItemContainer>
				<NameContainer>
					<NameContainerText>Filtros</NameContainerText>
				</NameContainer>
				{all && (
					<FilterBoxContainer>
						{all.map(
							(query) =>
								query[0] !== "search" && (
									<FilterBox
										onClick={() => deleteFilter(query, qsearch, allm)}
										key={query[0]}
									>
										<FilterBoxText>
											{cObj?.[query[0]] !== undefined
												? cObj?.[query?.[0]]?.[query?.[1]]?.[0]
												: query?.[1]}
										</FilterBoxText>
										<Close style={{ fontSize: "10px", paddingLeft: "1px" }} />
									</FilterBox>
								)
						)}
					</FilterBoxContainer>
				)}
			</ItemContainer>

			{inp ? (
				inp.map(
					(e, i) =>
						allm[inp[i].filter] == undefined && (
							<ItemContainer key={e.title}>
								<NameContainer>
									<NameContainerText>{e.title}</NameContainerText>
								</NameContainer>
								<ListContainer>
									{e.value.map((v, k) => (
										<ListContainerItem
											onClick={() =>
												addFilter(inp[i].filter, qsearch, inp[i].valueFilter[k])
											}
											key={v[0]}
										>
											<ListContainerItemName>{v[0]}</ListContainerItemName>
											{v[1] && (
												<ListContainerItemQtd>({v[1]})</ListContainerItemQtd>
											)}
											{v[2] && <ColorContainer color={v[2]} />}
										</ListContainerItem>
									))}
								</ListContainer>
								{e.title == "Preço" && (
									<PriceBoxContainer>
										<BoxPrice
											placeholder="Min"
											type="number"
											min="0"
											step="1"
											value={searchStr1}
											onChange={onChange1}
										></BoxPrice>
										<BoxPrice
											placeholder="Max"
											type="number"
											min="0"
											step="1"
											value={searchStr2}
											onChange={onChange2}
										></BoxPrice>
										<ArrowRightSharp
											onClick={() => priceRed(searchStr1, searchStr2, qsearch)}
											style={{ cursor: "pointer", marginLeft: "-5px" }}
										/>
									</PriceBoxContainer>
								)}
							</ItemContainer>
						)
				)
			) : (
				<Container />
			)}
		</Container>
	);
};

export default FilterProd;
