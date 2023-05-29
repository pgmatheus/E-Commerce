import styled from "styled-components";
import {
	CalendarToday,
	LocationSearching,
	MailOutline,
	PermIdentity,
	PhoneAndroid,
	Publish,
	Close,
} from "@material-ui/icons";
import app from "../../firebase";
import { Link } from "react-router-dom";
import "./product.css";
import { userRequest } from "../../requestMethods";
import { useEffect, useState } from "react";
import Infostock, {
	returnFiltered,
} from "../../components/infostock/Infostock";
import { v4 as uuid_v4 } from "uuid";
import {
	getStorage,
	ref,
	uploadBytesResumable,
	getDownloadURL,
} from "firebase/storage";
import { returnOnlyNumber } from "../../utilities/returnnumber";
import { compareObjects } from "../../utilities/compareObjects";

const CategoryDiv = styled.div`
	display: flex;
	margin-bottom: 10px;
`;

const CategoryChosen = styled.div`
	display: flex;
	margin-left: 10px;
	background-color: lightgray;
	border-radius: 4px;
	padding: 1px;
`;

const {
	colors,
	sizesAllowed,
	searchColor,
	categoryAllowed,
} = require("../../database/database");
const { consultarCep } = require("correios-brasil");

const ImgPreview = styled.img`
	width: 100px;
	height: 100px;
	object-fit: cover;
	/* max-height: 100px; */
`;

const Dropdown = styled.div`
	background-color: white;
	display: flex;
	flex-direction: column;
	position: absolute;
	bottom: 40px;
	z-index: 10;
	width: 200px;
	border: 1px solid gray;
	&:empty {
		border: none;
	}
`;

const OtherImagesContainer = styled.div`
	display: flex;
	max-width: 500px;
	flex-wrap: wrap;
`;

const ImgPreviewContainer = styled.div`
	position: relative;
	display: flex;
`;

const DropdownRow = styled.div`
	cursor: pointer;
	text-align: start;
	margin: 10px 0;
`;

const ProductUpdateItem = styled.div`
	display: flex;
	flex-direction: column;
	margin-top: 10px;
	position: relative;
`;

const Button = styled.button``;

const ErrP = styled.p`
	color: red;
	text-align: center;
	margin-top: 10px;
`;

export default function Product(props) {
	let product = props?.product || undefined;
	const [title, setTitle] = useState(product?.title || "");
	const [desc, setDesc] = useState(product?.desc || "");
	const [price, setPrice] = useState(product?.price || "");
	const [bprice, setBprice] = useState(product?.bprice || "");
	const [loading, setLoading] = useState(false);
	const [showDropBoxCategory, setShowDropBoxCategory] = useState(false);
	let id = product?._id + "" || "";
	/* const [showMsg, setShowMessage] = useState({
		show: false,
		message: "",
	}); */

	/* const infoStock = product?.infoStock || []; */
	const [infoStock, setInfoStock] = useState(product?.infoStock?.slice() || []);
	const [infoStockIndex, setInfoStockIndex] = useState(
		product?.infoStock?.length || 0
	);

	const [categories, setCategories] = useState(product?.categories || []);
	const [tempCategory, setTempCategory] = useState("");
	const [dropdownCategory, setDropdownCategory] = useState(undefined);
	const [displayFile, setDisplayFile] = useState([]);
	/* const [otherFiles, setOtherFiles] = useState([]); */
	const [otherFiles, setOtherFiles] = useState([]);
	const [displayFileToUpdate, setDisplayFileToUpdate] = useState([]);
	const [productInstock, setProductInstock] = useState(false);

	const [othersFilesToUpdate, setOthersFilesToUpdate] = useState(
		Array.apply(
			null,
			Array(product?.img?.length > 1 ? product?.img?.length - 1 : 0)
		).map(function () {}) || []
	);

	const [previewDisplay, setPreviewDisplay] = useState(
		[product?.img?.[0]] || [undefined]
	);
	const [previewOthers, setPreviewOthers] = useState(
		product?.img?.length > 1 ? product.img.slice(1) : []
	);
	const [imgDB, setImgDB] = useState([]);
	const [updateOthers, setUpdateOthers] = useState(false);
	const [showError, setShowError] = useState([false, ""]);

	const returnedData = (data) => {
		if (data?.success && data?.delete) {
			let tempArr = infoStock.slice();
			tempArr.splice(data.index, 1);
			setInfoStockIndex((st) => st - 1);
			return setInfoStock(tempArr);
		}
		if (data?.success?.success) {
			let z = compareObjects(data?.value, infoStock?.[data?.index]);
			if (z && !z.success) {
				let tempArr = infoStock.slice();
				tempArr[data.index] = data?.value;
				setInfoStock(tempArr);
			}
		}
	};

	const handleAddCategory = () => {
		let tempArr = categories.slice();
		tempArr.push(tempCategory);
		setCategories(tempArr);
	};

	const handleAddPhoto = async (e) => {
		setUpdateOthers(true);
		setDisplayFile(e.target.files);
		setDisplayFileToUpdate([e.target.files[0]]);
	};

	const handleAddPhotos = (e) => {
		let files = e.target.files;
		let tempArr = [];
		if (othersFilesToUpdate?.length === 0) {
			tempArr = joinArr(files);
		} else {
			tempArr = othersFilesToUpdate.slice();
			tempArr = tempArr.concat(joinArr(files));
		}
		setOtherFiles(e.target.files);
		setOthersFilesToUpdate(tempArr);
	};

	const joinArr = (arr) => {
		let tempArr = [];
		for (let i = 0; i < arr.length; i++) {
			tempArr.push(arr[i]);
		}
		return tempArr;
	};

	const handleDeleteCategory = (i) => {
		let tempArr = categories.slice();
		if (tempArr?.length > 0) {
			tempArr.splice(i, 1);
			setCategories(tempArr);
		}
	};

	useEffect(() => {
		if (tempCategory && categoryAllowed) {
			setShowDropBoxCategory(true);
			let lowerInput = tempCategory?.toLowerCase();

			let result = returnFiltered({
				searchedTerm: lowerInput,
				DBsearch: categoryAllowed,
			});
			setDropdownCategory(result);
		} else {
			setDropdownCategory(undefined);
		}
	}, [tempCategory]);

	const getInfostock = () => {
		try {
			if (!infoStock || infoStock.length < 1) {
				throw new Error("Error getting info stock");
			}
			let tempArr = [];
			let tempArrColor = [];
			let tempArrSize = [];
			let stock = false;
			for (let i = 0; i < infoStock.length; i++) {
				let tempColor = colors[infoStock[i].colorDisplay.replaceAll(" ", "")];
				if (infoStock[i].quantity > 0) {
					stock = true;
				}
				tempArr.push({
					quantity: infoStock[i].quantity,
					size: infoStock[i].size,
					color: tempColor.color,
					categories: categories,
					colorCode: tempColor.colorCode,
					colorDisplay: tempColor.colorDisplay,
					heigth: 0,
					width: 0,
					price: price,
				});

				if (!tempArrColor.includes(tempColor.color)) {
					tempArrColor.push(tempColor.color);
				}
				if (!tempArrSize.includes(infoStock[i].size)) {
					tempArrSize.push(infoStock[i].size);
				}
			}
			return {
				success: true,
				value: tempArr,
				tempArrColor: tempArrColor,
				tempArrSize: tempArrSize,
				stock,
				stock,
			};
		} catch (err) {
			console.log(err);
			return { success: false, message: err.message };
		}
	};

	const finishedPage = () => {
		let blobList = (previewDisplay || []).concat(previewOthers || []);

		if (blobList?.length > 0) {
			for (let i = 0; i < blobList.length; i++) {
				URL.revokeObjectURL(blobList[i]);
			}
		}
		props?.setProductInfo(undefined);
		setShowError([false, ""]);
		props?.setNewProduct(false);
		setLoading(false);
		props?.setShowProduct(false);
	};

	const handleUpdate = async () => {
		setLoading(true);

		try {
			let img = [];

			if (!title) {
				throw new Error("Need title");
			}

			if (!desc) {
				throw new Error("Need description");
			}

			if (!previewDisplay || previewDisplay.length < 1) {
				throw new Error("Need display photo");
			}

			if (
				previewOthers &&
				previewOthers?.length > 0 &&
				previewOthers?.[0] !== undefined
			) {
				img = [previewDisplay].concat(previewOthers);
			} else {
				img.push(previewDisplay);
			}

			if (!img || img.length < 1) {
				throw new Error("Error merging data");
			}

			if (!categories || categories.length < 1) {
				throw new Error("Need categories");
			}

			let allInputsCategoryValid = categories.every((v) =>
				categoryAllowed.includes(v)
			);

			if (!allInputsCategoryValid) {
				throw new Error("Invalid category added");
			}

			if (!price) {
				throw new Error("Need price");
			}

			let tempPrice = parseFloat(price.toString().replace(",", ".")).toFixed(2);

			if (!tempPrice || tempPrice < 0.01 || tempPrice === "NaN") {
				throw new Error("Error converting price");
			}

			let tempBPrice;

			if (bprice) {
				tempBPrice = parseFloat(bprice.toString().replace(",", ".")).toFixed(2);

				if (!tempBPrice || tempBPrice < 0.01 || tempBPrice === "NaN") {
					throw new Error("Error converting bprice");
				}
			}

			let dbInfoStock = getInfostock();

			if (!dbInfoStock || dbInfoStock?.success === false) {
				throw new Error(dbInfoStock?.message || "Error getting info stock");
			}

			let mergeFiles = [];

			let mergeSrc =
				(displayFileToUpdate?.[0] !== undefined
					? displayFileToUpdate
					: previewDisplay
				)?.concat(previewOthers) || displayFileToUpdate;

			if (!displayFile || displayFile.length === 0) {
				mergeFiles = [undefined].concat(othersFilesToUpdate);
			} else {
				mergeFiles = [displayFile[0]].concat(othersFilesToUpdate);
			}

			let uploadedImgs = await handleClick({ arr: mergeFiles, img: mergeSrc });

			if (!uploadedImgs || uploadedImgs.success === false) {
				throw new Error(uploadedImgs?.message || "Error uploading image");
			}

			if (props?.newProduct) {
				await userRequest({
					token: props?.admin?.accessToken || "",
				}).post(`/products/`, {
					title: title,
					desc: desc,
					img: uploadedImgs?.tempArr,
					infoStock: dbInfoStock?.value,
					categories: categories,
					size: dbInfoStock.tempArrSize,
					color: dbInfoStock.tempArrColor,
					inStock: dbInfoStock.stock,
					price: parseFloat(tempPrice),
					bprice: parseFloat(tempBPrice) || 0,
				});
			} else {
				await userRequest({
					token: props?.admin?.accessToken || "",
				}).put(`/products/${id}`, {
					title: title,
					desc: desc,
					img: uploadedImgs?.tempArr,
					infoStock: dbInfoStock?.value,
					categories: categories,
					size: dbInfoStock.tempArrSize,
					color: dbInfoStock.tempArrColor,
					inStock: dbInfoStock.stock,
					price: parseFloat(tempPrice),
					bprice: parseFloat(tempBPrice) || 0,
				});
			}
			props?.setNeedUpdate(true);
			finishedPage();
			/* props?.setProductInfo(undefined);
			setShowError([false, ""]);
			props?.setNewProduct(false); */

			/* setLoading(false);
			props?.setShowProduct(false); */
		} catch (err) {
			setLoading(false);
			console.log(err);
			return setShowError([
				true,
				err?.response?.data?.message || err?.message || "Error",
			]);
		}
	};

	const handleClick = async ({ arr: arr, img: img }) => {
		let tempArr = [];

		try {
			for (let i = 0; i < arr.length; i++) {
				if (arr[i]) {
					let fileName = new Date().getTime() + arr[i].name;
					let storage = getStorage(app);
					let storageRef = ref(storage, fileName);
					let uploadTask = await uploadBytesResumable(storageRef, arr[i]);

					if (!uploadTask) {
						return { success: false };
					}

					let ImageURL = await getDownloadURL(ref(storage, `${fileName}`));
					tempArr.push(ImageURL);
				} else {
					tempArr.push(img[i]);
				}
			}
			return { success: true, tempArr: tempArr };
		} catch (err) {
			throw new Error(
				err?.message || "Error uploading files, try agains later"
			);
		}
	};

	const getUrl = (fileObj) => {
		if (!fileObj || fileObj.length === 0) {
			return { success: false };
		}
		let tempArray = [];
		for (let i = 0; i < fileObj.length; i++) {
			if (fileObj[i]) {
				let objectUrl = URL.createObjectURL(fileObj[i]);
				tempArray.push(objectUrl);
			}
		}

		return { success: true, tempArray: tempArray };
	};

	const handleDeleteDisplayPhoto = () => {
		URL.revokeObjectURL(previewDisplay[0]);
		setPreviewDisplay(undefined);
		setDisplayFile([]);
		setDisplayFileToUpdate([undefined]);
	};

	const handleDeleteOtherPhoto = (index) => {
		URL.revokeObjectURL(previewOthers[index]);
		let tempArray = previewOthers.slice();
		tempArray.splice(index, 1);
		let tempArray2 = othersFilesToUpdate.slice();
		tempArray2.splice(index, 1);
		setPreviewOthers(tempArray);
		setOthersFilesToUpdate(tempArray2);
	};

	useEffect(() => {
		if (previewDisplay?.[0]) {
			URL.revokeObjectURL(previewDisplay[0]);
		}

		let getUrlList = getUrl(displayFile);

		if (!getUrlList || getUrlList.success === false) {
			return;
		}

		setPreviewDisplay(getUrlList.tempArray);
	}, [displayFile]);

	useEffect(() => {
		let getUrlList = getUrl(otherFiles);

		/* if (previewOthers?.length > 0) {
			for (let i = 0; i < previewOthers.length; i++) {
				URL.revokeObjectURL(previewOthers[i]);
			}
		} */

		if (!getUrlList || getUrlList.success === false) {
			return;
		}

		setPreviewOthers(previewOthers.concat(getUrlList.tempArray));
	}, [otherFiles]);

	return (
		<>
			{/* {product && ( */}
			<div className="product">
				<div className="productTitleContainer">
					<h1 className="productTitle">
						{props?.newProduct === true ? "New Product" : "Edit Product"}
					</h1>
					<button
						onClick={() => {
							finishedPage();
							/* props?.setShowProduct(false);
							props?.setNewProduct(false);
							props?.setProductInfo(undefined); */
						}}
					>
						Back
					</button>
				</div>

				<div className="productContainer">
					{/* <div className="productShow">
							<div className="productShowTop">
								<div className="productShowTopTitle">
									<span className="productShowProductname">{title || ""}</span>
								</div>
							</div>
							<div className="productShowBottom">
								<span className="productShowTitle">Contact Details</span>
								<div className="productShowInfo">
									<PhoneAndroid className="productShowIcon" />
									<span className="productShowInfoTitle">{price || ""}</span>
								</div>
								<div className="productShowInfo">
									<MailOutline className="productShowIcon" />
									<span className="productShowInfoTitle">{desc || ""}</span>
								</div>

								{product?.currentAddress?.map((ad, i) => {
									return (
										<div
											className="productShowInfo"
											key={`${ad.localidade + i}%`}
										>
											<LocationSearching className="productShowIcon" />
											<span className="productShowInfoTitle"></span>
										</div>
									);
								})}
							</div>
						</div> */}

					<div className="productUpdate">
						<span className="productUpdateTitle">Edit</span>
						{/* {showMsg?.show && (
								<p style={{ color: "red" }}>{showMsg.message}</p>
							)} */}
						<div className="productUpdateForm">
							<div className="productUpdateLeft">
								<div className="productUpdateItem">
									<label>Display Photo</label>
									<input
										type="file"
										id="file"
										onChange={(e) => handleAddPhoto(e)}
									/>
								</div>
								<br />
								{previewDisplay?.[0] !== undefined && (
									<ImgPreviewContainer>
										<ImgPreview src={previewDisplay} />
										<Close
											style={{
												fontSize: "20px",
												cursor: "pointer",
												position: "absolute",
												top: "0px",
												left: "80px",
												backgroundColor: "white",
												borderRadius: "50px",
											}}
											onClick={() => handleDeleteDisplayPhoto()}
										/>
									</ImgPreviewContainer>
								)}
								{/* <button onClick={(e) => handleClick(e)}>aaaaa</button> */}
								<div className="productUpdateItem">
									<label>More Photos</label>
									<input
										type="file"
										id="file"
										onChange={(e) => handleAddPhotos(e)}
										multiple
									/>
								</div>
								<br />
								<OtherImagesContainer>
									{previewOthers?.map((e, i) => (
										<ImgPreviewContainer
											style={{ margin: "5px" }}
											key={uuid_v4()}
										>
											<ImgPreview src={e} />
											<Close
												style={{
													fontSize: "20px",
													cursor: "pointer",
													position: "absolute",
													top: "0px",
													left: "80px",
													backgroundColor: "white",
													borderRadius: "50px",
												}}
												onClick={() => handleDeleteOtherPhoto(i)}
											/>
										</ImgPreviewContainer>
									))}
								</OtherImagesContainer>
								<div className="productUpdateItem">
									<label>Title</label>
									<input
										defaultValue={product?.title || ""}
										onChange={(e) => setTitle(e.target.value)}
										type="text"
										className="productUpdateInput"
									/>
								</div>
								{/* 								<div className="productUpdateItem">
										<label>Full Name</label>
										<input
											type="text"
											placeholder="Anna Becker"
											className="productUpdateInput"
										/>
									</div> */}
								<div className="productUpdateItem">
									<label>Description</label>
									<input
										defaultValue={product?.desc || ""}
										onChange={(e) => setDesc(e.target.value)}
										type="text"
										className="productUpdateInput"
									/>
								</div>
								<div className="productUpdateItem">
									<label>Current price</label>
									<input
										defaultValue={product?.price || ""}
										onChange={(e) => setPrice(e.target.value)}
										type="text"
										className="productUpdateInput"
									/>
								</div>
								<div className="productUpdateItem">
									<label>Before price</label>
									<input
										defaultValue={product?.bprice || ""}
										onChange={(e) => setBprice(e.target.value)}
										type="text"
										className="productUpdateInput"
									/>
								</div>
								<div className="productUpdateItem">
									<CategoryDiv>
										<label>Categories</label>
										{categories?.map((e, i) => (
											<CategoryChosen key={uuid_v4()}>
												<p>{e}</p>
												<Close
													style={{ fontSize: "20px", cursor: "pointer" }}
													onClick={() => handleDeleteCategory(i)}
												/>
											</CategoryChosen>
										))}
									</CategoryDiv>
									<div style={{ position: "relative" }}>
										<input
											value={tempCategory}
											onChange={(e) => setTempCategory(e.target.value)}
											type="text"
											className="productUpdateInput"
										/>
										<Dropdown>
											{showDropBoxCategory &&
												dropdownCategory?.map((item) => (
													<DropdownRow
														onClick={() => {
															setTempCategory(item);
															setShowDropBoxCategory(false);
														}}
														key={uuid_v4()}
													>
														{item}
													</DropdownRow>
												))}
										</Dropdown>
										<button
											style={{ marginLeft: "10px" }}
											onClick={() => handleAddCategory()}
										>
											Add
										</button>
									</div>
								</div>

								{[...Array(infoStockIndex)].map((e, i) => {
									return (
										<div key={uuid_v4()}>
											<br />
											<Infostock
												setInfoStockIndex={setInfoStockIndex}
												index={i}
												func={returnedData}
												key={uuid_v4()}
												infoStock={infoStock?.[i] || {}}
												colors={colors}
												sizesAllowed={sizesAllowed}
												searchColor={searchColor}
												categoryAllowed={categoryAllowed}
												style={{ marginTop: "20px", backgroundColor: "red" }}
											/>
										</div>
									);
								})}
								<ProductUpdateItem>
									<Button onClick={() => setInfoStockIndex((st) => st + 1)}>
										Add info
									</Button>
								</ProductUpdateItem>
								{showError?.[0] && <ErrP>{showError[1]}</ErrP>}
							</div>
							<div className="productUpdateRight">
								<div className="productUpdateUpload">
									{/* <img
											className="productUpdateImg"
											src="https://images.pexels.com/photos/1152994/pexels-photo-1152994.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
											alt=""
										/> 
										<label htmlFor="file">
											<Publish className="productUpdateIcon" />
										</label>
										<input type="file" id="file" style={{ display: "none" }} />*/}
								</div>
								{!loading ? (
									<button
										disabled={loading}
										onClick={() => handleUpdate()}
										type="button"
										className="productUpdateButton"
									>
										{props?.newProduct === true ? "Create" : "Update"}
									</button>
								) : (
									<button
										disabled={true}
										style={{ backgroundColor: "lightgray" }}
									>
										{props?.newProduct === true ? "Create" : "Update"}
									</button>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
			{/* )} */}
		</>
	);
}
