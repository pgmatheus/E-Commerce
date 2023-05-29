import "./userList.css";
import { DataGrid } from "@material-ui/data-grid";
import { DeleteOutline, FlashOnRounded } from "@material-ui/icons";
import { userRows } from "../../dummyData";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { userRequest } from "../../requestMethods";
import User from "../user/User";

export default function UserList() {
	const admin = useSelector((state) => state?.user?.currentUser) || undefined;
	const [allUsers, setAllUsers] = useState(undefined);
	/* const [data, setData] = useState(userRows); */
	const [showUser, setShowUser] = useState(false);
	const [userInfo, setUserInfo] = useState(undefined);
	const [needUpdate, setNeedUpdate] = useState(true);
	const [deletion, setDeletion] = useState(undefined);

	const handleClick = (userObj) => {
		setUserInfo(userObj);
		setShowUser(true);
	};

	useEffect(() => {
		if (needUpdate === true) {
			getusers();
			setNeedUpdate(false);
		}
	}, [needUpdate]);

	const getusers = async (page) => {
		try {
			const res = await userRequest({ token: admin?.accessToken || "" }).get(
				`/users/`,
				{
					adminId: admin?._id,
				}
			);
			let tempArr = [];
			for (let i = 0; i < res.data.length; i++) {
				tempArr.push({ ...res.data[i], id: res.data[i]._id });
			}
			setAllUsers(tempArr);
		} catch (e) {
			console.log(e);
		}
	};

	const handleDelete = async (id) => {
		setDeletion(id);
		try {
			const res = await userRequest({ token: admin?.accessToken || "" }).delete(
				`/users/${id}`
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

	const columns = [
		{ field: "id", headerName: "ID", width: 200 },
		{
			field: "user",
			headerName: "User",
			width: 200,
			renderCell: (params) => {
				return (
					<div className="userListUser">
						{/* <img className="userListImg" src={params.row.avatar} alt="" /> */}
						{params.row.username}
					</div>
				);
			},
		},
		{ field: "email", headerName: "Email", width: 200 },
		{
			field: "situation",
			headerName: "Status",
			width: 120,
		},
		/* {
			field: "transaction",
			headerName: "Transaction Volume",
			width: 160,
		}, */
		{
			field: "action",
			headerName: "Action",
			width: 150,
			renderCell: (params) => {
				return (
					<>
						{/* <Link to={"/user/" + params.row._id}> */}
						{deletion !== params.row.id ? (
							<>
								<button
									onClick={() => handleClick(params.row)}
									className="userListEdit"
								>
									Edit
								</button>
								{/* 	</Link> */}
								<DeleteOutline
									className="userListDelete"
									onClick={() => handleSetDeletion(params.row._id)}
								/>
							</>
						) : (
							<>
								<button
									onClick={() => handleSetDeletion(undefined)}
									className="userListEdit"
								>
									Cancel
								</button>
								<button
									onClick={() => handleDelete(params.row._id)}
									className="userListEdit"
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
		<div className="'user'List">
			{allUsers && (
				<>
					{!showUser ? (
						<DataGrid
							rows={allUsers}
							disableSelectionOnClick
							columns={columns}
							pageSize={100}
						/>
					) : (
						<User
							product={userInfo}
							admin={admin}
							setShowUser={setShowUser}
							setNeedUpdate={setNeedUpdate}
						/>
					)}
				</>
			)}
		</div>
	);
}
