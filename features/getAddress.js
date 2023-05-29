const router = require("express").Router();
let Correios = require("node-correios");
let correios = new Correios();

const getAddress = (cep) => {
	let cobj = correios
		.consultaCEP({ cep: cep })
		.then((result) => {
			return result;
		})
		.catch((error) => {
			return error;
		});

	return cobj;
};

/* const getAddress = (cep) => {
	
	let cobj = correios
		.consultaCEP({ cep: cep })
		.then((result) => {
			return result;
		})
		.catch((error) => {
			return error;
		});

	return cobj;
}; */

module.exports = getAddress;
