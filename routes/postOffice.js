let Correios = require("node-correios");
const Shipping = require("../models/Shipping");
const router = require("express").Router();
let correios = new Correios();

// pac 04510, sedex 04014
// "nCdServico": "04014",

const diffDays = (date1, date2) => {
	const diffTime = Math.abs(date2 - date1);
	return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

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

router.get("/", async (req, res, next) => {
	try {
		const qCep = req.query;
		// let cond = false;
		let pArgs = {
			...args,
			sCepDestino: qCep.cep,
			nCdServico: "04510",
		};
		let today = new Date();

		let cobj = await correios
			.consultaCEP({ cep: qCep.cep })
			.then((result) => {
				return result;
			})
			.catch((error) => {
				return error;
			});

		if (cobj && cobj.localidade) {
			const ship = await Shipping.findOne({
				city: cobj.localidade,
			});
			if (ship && diffDays(today, ship.updatedAt) < 180) {
				res.status(200).json({
					pac: { Erro: "0", Valor: ship.shippingp, PrazoEntrega: ship.timeD },
					cep: cobj,
				});
			} else {
				let objp = await correios
					.calcPrecoPrazo(pArgs)
					.then((result) => {
						result[0].Valor = result[0].Valor.replace(",", ".");
						return result[0];
					})
					.catch((error) => {
						return error;
					});
				if (
					objp &&
					(objp.Erro == "0" || objp.Erro == "010" || objp.Erro == "011")
				) {
					if (ship) {
						const updatedShip = await Shipping.findOneAndUpdate(
							{ city: cobj.localidade },
							{
								timeD: objp.PrazoEntrega,
								shippingp: parseFloat(objp.Valor.replace(",", ".")),
							}
						);
						res.status(200).json({ pac: objp, cep: cobj });
					} else {
						const newShipping = new Shipping({
							cep: qCep.cep,
							city: cobj.localidade,
							timeD: objp.PrazoEntrega,
							district: cobj.bairro,
							shippingp: parseFloat(objp.Valor.replace(",", ".")),
						});
						try {
							const savedShipping = await newShipping.save();
						} catch (err) {
							console.log(err);
						}
						res.status(200).json({ pac: objp, cep: cobj });
					}
				} else {
					res.status(400).json({ error: true });
				}
			}
		} else {
			res.status(400).json({ error: true });
		}
	} catch (err) {
		next(err);
	}
});

module.exports = router;
