import "./productList.css";
import { DataGrid } from "@material-ui/data-grid";
import { DeleteOutline } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { userRequest } from "../../requestMethods";
import { deleteProduct, getProducts } from "../../redux/apiCalls";
import Product from "../product/Product";

export default function ProductList() {
	const admin = useSelector((state) => state?.user?.currentUser) || undefined;
	const [allProducts, setAllProducts] = useState(undefined);
	const [showProduct, setShowProduct] = useState(false);
	const [productInfo, setProductInfo] = useState(undefined);
	const [needUpdate, setNeedUpdate] = useState(true);
	const [deletion, setDeletion] = useState(undefined);
	const [newProduct, setNewProduct] = useState(false);

	const handleClick = (productObj) => {
		setProductInfo(productObj);
		setShowProduct(true);
	};

	const handleNewProduct = () => {
		setProductInfo(undefined);
		setNewProduct(true);
		setShowProduct(true);
	};

	useEffect(() => {
		if (needUpdate === true) {
			getproducts();
			setNeedUpdate(false);
		}
	}, [needUpdate]);

	const handleDelete = async (id) => {
		setDeletion(id);
		try {
			const res = await userRequest({ token: admin?.accessToken || "" }).delete(
				`/products/${id}`
			);
			setNeedUpdate(true);
			setDeletion(undefined);
		} catch (e) {
			console.log(e);
		}
	};

	const handleSetDeletion = (id) => {
		setDeletion(id);
	};

	const getproducts = async (page) => {
		try {
			const res = await userRequest({ token: admin?.accessToken || "" }).get(
				`/products/allproducts`
			);

			let tempArr = [];
			for (let i = 0; i < res.data.value.length; i++) {
				tempArr.push({ ...res.data.value[i], id: res.data.value[i]._id });
			}
			setAllProducts(tempArr);
		} catch (e) {
			console.log(e);
		}
	};

	const columns = [
		{ field: "id", headerName: "ID", width: 220 },
		{
			field: "product",
			headerName: "Product",
			width: 200,
			renderCell: (params) => {
				return (
					<div className="productListItem">
						<img className="productListImg" src={params.row.img[0]} alt="" />
						{params.row.title}
					</div>
				);
			},
		},
		{ field: "inStock", headerName: "Stock", width: 200 },
		{
			field: "price",
			headerName: "Price",
			width: 160,
		},
		{
			field: "action",
			headerName: "Action",
			width: 150,
			renderCell: (params) => {
				return (
					<>
						{deletion !== params.row.id ? (
							<>
								<button
									onClick={() => handleClick(params.row)}
									className="productListEdit"
								>
									Edit
								</button>
								<DeleteOutline
									className="productListDelete"
									onClick={() => handleSetDeletion(params.row._id)}
								/>
							</>
						) : (
							<>
								<button
									onClick={() => handleSetDeletion(undefined)}
									className="productListEdit"
								>
									Cancel
								</button>
								<button
									onClick={() => handleDelete(params.row._id)}
									className="productListEdit"
									style={{ backgroundColor: "red" }}
								>
									Delete
								</button>
							</>
						)}
					</>
				);
			},
		},
	];

	return (
		<div className="productList">
			{allProducts && (
				<>
					{!showProduct ? (
						<>
							<div style={{ marginBottom: "10px" }}>
								<button
									onClick={() => handleNewProduct()}
									className="productListEdit"
								>
									New Product
								</button>
							</div>
							<DataGrid
								rows={allProducts}
								disableSelectionOnClick
								columns={columns}
								pageSize={100}
							/>
						</>
					) : (
						<Product
							product={productInfo}
							admin={admin}
							setShowProduct={setShowProduct}
							setNeedUpdate={setNeedUpdate}
							setNewProduct={setNewProduct}
							newProduct={newProduct}
							setProductInfo={setProductInfo}
						/>
					)}
				</>
			)}
		</div>
	);
}
