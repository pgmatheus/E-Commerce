const router = require("express").Router();
const getAddress = require("../features/getAddress");
const returnOnlyNumber = require("../features/returnnumber");
const Product = require("../models/Product");
const Shipping = require("../models/Shipping");
const { diffDays } = require("../features/diffDays");
let Correios = require("node-correios");
let correios = new Correios();

const language = "br"; // change language

const verifyShippingCost = async (cobj) => {
	let args = {
		/* "nCdServico": '40010,41106,40215', */
		sCepOrigem: "41650472",
		// "sCepDestino": "89010000",
		nVlPeso: 1,
		nCdFormato: 1,
		nVlComprimento: 25,
		nVlAltura: 10,
		nVlLargura: 25,
		nVlDiametro: 18,
	};

	let pArgs = {
		...args,
		sCepDestino: cobj.cep,
		nCdServico: "04510",
	};

	let today = new Date();

	const ship = await Shipping.findOne({
		city: cobj.localidade,
	});

	if (ship) {
		let difD = diffDays(today, ship.updatedAt);
		if (difD?.status === true && difD?.result < 180) {
			return {
				status: true,
				pac: { Erro: "0", Valor: ship.shippingp, PrazoEntrega: ship.timeD },
				cep: cobj,
			};
		}
	}

	let objp = await correios
		.calcPrecoPrazo(pArgs)
		.then((result) => {
			result[0].Valor = result[0].Valor.replace(",", ".");
			return result[0];
		})
		.catch((error) => {
			return error;
		});

	if (objp && (objp.Erro == "0" || objp.Erro == "010" || objp.Erro == "011")) {
		if (ship) {
			const updatedShip = await Shipping.findOneAndUpdate(
				{ city: cobj.localidade },
				{
					timeD: objp.PrazoEntrega,
					shippingp: parseFloat(objp.Valor.replace(",", ".")),
				}
			);
			return { status: true, pac: objp, cep: cobj };
		} else {
			const newShipping = new Shipping({
				cep: cobj.cep,
				city: cobj.localidade,
				timeD: objp.PrazoEntrega,
				district: cobj.bairro,
				shippingp: parseFloat(objp.Valor.replace(",", ".")),
			});
			const savedShipping = await newShipping.save();
			return { status: true, pac: objp, cep: cobj };
		}
	}

	return {
		status: false,
		response: "Entrega não pode ser realizada no CEP informado",
	};
};

const verifyId = (id) => {
	if (id.match(/^[0-9a-fA-F]{24}$/)) {
		return true;
	}
	return false;
};

let validRegex =
	/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

const verifyStock = async (itemU, des) => {
	if (!itemU || !des || itemU.length !== des.length) {
		return { status: false, error: "Invalid sizes of items and descriptions." };
	}
	for (let i = 0; i < itemU.length; i++) {
		if (!verifyId(itemU[i].id)) {
			return { status: false, error: "Invalid ID" };
		}

		let itemDb = await Product.findOne({ _id: itemU[i].id });
		if (!itemDb) {
			return { status: false, error: "Product not found" };
		}
		let infoStock = itemDb.infoStock;

		if (
			!itemU[i].amount ||
			!itemDb.price ||
			itemU[i].amount !== itemDb.price.toString()
		) {
			return { status: false, error: "Error product price" };
		}

		let specificItem = infoStock.filter(
			(e) => e.size === des[i].size && e.color === des[i].color
		);

		if (itemDb.title !== itemU[i].description) {
			return { status: false, error: "Mismatch title" };
		}

		if (!specificItem || !specificItem[0]) {
			return { status: false, error: "Mismatch color or size" };
		}

		if (specificItem[0].quantity < parseInt(itemU[i].quantity)) {
			return { status: false, error: "Quantity exceeds stock" };
		}
	}
	return { status: true };
};

const verifyCpf = (cpf) => {
	if (!cpf || cpf.length !== 11) return [false, "CPF requer 11 dígitos"];
	let numeros, digitos, soma, i, resultado, digitos_iguais;
	cpf = returnOnlyNumber(cpf);
	digitos_iguais = 1;

	for (i = 0; i < cpf.length - 1; i++)
		if (cpf.charAt(i) != cpf.charAt(i + 1)) {
			digitos_iguais = 0;
			break;
		}
	if (!digitos_iguais) {
		numeros = cpf.substring(0, 9);
		digitos = cpf.substring(9);
		soma = 0;
		for (i = 10; i > 1; i--) soma += numeros.charAt(10 - i) * i;
		resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
		if (resultado != digitos.charAt(0)) return [false, "CPF inválido"];
		numeros = cpf.substring(0, 10);
		soma = 0;
		for (i = 11; i > 1; i--) soma += numeros.charAt(11 - i) * i;
		resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
		if (resultado != digitos.charAt(1)) return [false, "CPF inválido"];
		return [true, ""];
	} else return [false, "CPF inválido"];
};

const verifyPhone = (phone) => {
	if (!phone || phone.length < 10 || phone.length > 11) {
		return false;
	} else {
		return true;
	}
};

const verifyEmail = (email) => {
	if (!email || !email.length > 5 || !email.match(validRegex)) {
		return false;
	} else {
		return true;
	}
};

const verifyUsername = (username) => {
	if (
		!(
			username.length > 2 &&
			username.includes(" ") &&
			!returnOnlyNumber(username) &&
			/^[A-Za-z\s]*$/.test(username)
		)
	) {
		return false;
	} else {
		return true;
	}
};

const verifyPassword = (password) => {
	if (!(password.length > 5)) {
		return false;
	} else return true;
};

const verifyCep = async (currentAddress, noNumber = false) => {
	let numCep;

	if (currentAddress.cep) {
		numCep = returnOnlyNumber(currentAddress.cep);
	} else {
		return { error: true, cep: undefined, response: "Wrong Input" };
	}

	if (!noNumber) {
		if (!currentAddress.number || !currentAddress.number.length > 0) {
			return { error: true, cep: undefined, response: "Wrong Length" };
		}
	}

	let cepInfo = await getAddress(numCep);

	if (
		cepInfo.Erro ||
		currentAddress.logradouro !== cepInfo.logradouro ||
		currentAddress.bairro !== cepInfo.bairro ||
		currentAddress.localidade !== cepInfo.localidade ||
		currentAddress.uf !== cepInfo.uf
	) {
		return { error: true, cep: undefined, response: "Wrong address" };
	} else {
		return { error: false, cep: cepInfo, response: "" };
	}
};

const verifyInput = async (newUserInfo) => {
	if (!newUserInfo) return false;

	if (!newUserInfo.username || !verifyUsername(newUserInfo.username)) {
		return false;
	}
	if (!newUserInfo.password || !verifyPassword(newUserInfo.password)) {
		return false;
	}

	if (newUserInfo.currentAddress && newUserInfo.currentAddress.length > 0) {
		for (let i = 0; i < newUserInfo.currentAddress.length; i++) {
			let z = await verifyCep(newUserInfo.currentAddress[i]);
			if (z?.error) {
				return false;
			}
		}
	}
	return true;
};

module.exports = {
	verifyInput,
	verifyCep,
	verifyUsername,
	verifyEmail,
	verifyPhone,
	verifyCpf,
	verifyStock,
	verifyShippingCost,
	verifyId,
	language,
};
