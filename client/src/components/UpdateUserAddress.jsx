import styled from "styled-components/macro";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import EditIcon from "@mui/icons-material/Edit";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import InputMask from "react-input-mask";
import { returnOnlyNumber } from "../features/returnnumber";
import { updateUser } from "../features/updateUser";
import {
	verifyCpf,
	verifyName,
	verifyCep,
	verifyPhone,
} from "../features/verifyUserInput";
import { userRequest } from "../requestMethods";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/userRedux";
import { Spinner } from "../styledComponents/css";

const { consultarCep } = require("correios-brasil");

const AddressContainer = styled.div`
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	overflow-wrap: break-word;
	top: ${(props) => props.mod === true && "0"};
	width: 100%;
`;

const CurrentAddressContainer = styled.div`
	width: 40%;
	border-radius: 4px;
	margin: 10px 10px;
	background-color: white;
	height: fit-content;
`;

const CurrentAddressText = styled.p`
	font-size: 11px;
`;

const IconContainer = styled.div`
	width: 40%;
	min-height: 99px;
	max-height: 110px;
	margin: 10px 10px;
	height: fit-content;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	cursor: pointer;
	border: 1px solid black;
	background-color: #edede9;
`;

const CurrentAddressTextContainer = styled.div`
	padding: 2px;
	border: 1px solid black;
	display: flex;
`;

const CurrentAddressEdit = styled.div`
	background-color: #ddc5b1;
	display: flex;
	align-items: center;
	justify-content: center;
	border: 1px solid black;
	border-top: none;
	cursor: pointer;
`;

const CurrentAddressTextWrapper = styled.div`
	padding: 3px;
`;

const ModifyAddressContainer = styled.div`
	width: 100%;

	background-color: #f5e8e4;
`;

const Button = styled.button`
	width: 125px;
	border: none;
	padding: 15px 20px;
	background-color: teal;
	color: white;
	border-radius: 4px;
	cursor: pointer;
	margin: 10px 10px;
`;

const ButtonContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
`;

const InputContainer = styled.div`
	display: flex;
	align-items: left;
	justify-content: center;
	flex-direction: column;
`;

const TextLabel = styled.label`
	margin: 5px 10px;
`;

const Input = styled.input`
	padding: 5px;
	margin: 5px 10px;
`;

const InfoContainer = styled.div`
	margin: 5px 0px;
`;

const Error = styled.span`
	color: red;
	margin-top: 20px;
	text-align: center;
`;

const ButtonDContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
`;

const DeleteBCContainer = styled.div``;

const UpdateUserAddress = (props) => {
	const user = useSelector((state) => state.user.currentUser);
	const [allAddresses, setAllAddresses] = useState([]);
	const [address, setAddress] = useState(
		{
			...user?.currentAddress?.[0],
			checked: true,
		} || {}
	);
	const [deleteB, setDeleteB] = useState(false);
	const [modifyAddress, setModifyAddress] = useState(false);
	const [cep, setCep] = useState("");
	const [addressS, setAddressS] = useState("");
	const [comp, setComp] = useState("");
	const [numb, setNumb] = useState("");
	const [ind, setInd] = useState(0);
	const [complAdr, setComplAdr] = useState({});
	const [errP1, setErrP1] = useState([undefined, undefined]);
	const [deleteBC, setDeleteBC] = useState(false);
	const [spinner1, setSpinner1] = useState(false);
	const [spinner2, setSpinner2] = useState(false);

	const dispatch = useDispatch();

	useEffect(() => {
		props.func({
			address: address,
			allAddresses: allAddresses,
			modifyAddress: modifyAddress,
		});
	}, [address, allAddresses, user?.currentAddress, modifyAddress]);

	useEffect(() => {
		let tempArr = [];

		if (user.currentAddress && user.currentAddress.length > 0) {
			for (let i = 0; i < user.currentAddress.length; i++) {
				if (i === 0) {
					tempArr.push({ ...user.currentAddress[i], ...{ checked: true } });
				} else {
					tempArr.push({ ...user.currentAddress[i], ...{ checked: false } });
				}
			}
		}

		if (tempArr.length > 0) {
			setCep(tempArr[0].cep);
			setComp(tempArr[0].compl);
			setNumb(tempArr[0].number);
			setAllAddresses(tempArr);
		}
	}, [user?.currentAddress]);

	const handleSetAddress = (index, option = false) => {
		let tempArr = [];
		for (let i = 0; i < allAddresses.length; i++) {
			if ((i === 0 && option) || (i === index && !option)) {
				tempArr.push({ ...allAddresses[i], ...{ checked: true } });
			} else {
				tempArr.push({ ...allAddresses[i], ...{ checked: false } });
			}
		}
		if (tempArr.length > 0) {
			setAddress(tempArr[index]);
			setAllAddresses(tempArr);
		}
	};

	const handleModifyAddress = (i) => {
		setModifyAddress(() => !modifyAddress);
		if (i >= 0) {
			setDeleteB(() => true);
		} else {
			setDeleteB(() => false);
		}

		if (i === -1) {
			let imaxP;
			if (allAddresses && allAddresses.length > 0) {
				imaxP = allAddresses.length;
			} else {
				imaxP = 0;
			}
			setInd(imaxP);
			setCep("");
			setNumb("");
			setComp("");
			setComplAdr("");
		} else if (allAddresses?.length > 0) {
			setInd(i);
			setCep(allAddresses[i]?.cep);
			setNumb(allAddresses[i]?.number);
			setComp(allAddresses[i]?.compl);
			setComplAdr(allAddresses[i]);
		}
	};

	const handleUpdateUserInfo = async (address) => {
		let sendReq = async () => {
			try {
				let res = await userRequest({ token: user?.accessToken || "" }).put(
					`/users/${user._id}`,
					{
						currentAddress: address,
					}
				);
				return res;
			} catch (e) {}
		};
		return sendReq();
	};

	const handleVerifyAndSave = async () => {
		try {
			setSpinner1(true);
			const verCep = await verifyCep({
				...complAdr,
				country: "BRA",
			});

			if (verCep[0] === false) {
				setSpinner1(false);
				return setErrP1([true, verCep[1]]);
			}

			if (!numb || !(numb && numb.length > 0)) {
				setSpinner1(false);
				return setErrP1([true, "Faltou adicionar o número"]);
			}

			let updatedArray = [
				{
					...complAdr,
					number: numb,
					compl: comp,
				},
			];

			if (!allAddresses || allAddresses.length === ind) {
				let updatedArray2 = allAddresses.slice() || [];
				updatedArray = updatedArray.concat(updatedArray2).slice();
			} else if (allAddresses && ind < allAddresses.length) {
				let updatedArray2 = allAddresses.slice(ind);
				updatedArray = updatedArray.concat(updatedArray2).slice();
			}

			let infoUpdate = await updateUser(
				{ currentAddress: updatedArray, token: user?.accessToken || "" },
				user._id
			);

			if (infoUpdate.status === 200) {
				dispatch(
					loginSuccess({ ...infoUpdate.data, accessToken: user.accessToken })
				);
				setDeleteB(() => false);

				/* handleSetAddress(infoUpdate.data.currentAddress, true); */
				setModifyAddress(() => false);
			}

			/* let sShipping = await costShipping(pagseguroInfo.shipping);

			if (!sShipping || sShipping.error === true) {
				return setErrP1([true, "Endereço Inválido"]);
			}

			setPagseguroInfo({
				...pagseguroInfo,
				shipping: {
					...pagseguroInfo.shipping,
					cost: sShipping.shipping.pac.Valor,
				},
			}); */

			setSpinner1(false);
			return setErrP1([false, undefined]);
		} catch (err) {
			setSpinner1(false);
		}
	};

	useEffect(() => {
		let onlyNumber = returnOnlyNumber(cep);
		if (onlyNumber && onlyNumber.length == 8) {
			consultarCep(onlyNumber).then((response) => {
				if (response && response.cep) {
					/* setAddressS(response); */
					setAddressS(
						response.logradouro +
							"; " +
							response.bairro +
							"; " +
							response.localidade
					);
				}
				setComplAdr(response);
			});
		} else {
			/* setAddress(""); */
			setAddressS("");
			setComplAdr({});
		}
	}, [cep]);

	const handleDeleteAddress = async () => {
		setSpinner2(true);
		let updatedArray = allAddresses.slice() || [];
		updatedArray.splice(ind, 1);

		/* const infoUpdate = await handleUpdateUserInfo(updatedArr); */

		let infoUpdate = await updateUser(
			{ currentAddress: updatedArray, token: user?.accessToken || "" },
			user._id
		);

		if (infoUpdate.status === 200) {
			dispatch(
				loginSuccess({ ...infoUpdate.data, accessToken: user.accessToken })
			);
			setDeleteBC(() => false);
			setDeleteB(() => false);
			setModifyAddress(() => false);
		}
		setSpinner2(false);
	};

	return (
		<AddressContainer mod={modifyAddress}>
			{!modifyAddress ? (
				<>
					<p style={{ width: "100%", textAlign: "center", marginTop: "5px" }}>
						Endereço de Entrega
					</p>

					{allAddresses &&
						allAddresses.length > 0 &&
						allAddresses.map((u, i) => (
							<CurrentAddressContainer>
								<CurrentAddressTextContainer>
									<input
										onClick={() => handleSetAddress(i)}
										style={{ marginRight: "2px", marginLeft: "3px" }}
										type="radio"
										name="address"
										checked={u.checked}
									></input>
									<CurrentAddressTextWrapper>
										<CurrentAddressText>CEP: {u.cep}</CurrentAddressText>
										<CurrentAddressText>
											{u.logradouro}, {u.bairro}, {u.localidade}
										</CurrentAddressText>
										<CurrentAddressText>Número: {u.number}</CurrentAddressText>
										<CurrentAddressText>Comp: {u.compl}</CurrentAddressText>
									</CurrentAddressTextWrapper>
								</CurrentAddressTextContainer>

								<CurrentAddressEdit onClick={() => handleModifyAddress(i)}>
									<EditIcon />
								</CurrentAddressEdit>
							</CurrentAddressContainer>
						))}

					<IconContainer onClick={() => handleModifyAddress(-1)}>
						<AddBusinessIcon />
						<p>Adicionar Endereço</p>
					</IconContainer>
				</>
			) : (
				<ModifyAddressContainer>
					<InfoContainer>
						<InputContainer>
							<TextLabel>CEP</TextLabel>
							<InputMask
								mask="99999-999"
								style={{ padding: "5px", margin: "5px 10px" }}
								/* color={errP1}
								
								number={2}
								
								placeholder="Ex: 17560246" */
								value={cep}
								onChange={(e) => setCep(e.target.value)}
							/>
						</InputContainer>

						<InputContainer>
							<TextLabel>Número</TextLabel>
							<Input
								/* color={errP1}
								number={3}
								
								
								placeholder="Ex: 123" */
								value={numb}
								onChange={(e) => setNumb(e.target.value)}
							/>
						</InputContainer>

						<InputContainer>
							<TextLabel>Complemento</TextLabel>
							<Input
								/* color={errP1}
								number={4}
								
								
								placeholder="Ex: Bloco A, Apto 1002" */
								value={comp}
								onChange={(e) => setComp(e.target.value)}
							/>
						</InputContainer>

						<InputContainer>
							<TextLabel>Endereço</TextLabel>
							<Input
								/* color={errP1}
								number={4}
								type="text"
								
								
								 */
								value={addressS}
								onChange={(e) => setCep(e.target.value)}
								style={{ backgroundColor: "lightGray" }}
								readonly
							/>
						</InputContainer>
					</InfoContainer>

					{deleteB && (
						<deleteBCContainer>
							{deleteBC ? (
								<div
									style={{
										textAlign: "center",
										marginTop: "10px",
										/* minHeight: "418px", */
									}}
								>
									<p style={{ marginBottom: "10px" }}>
										Deseja deletar este endereço?
									</p>
									<ButtonDContainer>
										<Button onClick={() => setDeleteBC(false)}>Cancelar</Button>
										{spinner2 ? (
											<Button style={{ backgroundColor: "#FF0505" }}>
												<Spinner custom={{ size: "6px", color: "white" }} />
											</Button>
										) : (
											<Button
												onClick={() => handleDeleteAddress()}
												style={{ backgroundColor: "#FF0505" }}
											>
												Confirmar
											</Button>
										)}
									</ButtonDContainer>
								</div>
							) : (
								<ButtonDContainer>
									<Button
										onClick={() => setDeleteBC(true)}
										style={{ backgroundColor: "#FF0505" }}
									>
										Deletar
									</Button>
								</ButtonDContainer>
							)}
						</deleteBCContainer>
					)}

					<div style={{ textAlign: "center" }}>
						{errP1 && errP1[1] && <Error>{errP1[1]}</Error>}
					</div>
					{!deleteBC && (
						<ButtonContainer>
							<Button onClick={() => handleModifyAddress()}>Cancelar</Button>

							{spinner1 ? (
								<Button>
									<Spinner custom={{ size: "6px", color: "white" }} />
								</Button>
							) : (
								<Button onClick={() => handleVerifyAndSave()}>Salvar</Button>
							)}
						</ButtonContainer>
					)}
				</ModifyAddressContainer>
			)}
		</AddressContainer>
	);
};

export default UpdateUserAddress;
