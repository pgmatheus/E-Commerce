import "./productList.css";
import { DataGrid } from "@material-ui/data-grid";
import { DeleteOutline } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { userRequest } from "../../requestMethods";
import { deleteProduct, getProducts } from "../../redux/apiCalls";

export default function ProductList() {
	const admin = useSelector((state) => state?.user?.currentUser) || undefined;
	const [allProducts, setAllProducts] = useState(undefined);
	const [needUpdate, setNeedUpdate] = useState(true);
	const [showProduct, setShowProduct] = useState(false);
	const [productInfo, setProductInfo] = useState(undefined);

	const handleClick = (productObj) => {
		setProductInfo(productObj);
		setShowUser(true);
	};

	useEffect(() => {
		if (needUpdate === true) {
			getProducts();
			setNeedUpdate(false);
		}
	}, [needUpdate]);

	const handleDelete = (id) => {
		/* deleteProduct(id, dispatch); */
	};

	console.log(allProducts);

	const getProducts = async (page) => {
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
						<button
							onClick={() => handleClick(params.row)}
							className="productListEdit"
						>
							Edit
						</button>

						<DeleteOutline
							className="productListDelete"
							onClick={() => handleDelete(params.row._id)}
						/>
					</>
				);
			},
		},
	];

	return (
		<div className="productList">
			{allProducts && (
				<DataGrid
					rows={allProducts}
					disableSelectionOnClick
					columns={columns}
					getRowId={(row) => row._id}
					pageSize={100}
				/>
			)}
		</div>
	);
}
