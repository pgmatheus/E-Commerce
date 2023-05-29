import { returnOnlyNumber } from "./returnnumber";
const { consultarCep } = require("correios-brasil");

export const language = "br"; // change language
const lang = {
	br: {
		verifyName00: "Nome Inválido",
		verifyPhone00: "Telefone inválido",
	},
};

let validRegex =
	/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

export const verifyEmail = (email) => {
	if (!email || !(email.length > 5) || !email.match(validRegex)) {
		return [false, "Email não válido"];
	} else {
		return [true, ""];
	}
};

export const verifyName = (name) => {
	if (
		!(name && name.length > 2 && name.includes(" ") && !returnOnlyNumber(name))
	) {
		return {
			error: true,
			value: { name: name },
			response: lang[language].verifyName00,
		};
	} else {
		return { error: false, value: { name: name }, response: "" };
	}
};

export const verifyCpf = (cpf) => {
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

export const verifyCep = async (fullAddress) => {
	if (!fullAddress) {
		return [false, "CEP inválido"];
	}

	if (fullAddress.cep) {
		fullAddress = {
			...fullAddress,
			postalCode: fullAddress.cep,
			district: fullAddress.bairro,
			street: fullAddress.logradouro,
			city: fullAddress.localidade,
			state: fullAddress.uf,
		};
	}

	let cep = fullAddress.postalCode;
	if (
		!cep &&
		!(cep && returnOnlyNumber(cep) && returnOnlyNumber(cep).length == 8)
	) {
		return [false, "CEP inválido"];
	}

	let verCep = await consultarCep(returnOnlyNumber(cep));

	if (!verCep) {
		return [false, "CEP inválido"];
	}

	if (
		verCep.bairro !== fullAddress.district ||
		verCep.logradouro !== fullAddress.street ||
		verCep.localidade !== fullAddress.city ||
		verCep.uf !== fullAddress.state
	) {
		return [false, "CEP informações erradas, favor reinserir dados"];
	}

	return [true, ""];
};

export const verifyPhone = (phone) => {
	return {
		error: false,
		value: { phone: phone },
		response: "",
	};
	if (phone && phone.length > 9 && phone.length < 12) {
		return {
			error: false,
			value: { phone: phone },
			response: "",
		};
	} else {
		return {
			error: true,
			value: phone,
			response: lang[language].verifyPhone00,
		};
	}
};

/* consultarCep(onlyNumber).then((response) => {
	if (response && response.cep) {
		setAddressS(response);
		setAddress(
			response.logradouro +
				"; " +
				response.bairro +
				"; " +
				response.localidade
		);
	}
}); */
