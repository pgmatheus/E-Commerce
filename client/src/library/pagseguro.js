/* callbackPaymentMethods({
	paymentMethods: {
		ONLINE_DEBIT: {
			name: "ONLINE_DEBIT",
			options: {
				BANCO_BRASIL: {
					images: {
						SMALL: {
							size: "SMALL",
							path: "/public/img/payment-methods-flags/42x20/bb.png",
						},
						MEDIUM: {
							size: "MEDIUM",
							path: "/public/img/payment-methods-flags/68x30/bb.png",
						},
					},
					name: "BANCO_BRASIL",
					displayName: "Banco do Brasil",
					code: 304,
					status: "AVAILABLE",
				},
				BANRISUL: {
					images: {
						SMALL: {
							size: "SMALL",
							path: "/public/img/payment-methods-flags/42x20/banrisul.png",
						},
						MEDIUM: {
							size: "MEDIUM",
							path: "/public/img/payment-methods-flags/68x30/banrisul.png",
						},
					},
					name: "BANRISUL",
					displayName: "Banco Banrisul",
					code: 306,
					status: "AVAILABLE",
				},
				BRADESCO: {
					images: {
						SMALL: {
							size: "SMALL",
							path: "/public/img/payment-methods-flags/42x20/bradesco.png",
						},
						MEDIUM: {
							size: "MEDIUM",
							path: "/public/img/payment-methods-flags/68x30/bradesco.png",
						},
					},
					name: "BRADESCO",
					displayName: "Banco Bradesco",
					code: 301,
					status: "AVAILABLE",
				},
				ITAU: {
					images: {
						SMALL: {
							size: "SMALL",
							path: "/public/img/payment-methods-flags/42x20/itau.png",
						},
						MEDIUM: {
							size: "MEDIUM",
							path: "/public/img/payment-methods-flags/68x30/itau.png",
						},
					},
					name: "ITAU",
					displayName: "Banco Itaú",
					code: 302,
					status: "AVAILABLE",
				},
			},
			code: 3,
		},
		DEBIT_CARD: {
			name: "DEBIT_CARD",
			options: {
				ELO: {
					images: null,
					name: "ELO",
					displayName: "Elo Débito",
					code: 803,
					status: "AVAILABLE",
				},
			},
			code: 8,
		},
		DEPOSIT: {
			name: "DEPOSIT",
			options: {
				BANCO_BRASIL: {
					images: {
						SMALL: {
							size: "SMALL",
							path: "/public/img/payment-methods-flags/42x20/bb.png",
						},
						MEDIUM: {
							size: "MEDIUM",
							path: "/public/img/payment-methods-flags/68x30/bb.png",
						},
					},
					name: "BANCO_BRASIL",
					displayName: "Banco do Brasil",
					code: 701,
					status: "AVAILABLE",
				},
				HSBC: {
					images: {
						SMALL: {
							size: "SMALL",
							path: "/public/img/payment-methods-flags/42x20/hsbc.png",
						},
						MEDIUM: {
							size: "MEDIUM",
							path: "/public/img/payment-methods-flags/68x30/hsbc.png",
						},
					},
					name: "HSBC",
					displayName: "HSBC",
					code: 702,
					status: "UNAVAILABLE",
				},
			},
			code: 7,
		},
		CREDIT_CARD: {
			name: "CREDIT_CARD",
			options: {
				AMEX: {
					images: {
						SMALL: {
							size: "SMALL",
							path: "/public/img/payment-methods-flags/42x20/amex.png",
						},
						MEDIUM: {
							size: "MEDIUM",
							path: "/public/img/payment-methods-flags/68x30/amex.png",
						},
					},
					name: "AMEX",
					displayName: "American Express",
					code: 103,
					status: "AVAILABLE",
				},
				AURA: {
					images: {
						SMALL: {
							size: "SMALL",
							path: "/public/img/payment-methods-flags/42x20/aura.png",
						},
						MEDIUM: {
							size: "MEDIUM",
							path: "/public/img/payment-methods-flags/68x30/aura.png",
						},
					},
					name: "AURA",
					displayName: "Aura",
					code: 106,
					status: "AVAILABLE",
				},
				BRASILCARD: {
					images: {
						SMALL: {
							size: "SMALL",
							path: "/public/img/payment-methods-flags/42x20/brasilcard.png",
						},
						MEDIUM: {
							size: "MEDIUM",
							path: "/public/img/payment-methods-flags/68x30/brasilcard.png",
						},
					},
					name: "BRASILCARD",
					displayName: "BrasilCard",
					code: 112,
					status: "AVAILABLE",
				},
				CABAL: {
					images: {
						SMALL: {
							size: "SMALL",
							path: "/public/img/payment-methods-flags/42x20/cabal.png",
						},
						MEDIUM: {
							size: "MEDIUM",
							path: "/public/img/payment-methods-flags/68x30/cabal.png",
						},
					},
					name: "CABAL",
					displayName: "Cabal",
					code: 116,
					status: "AVAILABLE",
				},
				CARDBAN: {
					images: {
						SMALL: {
							size: "SMALL",
							path: "/public/img/payment-methods-flags/42x20/cardban.png",
						},
						MEDIUM: {
							size: "MEDIUM",
							path: "/public/img/payment-methods-flags/68x30/cardban.png",
						},
					},
					name: "CARDBAN",
					displayName: "CARDBAN",
					code: 114,
					status: "UNAVAILABLE",
				},
				DINERS: {
					images: {
						SMALL: {
							size: "SMALL",
							path: "/public/img/payment-methods-flags/42x20/diners.png",
						},
						MEDIUM: {
							size: "MEDIUM",
							path: "/public/img/payment-methods-flags/68x30/diners.png",
						},
					},
					name: "DINERS",
					displayName: "Diners",
					code: 104,
					status: "AVAILABLE",
				},
				ELO: {
					images: {
						SMALL: {
							size: "SMALL",
							path: "/public/img/payment-methods-flags/42x20/elo.png",
						},
						MEDIUM: {
							size: "MEDIUM",
							path: "/public/img/payment-methods-flags/68x30/elo.png",
						},
					},
					name: "ELO",
					displayName: "Elo",
					code: 107,
					status: "AVAILABLE",
				},
				FORTBRASIL: {
					images: {
						SMALL: {
							size: "SMALL",
							path: "/public/img/payment-methods-flags/42x20/fortbrasil.png",
						},
						MEDIUM: {
							size: "MEDIUM",
							path: "/public/img/payment-methods-flags/68x30/fortbrasil.png",
						},
					},
					name: "FORTBRASIL",
					displayName: "FORTBRASIL",
					code: 113,
					status: "AVAILABLE",
				},
				GRANDCARD: {
					images: {
						SMALL: {
							size: "SMALL",
							path: "/public/img/payment-methods-flags/42x20/grandcard.png",
						},
						MEDIUM: {
							size: "MEDIUM",
							path: "/public/img/payment-methods-flags/68x30/grandcard.png",
						},
					},
					name: "GRANDCARD",
					displayName: "GRANDCARD",
					code: 119,
					status: "AVAILABLE",
				},
				HIPERCARD: {
					images: {
						SMALL: {
							size: "SMALL",
							path: "/public/img/payment-methods-flags/42x20/hipercard.png",
						},
						MEDIUM: {
							size: "MEDIUM",
							path: "/public/img/payment-methods-flags/68x30/hipercard.png",
						},
					},
					name: "HIPERCARD",
					displayName: "Hipercard",
					code: 105,
					status: "AVAILABLE",
				},
				MAIS: {
					images: {
						SMALL: {
							size: "SMALL",
							path: "/public/img/payment-methods-flags/42x20/mais.png",
						},
						MEDIUM: {
							size: "MEDIUM",
							path: "/public/img/payment-methods-flags/68x30/mais.png",
						},
					},
					name: "MAIS",
					displayName: "Mais!",
					code: 117,
					status: "AVAILABLE",
				},
				MASTERCARD: {
					images: {
						SMALL: {
							size: "SMALL",
							path: "/public/img/payment-methods-flags/42x20/mastercard.png",
						},
						MEDIUM: {
							size: "MEDIUM",
							path: "/public/img/payment-methods-flags/68x30/mastercard.png",
						},
					},
					name: "MASTERCARD",
					displayName: "MasterCard",
					code: 102,
					status: "AVAILABLE",
				},
				PERSONALCARD: {
					images: {
						SMALL: {
							size: "SMALL",
							path: "/public/img/payment-methods-flags/42x20/personalcard.png",
						},
						MEDIUM: {
							size: "MEDIUM",
							path: "/public/img/payment-methods-flags/68x30/personalcard.png",
						},
					},
					name: "PERSONALCARD",
					displayName: "PersonalCard",
					code: 109,
					status: "AVAILABLE",
				},
				PLENOCARD: {
					images: {
						SMALL: {
							size: "SMALL",
							path: "/public/img/payment-methods-flags/42x20/plenocard.png",
						},
						MEDIUM: {
							size: "MEDIUM",
							path: "/public/img/payment-methods-flags/68x30/plenocard.png",
						},
					},
					name: "PLENOCARD",
					displayName: "PLENOCard",
					code: 108,
					status: "UNAVAILABLE",
				},
				SOROCRED: {
					images: {
						SMALL: {
							size: "SMALL",
							path: "/public/img/payment-methods-flags/42x20/sorocred.png",
						},
						MEDIUM: {
							size: "MEDIUM",
							path: "/public/img/payment-methods-flags/68x30/sorocred.png",
						},
					},
					name: "SOROCRED",
					displayName: "Sorocred",
					code: 120,
					status: "AVAILABLE",
				},
				VALECARD: {
					images: {
						SMALL: {
							size: "SMALL",
							path: "/public/img/payment-methods-flags/42x20/valecard.png",
						},
						MEDIUM: {
							size: "MEDIUM",
							path: "/public/img/payment-methods-flags/68x30/valecard.png",
						},
					},
					name: "VALECARD",
					displayName: "VALECARD",
					code: 115,
					status: "AVAILABLE",
				},
				VISA: {
					images: {
						SMALL: {
							size: "SMALL",
							path: "/public/img/payment-methods-flags/42x20/visa.png",
						},
						MEDIUM: {
							size: "MEDIUM",
							path: "/public/img/payment-methods-flags/68x30/visa.png",
						},
					},
					name: "VISA",
					displayName: "Visa",
					code: 101,
					status: "AVAILABLE",
				},
			},
			code: 1,
		},
		BOLETO: {
			name: "BOLETO",
			options: {
				BOLETO: {
					images: {
						SMALL: {
							size: "SMALL",
							path: "/public/img/payment-methods-flags/42x20/booklet.png",
						},
						MEDIUM: {
							size: "MEDIUM",
							path: "/public/img/payment-methods-flags/68x30/booklet.png",
						},
					},
					name: "BOLETO",
					displayName: "Boleto",
					code: 202,
					status: "AVAILABLE",
				},
			},
			code: 2,
		},
		BALANCE: {
			name: "BALANCE",
			options: {
				BALANCE: {
					images: null,
					name: "BALANCE",
					displayName: "Saldo PagSeguro",
					code: 401,
					status: "AVAILABLE",
				},
			},
			code: 4,
		},
	},
	error: false,
});
 */
