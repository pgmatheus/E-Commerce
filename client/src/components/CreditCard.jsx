import { useState, useEffect } from "react";
import styled from "styled-components/macro";
import InputMask from "react-input-mask";
import { returnOnlyNumber } from "../features/returnnumber";
import { useSelector } from "react-redux";
import {
	verifyCpf,
	verifyName,
	verifyPhone,
} from "../features/verifyUserInput";

const Container = styled.div`
	width: 100%;
`;

const InputContainer = styled.div`
	display: flex;
	flex-direction: column;
`;

const DivCard = styled.div`
	display: flex;
`;

const TextLabel = styled.label`
	margin: 5px 10px;
`;

const Input = styled.input`
	padding: 5px;
	margin: 5px 10px;
`;

const DivCC = styled.div`
	display: flex;
	position: relative;
`;

const ImgCC = styled.img`
	position: absolute;
	right: 15px;
	bottom: 10px;
	width: 42px;
	max-height: 20px;
`;

const SelectInstallments = styled.select`
	padding: 5px;
	margin: 5px 10px;
`;

const OptionInstallments = styled.option``;

const ErrorInfo = styled.span`
	position: absolute;
	right: 10px;
	color: red;
`;

/* function DateInput(props) {
	return (
		<InputMask
			mask="99/99"
			onChange={props.onChange}
			value={props.value}
			placeholder="mm / aa"
			style={{ padding: "5px", margin: "5px 10px" }}
		/>
	);
} */

const CreditCard = (props) => {
	const user = useSelector((state) => state.user.currentUser);
	const cart = useSelector((state) => state.cart);
	const [cBrand, setCBrand] = useState(undefined);
	const [paymentMethods, setPaymentMethods] = useState(undefined);
	const [installments, setInstallments] = useState(undefined);
	const [cToken, setCToken] = useState(undefined);
	const [creditC, setCreditC] = useState({
		token: "",
		installment: {
			quantity: "",
			value: "",
			noInterestInstallmentQuantity: "",
		},
		holder: {
			name: "",
			document: {
				type: "CPF",
				value: "",
			},
			birthDate: "",
			phone: {
				areaCode: "",
				number: "",
			},
		},
	});
	const [cNumber, setCNumber] = useState(props.cNumberS || "");
	const [img, setImg] = useState(props.imgS || "");
	const [cInfo, setCInfo] = useState({
		cardNumber: "",
		brand: "",
		cvv: "",
		expirationMonth: "",
		expirationYear: "",
		birrtDay: "",
	});
	const [invalidCCN, setInvalidCCN] = useState(false);
	const [loading, setLoading] = useState(false);
	const [cvvCC, setcvvCC] = useState(props.cvvCCS || "");
	const [expirationMonth, setExpirationMonth] = useState("");
	const [expirationYear, setExpirationYear] = useState("");
	const [errExpirateDate, setErrExpirateDate] = useState(false);
	const [name, setName] = useState(props.nameS || "");
	const [numTelCC, setNumTelCC] = useState("");
	const [cpf, setCpf] = useState(props.cpfS || "");
	const [errCpf, setErrCpf] = useState(false);
	const [errName, setErrName] = useState(false);
	const [errPhone, setErrPhone] = useState(false);
	const [phone, setPhone] = useState(props.phoneS || "");
	const [errcvvCC, setErrCvvCC] = useState(false);
	const [date, setDate] = useState(props.dateS || "");
	const [test, setTest] = useState("");

	const d = new Date();
	let monthNow = d.getMonth();
	let yearNow = parseInt(d.getFullYear().toString().substr(-2));

	const withoutInterest = "3";

	const verifyMonth = (month) => {
		// if (month && month.length === 2) {
		// let number = parseInt(month);
		if (month && month > -1 && month < 13) {
			return { error: false, status: true };
		}
		//}
		return { error: true, status: false };
	};

	useEffect(() => {
		// Verify CPF
		if (cpf?.length === 11) {
			let ver = verifyCpf(cpf);
			if (!ver || ver[0] === false) {
				setErrCpf(true);
			} else {
				setErrCpf(false);
			}
		} else {
			setErrCpf(false);
		}
	}, [cpf]);

	useEffect(() => {
		if (phone && phone.length > 9 && phone.length < 12) {
			let ver = verifyPhone(phone);

			if (!ver || ver.error === true) {
				setErrPhone(true);
			} else {
				setErrPhone(false);
			}
		} else if (phone?.length > 0 && phone?.length < 10) {
			setErrPhone(true);
		} else {
			setErrPhone(false);
		}
	}, [phone]);

	useEffect(() => {
		if (name?.length > 3) {
			let ver = verifyName(name);
			if (!ver || ver.error === true) {
				setErrName(true);
			} else {
				setErrName(false);
			}
		} else if (name?.length > 0 && name.length < 4) {
			setErrName(true);
		} else {
			setErrName(false);
		}
	}, [name]);

	useEffect(() => {
		if (cvvCC?.length > 2 && cvvCC?.length < 5) {
			setErrCvvCC(false);
		} else if ((cvvCC?.length > 0 && cvvCC?.length < 3) || cvvCC?.length > 4) {
			setErrCvvCC(true);
		} else {
			setErrCvvCC(false);
		}
	}, [cvvCC]);

	const verifyYear = (year) => {
		if (year && year.length === 4) {
			let number = parseInt(year);
			if (number && number > 2021 && number < 2100) {
				return { status: true };
			}
		}
		return { status: false };
	};

	useEffect(() => {
		let sCCInfo = {
			cToken: cToken,
			status:
				!cToken ||
				errName ||
				!name ||
				errCpf ||
				!cpf ||
				cpf?.length !== 11 ||
				!phone ||
				errPhone ||
				creditC.installment.value === ""
					? false
					: true,
			creditC: {
				...creditC,
				holder: {
					name: errName ? "" : name,
					document: {
						type: "CPF",
						value: errCpf || cpf?.length !== 11 ? "" : cpf,
					},
					birthDate: "",
					phone: {
						areaCode: errPhone ? "" : phone?.slice(0, 2) || "",
						number: errPhone ? "" : phone?.slice(2) || "",
					},
				},
			},
			cBrand: cBrand,
			lastFour: cNumber && cNumber.length === 16 ? cNumber.slice(12, 16) : "",
		};

		props.func({
			sCCInfo: sCCInfo,
			cNumber: cNumber,
			cvvCC: cvvCC,
			date: date,
			name: name,
			installments: installments,
			img: img,
			phone: phone,
			cpf: cpf,
		});
	}, [
		cToken,
		creditC,
		name,
		cpf,
		phone,
		errName,
		errCpf,
		errPhone,
		cNumber,
		cvvCC,
		date,
		installments,
		img,
		phone,
	]);

	useEffect(() => {
		window.PagSeguroDirectPayment.getPaymentMethods({
			amount: props.tValue.toFixed(2), // adicionar valor depois
			success: function (response) {
				setPaymentMethods(response);
				// Retorna os meios de pagamento disponíveis.
			},
			error: function (response) {
				// Callback para chamadas que falharam.
			},
			complete: function (response) {
				// Callback para todas chamadas.
			},
		});
	}, []);

	const handleInstallments = (e) => {
		if (installments) {
			setCreditC({
				...creditC,
				installment: {
					quantity: installments[e - 1].quantity,
					value: installments[e - 1].installmentAmount,
					noInterestInstallmentQuantity: withoutInterest,
				},
			});
		}
	};

	useEffect(() => {
		if (date?.length == 4) {
			let m = parseInt(date.slice(0, 2));
			let y = parseInt(date.slice(2, 4));
			let cond = true;
			if (verifyMonth(m).error) {
			} else if (y > yearNow) {
				cond = false;
			} else if (yearNow == y && m > monthNow + 1) {
				cond = false;
			}
			if (!cond) {
				setExpirationMonth(date.slice(0, 2));
				setExpirationYear("20" + date.slice(2, 4));
			} else {
				setErrExpirateDate(true);
			}
		} else {
			setExpirationMonth("");
			setExpirationYear("");
			setErrExpirateDate(false);
		}
	}, [date]);

	const handlerMY = (e) => {
		if (e?.length == 4) {
			let m = parseInt(e.slice(0, 2));
			let y = parseInt(e.slice(2, 4));
			let cond = true;
			if (verifyMonth(m).error) {
			} else if (y > yearNow) {
				cond = false;
			} else if (yearNow == y && m > monthNow + 1) {
				cond = false;
			}
			if (!cond) {
				setExpirationMonth(e.slice(0, 2));
				setExpirationYear("20" + e.slice(2, 4));
			} else {
				setErrExpirateDate(true);
			}
		} else {
			setErrExpirateDate(false);
		}
	};

	useEffect(() => {
		if (cNumber?.length > 5 && !cBrand && !loading) {
			setLoading(true);
			window.PagSeguroDirectPayment.getBrand({
				cardBin: cNumber,
				success: function (r) {
					let bName = r.brand.name;
					setCBrand(r.brand.name);

					let path =
						paymentMethods.paymentMethods.CREDIT_CARD.options[
							bName.toUpperCase()
						].images.MEDIUM.path;
					setImg(`https://stc.pagseguro.uol.com.br${path}`);

					//bandeira encontrada
				},
				error: function (r) {
					//tratamento do erro
				},
				complete: function (r) {
					setLoading(false);
					//tratamento comum para todas chamadas
				},
			});
		} else if (cNumber?.length < 6) {
			setCBrand(undefined);
			setImg("");
			setInstallments(undefined);
		}

		if (cNumber?.length === 16) {
			generateCartToken(true);
		} else {
			setInvalidCCN(false);
		}
	}, [cNumber]);

	useEffect(() => {
		if (
			cNumber?.length === 16 &&
			!invalidCCN &&
			cvvCC?.length > 2 &&
			cvvCC?.length < 5 &&
			!errcvvCC &&
			date?.length === 4 &&
			expirationYear?.length == 4 &&
			!errExpirateDate
		) {
			generateCartToken();
		} else {
			setCToken(undefined);
		}
	}, [
		cNumber,
		cvvCC,
		expirationYear,
		errExpirateDate,
		invalidCCN,
		errcvvCC,
		date,
	]);

	const generateCartToken = (options = false) => {
		window.PagSeguroDirectPayment.createCardToken({
			cardNumber: cNumber, // Número do cartão de crédito
			brand: cBrand, // Bandeira do cartão
			cvv: options ? "123" : cvvCC, // CVV do cartão
			expirationMonth: options ? "12" : expirationMonth, // Mês da expiração do cartão
			expirationYear: options ? "2099" : expirationYear, // Ano da expiração do cartão, é necessário os 4 dígitos.
			success: function (response) {
				// setCToken(response.card.token);
				// Retorna o cartão tokenizado.
			},
			error: function (response) {
				// Callback para chamadas que falharam.
			},
			complete: function (response) {
				if (options && response.error === true) {
					setInvalidCCN(true);
				}
				if (!options && response?.card?.token) {
					setCToken(response.card.token);
				} else {
					setCToken(undefined);
				}
			},
		});
	};

	useEffect(() => {
		if (cBrand) {
			window.PagSeguroDirectPayment.getInstallments({
				amount: props.tValue.toFixed(2), // modificar
				maxInstallmentNoInterest: withoutInterest,
				brand: cBrand,
				success: function (rs) {
					setInstallments(rs.installments[cBrand]);
					setCreditC({
						...creditC,
						installment: {
							quantity: rs.installments[cBrand][0].quantity,
							value: rs.installments[cBrand][0].installmentAmount,
							noInterestInstallmentQuantity: withoutInterest,
						},
					});
				},
				error: function (rs) {
					// callback para chamadas que falharam.
				},
				complete: function (rs) {
					// Callback para todas chamadas.
				},
			});
		} else {
			setInstallments(undefined);
			setCreditC({
				...creditC,
				installment: {
					quantity: "",
					value: "",
					noInterestInstallmentQuantity: "",
				},
			});
		}
	}, [cBrand]);

	return (
		<Container>
			<InputContainer style={{ position: "relative" }}>
				<TextLabel>
					Número do cartão
					{invalidCCN && <ErrorInfo> Número inválido</ErrorInfo>}
				</TextLabel>
				<>
					<ImgCC src={img}></ImgCC>
					<InputMask
						/* onChange={(e) => brandCC(returnOnlyNumber(e.target.value))} */
						onChange={(e) => setCNumber(returnOnlyNumber(e.target.value))}
						defaultValue={cNumber}
						mask="9999 9999 9999 9999"
						/* error={invalidCCN} */
						error={"0.5px solid red"}
						style={{
							padding: "5px",
							margin: "5px 10px",
						}}
					/>
				</>
			</InputContainer>
			<DivCard>
				<InputContainer style={{ position: "relative" }}>
					<TextLabel>
						CVV {errcvvCC && <ErrorInfo> CVV inválido</ErrorInfo>}
					</TextLabel>
					<Input
						type="text"
						/* onChange={(e) =>
							setCInfo({ ...cInfo, cvv: returnOnlyNumber(e.target.value) })
						} */
						defaultValue={cvvCC}
						onChange={(e) => setcvvCC(returnOnlyNumber(e.target.value))}
						style={{ padding: "5px 15px 5px 5px", margin: "5px 10px" }}
						maxlength="4"
					/>
				</InputContainer>

				<InputContainer>
					<TextLabel style={{ marginLeft: "5px" }}>
						Validade {errExpirateDate && <ErrorInfo> Data inválida</ErrorInfo>}
					</TextLabel>
					<InputMask
						defaultValue={date}
						/* onChange={(e) => handlerMY(returnOnlyNumber(e.target.value))} */
						onChange={(e) => setDate(returnOnlyNumber(e.target.value))}
						mask="99/99"
						placeholder="mm / aa"
						style={{ padding: "5px 15px 5px 5px", margin: "5px " }}
					/>
				</InputContainer>
			</DivCard>
			<InputContainer>
				<TextLabel>Parcelas</TextLabel>
				<SelectInstallments
					onChange={(e) => handleInstallments(e.target.value)}
				>
					{installments &&
						installments.map((e) => (
							<OptionInstallments
								/* onClick={() => {
									setCreditC({
										...creditC,
										installment: {
											quantity: e.quantity,
											value: e.installmentAmount,
											noInterestInstallmentQuantity: withoutInterest,
										},
									});
								}} */
								key={e.quantity}
								value={e.quantity}
							>
								{e.quantity} x R${e.installmentAmount}{" "}
								{e.interestFree
									? "(sem juros)"
									: `(Total: R$ ${e.totalAmount})`}
							</OptionInstallments>
						))}
				</SelectInstallments>
			</InputContainer>
			<InputContainer>
				<TextLabel>
					Nome (conforme no cartão de crédito){" "}
					{errName && <ErrorInfo> Nome Inválido</ErrorInfo>}
				</TextLabel>
				<Input
					type="text"
					defaultValue={name}
					/* onChange={(e) =>
						setCreditC({
							...creditC,
							holder: { ...creditC.holder, name: e.target.value },
						})
					} */
					onChange={(e) => setName(e.target.value)}
				/>
			</InputContainer>
			{/* <InputContainer>
				<TextLabel>Data de nascimento (dono do cartão)</TextLabel>
				<InputMask
					onChange={(e) =>
						setCreditC({
							...creditC,
							holder: { ...creditC.holder, birthDate: e.target.value },
						})
					}
					mask="99/99/9999"
					style={{ padding: "5px", margin: "5px 10px" }}
				/>
			</InputContainer> */}
			<InputContainer>
				<TextLabel>
					Telefone (dono do cartão){" "}
					{errPhone && <ErrorInfo> Número Inválido</ErrorInfo>}
				</TextLabel>
				<InputMask
					defaultValue={phone}
					/* onChange={(e) => handlerNH(returnOnlyNumber(e.target.value))} */
					onChange={(e) => setPhone(returnOnlyNumber(e.target.value))}
					mask="(99) 999999999"
					style={{ padding: "5px", margin: "5px 10px" }}
				/>
			</InputContainer>
			<InputContainer>
				<TextLabel>
					CPF (dono do cartão) {errCpf && <ErrorInfo> CPF Inválido</ErrorInfo>}{" "}
				</TextLabel>
				<InputMask
					defaultValue={cpf}
					/* onChange={(e) =>
						setCreditC({
							...creditC,
							holder: {
								...creditC.holder,
								document: {
									...creditC.holder.document,
									value: returnOnlyNumber(e.target.value),
								},
							},
						})
					} */
					onChange={(e) => setCpf(returnOnlyNumber(e.target.value))}
					mask="999.999.999-99"
					style={{ padding: "5px", margin: "5px 10px" }}
				/>
			</InputContainer>
		</Container>
	);
};

export default CreditCard;
