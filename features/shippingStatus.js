const axios = require("axios");
const handleError = require("./handleError");
/* const { rastrearEncomendas } = require("correios-brasil"); */
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const shippingStatus = async (shippingCode) => {
	try {
		let cond = false;
		let eventos = [];

		/* let arrRes = { codigo: shippingCode, eventos: [] }; */

		const status = await axios.get(
			`https://www.linkcorreios.com.br/${shippingCode}`
		);

		if (!status) {
			throw new Error("Error getting info from Post Office API");
		}

		const dom = new JSDOM(status.data);
		let infoScraped = dom.window.document.querySelectorAll("li");

		if (!infoScraped) {
			throw new Error("Shipping does not have updates");
		}

		for (li in infoScraped) {
			if (infoScraped[li]?.textContent?.includes("Enviar por Whats")) {
				cond = true;
			}

			/* console.log(typeof infoScraped[li].textContent); */

			if (cond && infoScraped[li]?.textContent?.includes("Status:")) {
				let origem;
				let destino;
				let local;

				let infoDate = infoScraped[
					(parseInt(li) + 1).toString()
				]?.textContent?.replace("Data  : ", "");

				let addressInfo =
					infoScraped[(parseInt(li) + 2).toString()]?.textContent;

				if (addressInfo.includes("Origem: ")) {
					origem = addressInfo.slice(8);
					destino = addressInfo.slice(8);
				} else {
					local = addressInfo.slice(7);
				}

				let tempObj = {
					status: infoScraped[li]?.textContent.slice(8),
					data: infoDate.slice(0, 10),
					hora: infoDate.slice(19, 24),
					origem: origem,
					destino: destino,
					local: local,
				};

				eventos.push(tempObj);

				/* let pushedArr = arrRes.eventos;

				arrRes = { ...arrRes, eventos: pushedArr }; */
			}
		}

		/* rastrearEncomendas(codRastreio).then((response) => {
			console.log(response);
		}); */

		/* const status = await axios.get(
			`https://proxyapp.correios.com.br/v1/sro-rastro/${shippingCode}`
		);

		

		if (!status) {
			return {
				success: false,
				error: true,
				message: "error getting info from CorreiosDB",
			};
		}

		console.log(status.data); */

		return {
			success: true,
			error: false,
			data: { codObjeto: shippingCode, eventos: eventos },
		};
	} catch (err) {
		handleError(err);

		/* return {
			success: false,
			error: true,
			data: {},
			message: "processing error",
		}; */
	}
};

module.exports = shippingStatus;
