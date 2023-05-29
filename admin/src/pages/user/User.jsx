import {
	CalendarToday,
	LocationSearching,
	MailOutline,
	PermIdentity,
	PhoneAndroid,
	Publish,
} from "@material-ui/icons";
import { Link } from "react-router-dom";
import "./user.css";
import { userRequest } from "../../requestMethods";
import { useEffect, useState } from "react";
import { returnOnlyNumber } from "../../utilities/returnnumber";
const { consultarCep } = require("correios-brasil");
export default function User(props) {
	let user = props?.user || undefined;
	const [username, setUsername] = useState(user?.username || "");
	const [email, setEmail] = useState(user?.email || "");
	const [phone, setPhone] = useState(user?.phone || "");
	const [address, setAddress] = useState([]);
	const [cepArr, setCepArr] = useState([]);
	const [numberArr, setNumberArr] = useState([]);
	const [complArr, setComplArr] = useState([]);
	const [addressDB, setAddressDB] = useState([]);
	const [loading, setLoading] = useState(false);
	const [showMsg, setShowMessage] = useState({
		show: false,
		message: "",
	});

	useEffect(() => {
		if (user?.currentAddress?.length > 0) {
			let tempCep = [];
			let tempNumber = [];
			let tempCompl = [];
			let tempAdd = [];
			let tempAddDB = [];
			for (let i = 0; i < user.currentAddress.length; i++) {
				tempCep.push(user.currentAddress[i].cep);
				tempNumber.push(user.currentAddress[i].number);
				tempCompl.push(user.currentAddress[i].compl);
				tempAdd.push(
					user.currentAddress[i].logradouro +
						"; " +
						user.currentAddress[i].bairro +
						"; " +
						user.currentAddress[i].localidade
				);
				tempAddDB.push(user.currentAddress[i]);
			}
			setCepArr(tempCep);
			setNumberArr(tempNumber);
			setComplArr(tempCompl);
			setAddress(tempAdd);
			setAddressDB(tempAddDB);
		}
	}, [user]);

	const handleUpdateCep = async (obj) => {
		if (cepArr?.length > 0) {
			let tempArr = cepArr.slice();
			tempArr[obj.index] = obj.value;
			setCepArr(tempArr);
			let z = returnOnlyNumber(obj?.value) || undefined;
			if (z?.length === 8) {
				await getAddress(z, obj.index);
			} else {
				let tempAddress = address.slice();
				tempAddress[obj.index] = "";
				setAddress(tempAddress);
				let tempAddressDB = addressDB.slice();
				tempAddressDB[obj.index] = {};
				setAddressDB(tempAddressDB);
			}
		}
	};

	const handleUpdateNumber = (obj) => {
		if (numberArr?.length > 0) {
			let tempArr = numberArr.slice();
			tempArr[obj.index] = obj.value;
			setNumberArr(tempArr);
		}
	};

	const handleUpdateCompl = (obj) => {
		if (complArr?.length > 0) {
			let tempArr = complArr.slice();
			tempArr[obj.index] = obj.value;
			setComplArr(tempArr);
		}
	};

	const returnLocation = (address, i) => {
		if (address) {
			return (
				"CEP: " +
				(cepArr[i] || address.cep) +
				", " +
				"logradouro: " +
				(addressDB[i]?.logradouro || "") +
				", " +
				"número: " +
				(numberArr[i] || address.number) +
				", " +
				"complemento: " +
				(complArr[i] || address.compl) +
				", " +
				"bairro: " +
				(addressDB[i]?.bairro || "") +
				", " +
				(addressDB[i]?.localidade || "") +
				"/" +
				(addressDB[i]?.uf || "")
			);
		}
	};

	/* const returnOnlyNumber = (arr) => {
		let onlyNumber = "";
		let onlyNumberArr;

		if (arr && arr.length > 0 && arr.match(/[0-9]+/g)) {
			onlyNumberArr = arr.match(/[0-9]+/g);

			for (let i = 0; i < onlyNumberArr.length; i++) {
				onlyNumber = onlyNumber.concat(onlyNumberArr[i]);
			}
			return onlyNumber;
		} else {
			return undefined;
		}
	}; */

	const getAddress = async (cep, index) => {
		let tempArr = address.slice();
		let tempArrDB = addressDB.slice();
		consultarCep(cep)
			.then((response) => {
				if (response?.data?.logradouro) {
					tempArr[index] =
						response.data.logradouro +
						"; " +
						response.data.bairro +
						"; " +
						response.data.localidade;
					setAddress(tempArr);
					tempArrDB[index] = response.data;
					setAddressDB(tempArrDB);
				} else {
					throw new Error("err");
				}
			})
			.catch((err) => {
				tempArr[index] = "";
				setAddress(tempArr);
				tempArrDB[index] = {};
				setAddressDB(tempArrDB);
			});
	};

	let sendReq = async () => {
		if (!loading) {
			setLoading(true);
			setShowMessage({ show: false, messsage: "" });

			let tempAdd = [];
			for (let i = 0; i < addressDB.length; i++) {
				tempAdd.push({
					...addressDB[i],
					number: numberArr[i],
					compl: complArr[i],
				});
			}
			setAddressDB(tempAdd);
			try {
				await userRequest({
					token: props?.admin?.accessToken || "",
				}).put(`/users/${user._id}`, {
					adminId: props?.admin?._id,
					username: username,
					email: email,
					phone: phone,
					currentAddress: tempAdd,
				});
				setLoading(false);
				props.setNeedUpdate(true);
				props.setShowUser(false);
			} catch (e) {
				setShowMessage({
					show: true,
					message: e?.response?.data?.message || e?.response?.data || "error",
				});
				setLoading(false);
			}
		}
	};

	return (
		<>
			{user && (
				<div className="user">
					<div className="userTitleContainer">
						<h1 className="userTitle">Edit User</h1>
						<button onClick={() => props.setShowUser(false)}>Voltar</button>
						{/* <Link to="/newUser">
					<button className="userAddButton">Create</button>
				</Link> */}
					</div>

					<div className="userContainer">
						<div className="userShow">
							<div className="userShowTop">
								{/* <img
							src="https://images.pexels.com/photos/1152994/pexels-photo-1152994.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
							alt=""
							className="userShowImg"
						/> */}
								<div className="userShowTopTitle">
									<span className="userShowUsername">{username || ""}</span>
									{/* <span className="userShowUserTitle">Software Engineer</span> */}
								</div>
							</div>
							<div className="userShowBottom">
								{/* <span className="userShowTitle">Account Details</span>
								<div className="userShowInfo">
									<PermIdentity className="userShowIcon" />
									<span className="userShowInfoTitle">annabeck99</span>
								</div>
								<div className="userShowInfo">
									<CalendarToday className="userShowIcon" />
									<span className="userShowInfoTitle">10.12.1999</span>
								</div> */}
								<span className="userShowTitle">Contact Details</span>
								<div className="userShowInfo">
									<PhoneAndroid className="userShowIcon" />
									<span className="userShowInfoTitle">{phone || ""}</span>
								</div>
								<div className="userShowInfo">
									<MailOutline className="userShowIcon" />
									<span className="userShowInfoTitle">{email || ""}</span>
								</div>

								{user?.currentAddress?.map((ad, i) => {
									return (
										<div className="userShowInfo" key={`${ad.localidade + i}%`}>
											<LocationSearching className="userShowIcon" />
											<span className="userShowInfoTitle">
												{returnLocation(ad, i)}
											</span>
										</div>
									);
								})}

								{/* <div className="userShowInfo">
									<LocationSearching className="userShowIcon" />
									<span className="userShowInfoTitle">{currentLocation}</span>
								</div> */}
							</div>
						</div>
						<div className="userUpdate">
							<span className="userUpdateTitle">Edit</span>
							{showMsg?.show && (
								<p style={{ color: "red" }}>{showMsg.message}</p>
							)}
							<div className="userUpdateForm">
								<div className="userUpdateLeft">
									<div className="userUpdateItem">
										<label>Username</label>
										<input
											defaultValue={user?.username || ""}
											onChange={(e) => setUsername(e.target.value)}
											type="text"
											className="userUpdateInput"
										/>
									</div>
									{/* 								<div className="userUpdateItem">
										<label>Full Name</label>
										<input
											type="text"
											placeholder="Anna Becker"
											className="userUpdateInput"
										/>
									</div> */}
									<div className="userUpdateItem">
										<label>Email</label>
										<input
											defaultValue={user?.email || ""}
											onChange={(e) => setEmail(e.target.value)}
											type="text"
											className="userUpdateInput"
										/>
									</div>
									<div className="userUpdateItem">
										<label>Phone</label>
										<input
											defaultValue={user?.phone || ""}
											onChange={(e) => setPhone(e.target.value)}
											type="text"
											className="userUpdateInput"
										/>
									</div>
									{user?.currentAddress?.map((ad, i) => {
										return (
											<div
												className="userUpdateItem"
												key={`${ad.localidade + i}`}
											>
												<label>Address {i + 1}</label>
												<input
													defaultValue={ad.cep || ""}
													onChange={(e) =>
														handleUpdateCep({ index: i, value: e.target.value })
													}
													type="text"
													placeholder="CEP"
													className="userUpdateInput"
												/>
												<input
													defaultValue={ad.number || ""}
													onChange={(e) =>
														handleUpdateNumber({
															index: i,
															value: e.target.value,
														})
													}
													type="text"
													placeholder="Número"
													className="userUpdateInput"
												/>
												<input
													defaultValue={ad.compl || ""}
													onChange={(e) =>
														handleUpdateCompl({
															index: i,
															value: e.target.value,
														})
													}
													type="text"
													placeholder="Complemento"
													className="userUpdateInput"
												/>
												<input
													value={address[i] || ""}
													type="text"
													className="userUpdateInput"
													style={{
														backgroundColor: "lightGray",
														fontSize: "10px",
													}}
													readOnly
												/>
											</div>
										);
									})}
								</div>
								<div className="userUpdateRight">
									<div className="userUpdateUpload">
										{/* <img
											className="userUpdateImg"
											src="https://images.pexels.com/photos/1152994/pexels-photo-1152994.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
											alt=""
										/> 
										<label htmlFor="file">
											<Publish className="userUpdateIcon" />
										</label>
										<input type="file" id="file" style={{ display: "none" }} />*/}
									</div>
									<button
										disabled={loading}
										onClick={() => sendReq()}
										type="button"
										className="userUpdateButton"
									>
										Update
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
