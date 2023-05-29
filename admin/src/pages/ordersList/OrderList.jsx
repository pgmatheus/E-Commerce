import "./orderList.css";
import { DataGrid } from "@material-ui/data-grid";
import { DeleteOutline } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { userRequest } from "../../requestMethods";
import { deleteOrder, getOrders } from "../../redux/apiCalls";
import { v4 as uuid_v4 } from "uuid";
import Order from "../order/Order";

const orderEvents = [
	"Aguardando pagamento",
	"Expirado/Recusado",
	"Pago",
	"Pedido enviado",
	"Entregue",
	"Reembolsado",
	"Compra expirada",
];

export default function OrderList() {
	const admin = useSelector((state) => state?.user?.currentUser) || undefined;
	const [allOrders, setAllOrders] = useState(undefined);
	const [showOrder, setShowOrder] = useState(false);
	const [orderInfo, setOrderInfo] = useState(undefined);
	const [needUpdate, setNeedUpdate] = useState(true);
	const [deletion, setDeletion] = useState(undefined);
	const [newOrder, setNewOrder] = useState(false);
	const [loading, setLoading] = useState(false);

	const handleClick = (orderObj) => {
		setOrderInfo(orderObj);
		setShowOrder(true);
	};

	const handleNewOrder = () => {
		setOrderInfo(undefined);
		setNewOrder(true);
		setShowOrder(true);
	};

	useEffect(() => {
		if (needUpdate === true) {
			getorders();
			setNeedUpdate(false);
		}
	}, [needUpdate]);

	const handleDelete = async (id) => {
		/* setDeletion(id);
		try {
			const res = await userRequest({ token: admin?.accessToken || "" }).delete(
				`/orders/${id}`
			);
			setNeedUpdate(true);
			setDeletion(undefined);
		} catch (e) {
			console.log(e);
		} */
	};

	/* const handleSetDeletion = (id) => {
		setDeletion(id);
	}; */

	const getorders = async (page) => {
		try {
			const res = await userRequest({ token: admin?.accessToken || "" }).get(
				`/users/`
			);
			if (!res) {
				throw new Error("Error connecting to DB");
			}
			let tempArr = [];
			let cont = 0;
			for (let i = 0; i < res.data.length; i++) {
				for (let j = 0; j < res.data[i].orders.length; j++) {
					let orderObj = {
						...res.data[i].orders[j],
						userId: res.data[i]["_id"] + "",
						indexOrder: j,
						id: res.data[i].orders[j]["_id"],
						cont: cont,
					};
					cont++;
					tempArr.push(orderObj);
				}
			}
			setAllOrders(tempArr);
		} catch (e) {
			console.log(e);
		}
	};

	const handleChangePayStatus = (index, status) => {
		let tempArr = allOrders.slice();
		tempArr[index] = { ...tempArr[index], status: status };
		setAllOrders(tempArr);
	};

	const handleChangeShippingCode = (index, shippingCode) => {
		let tempArr = allOrders.slice();
		tempArr[index] = { ...tempArr[index], shippingCode: shippingCode };
		setAllOrders(tempArr);
	};

	const handleUpdateInfo = async (index) => {
		setLoading(true);
		try {
			const email = allOrders?.[index]?.info?.payment?.sender?.email;
			const payStatus = allOrders?.[index]?.status;
			const shippingCode = allOrders?.[index]?.shippingCode;
			const indexOrder = allOrders?.[index]?.indexOrder;
			const res = await userRequest({ token: admin?.accessToken || "" }).put(
				`users/updatepaystatusandshippingcode`,
				{ email, payStatus, shippingCode, indexOrder }
			);

			if (!res) {
				throw new Error("Error connecting DB");
			}

			setNeedUpdate(true);

			setLoading(false);
		} catch (err) {
			setLoading(false);
		}
	};

	const columns = [
		{
			field: "UserEmail",
			headerName: "UserEmail",
			width: 200,
			renderCell: (params) => {
				return (
					<div className="orderListItem">
						{params?.row?.info?.payment?.sender?.email}
					</div>
				);
			},
		},
		{
			field: "Value",
			headerName: "Value",
			width: 110,
			renderCell: (params) => {
				return <div className="orderListItem">R${params?.row?.info?.sum}</div>;
			},
		},
		{
			field: "Date",
			headerName: "Date",
			width: 110,
			renderCell: (params) => {
				return (
					<div className="orderListItem">
						{params?.row?.info?.createdAt?.slice(0, 10)}
					</div>
				);
			},
		},
		{
			field: "Pay",
			headerName: "Pay",
			width: 100,
			renderCell: (params) => {
				return <div className="orderListItem">{params?.row?.method}</div>;
			},
		},
		{
			field: "Payment Status",
			headerName: "Payment Status",
			width: 200,
			renderCell: (params) => {
				return (
					<div className="orderListItem">
						<select
							onChange={(f) => {
								handleChangePayStatus(params?.row?.cont, f.target.value);
							}}
							value={params?.row?.status || ""}
						>
							{orderEvents?.map((e) => {
								return <option key={uuid_v4()}>{e}</option>;
							})}
						</select>
					</div>
				);
			},
		},
		{
			field: "Shipping Code",
			headerName: "Shipping Code",
			width: 200,
			renderCell: (params) => {
				return (
					<div className="orderListItem">
						<input
							onChange={(f) => {
								handleChangeShippingCode(params?.row?.cont, f.target.value);
							}}
							defaultValue={params?.row?.shippingCode}
							type="text"
						></input>
					</div>
				);
			},
		},
		{
			field: "Save",
			headerName: "Save",
			width: 110,
			renderCell: (params) => {
				return (
					<div className="orderListItem">
						<button
							onClick={() => handleUpdateInfo(params?.row?.cont)}
							className="orderListEdit"
							disabled={loading}
							style={{
								backgroundColor: `${loading ? "gray" : "#3bb077"}`,
							}}
						>
							Save
						</button>
					</div>
				);
			},
		},
		{
			field: "Detais",
			headerName: "Detais",
			width: 120,
			renderCell: (params) => {
				return (
					<button
						onClick={() => handleClick(params?.row)}
						className="orderListEdit"
						disabled={loading}
						style={{
							backgroundColor: `${loading ? "gray" : "#3bb077"}`,
						}}
					>
						View{" "}
					</button>
				);
			},
		},
	];

	return (
		<div className="orderList">
			{allOrders && (
				<>
					{!showOrder ? (
						<>
							<DataGrid
								rows={allOrders}
								disableSelectionOnClick
								columns={columns}
								pageSize={100}
							/>
						</>
					) : (
						<>
							<Order
								order={orderInfo}
								admin={admin}
								setShowOrder={setShowOrder}
								setNeedUpdate={setNeedUpdate}
								setNewOrder={setNewOrder}
								newOrder={newOrder}
								setOrderInfo={setOrderInfo}
							/>
						</>
					)}
				</>
			)}
		</div>
	);
}
