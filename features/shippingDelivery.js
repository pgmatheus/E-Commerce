const corrDate = (date, daysP) => {
	let cdate = new Date(date.setDate(date.getDate() + daysP));
	if (cdate.getDay() == 0) {
		return new Date(cdate.setDate(cdate.getDate() + 1));
	} else if (cdate.getDay() == 6) {
		return new Date(cdate.setDate(cdate.getDate() + 2));
	} else {
		return cdate;
	}
};

const monthNames = [
	"Janeiro",
	"Fevereiro",
	"Março",
	"Abril",
	"Maio",
	"Junho",
	"Julho",
	"Agosto",
	"Setembro",
	"Outubro",
	"Novembro",
	"Dezembro",
];

const shippingDelivery = (shipping) => {
	if (shipping) {
		if (shipping.pac) {
			if (shipping.notPayed) {
				return {
					success: true,
					value: `Chegará em até ${(
						shipping.pac.PrazoEntrega + 5
					).toString()} dias úteis a partir da data de pagamento.`,
				};
			}

			let today = new Date();
			let cStartDayShipping = new Date(corrDate(today, 0).getTime());
			let cDayMinEndShipping = corrDate(
				new Date(cStartDayShipping.getTime()),
				parseInt(shipping.pac.PrazoEntrega) + 1
			);
			let cDayMaxEndShipping = corrDate(
				new Date(cStartDayShipping.getTime()),
				parseInt(shipping.pac.PrazoEntrega) + 4
			);

			return {
				success: true,
				value:
					"Chegará " +
					"entre " +
					cDayMinEndShipping.getDate() +
					" de " +
					monthNames[cDayMinEndShipping.getMonth()] +
					" e " +
					cDayMaxEndShipping.getDate() +
					" de " +
					monthNames[cDayMaxEndShipping.getMonth()],
			};
		}
	}

	return { success: false, value: undefined };
};

module.exports = shippingDelivery;
