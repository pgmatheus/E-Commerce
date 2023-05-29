const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
chai.use(chaiHttp);

let host = "http://localhost:5000/";
let token =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzMDM3YWEzMDJjMzJhZDIyZDFlYzZlZiIsImlzQWRtaW4iOmZhbHNlLCJpYXQiOjE2NjE3Nzk5MjAsImV4cCI6MTAzMDE2OTM1MjB9.3uQsztYmK1EE9lhkcGAg234xggIN_o2C5LIHxyJCVx8";
let id = "63037aa302c32ad22d1ec6ef";

let verObj = {
	session: "",
	env: "sandbox",
	sender: {
		name: "kakaroto dio",
		email: "a@a.com",
		phone: { areaCode: "71", number: "983017982" },
		document: { type: "CPF", value: "05164984520" },
	},
	shipping: {
		type: 1,
		cost: "21.00",
		street: "Rua Marcos Pinheiro",
		number: "112",
		complement: "perto da rua dos tolos",
		district: "Piatã",
		city: "Salvador",
		state: "BA",
		country: "BRA",
		postalCode: "41650472",
	},
	billing: {
		street: "Rua Marcos Pinheiro",
		number: "112",
		complement: "perto da rua dos tolos",
		district: "Piatã",
		city: "Salvador",
		state: "BA",
		country: "BRA",
		postalCode: "41650472",
	},
	items: [
		{
			id: "62c431c22e24eb5822d10867",
			quantity: "2",
			amount: "49.99",
			description: "vestido1",
		},
		{
			id: "62c431c22e24eb5822d10867",
			quantity: "1",
			amount: "49.99",
			description: "vestido1",
		},
		{
			id: "62c431d42e24eb5822d10869",
			quantity: "1",
			amount: "49.99",
			description: "vestido2",
		},
	],
};

let verObjErr = {
	session: "",
	env: "sandbox",
	sender: {
		name: "aa777 77",
		email: "a",
		phone: { areaCode: "71", number: "017982" },
		document: { type: "CPF", value: "0164984520" },
	},
	shipping: {
		type: 2,
		cost: "0.01",
		street: "Rua1 Marcos Pinheiro",
		number: "",
		complement: "erto da rua dos tolos",
		district: "iatã",
		city: "alvador",
		state: "A",
		country: "RA",
		postalCode: "650472",
	},
	billing: {
		street: "Rua Marcos Pinheiro",
		number: "",
		complement: "rto da rua dos tolos",
		district: "atã",
		city: "Sador",
		state: "B",
		country: "BA",
		postalCode: "40472",
	},
	items: [
		{
			id: "62c431c22e24eb5822d10867",
			quantity: "2",
			amount: "49.99",
			description: "vestido1",
		},
		{
			id: "62c431c22e24eb5822d10867",
			quantity: "1",
			amount: "49.99",
			description: "vestido1",
		},
		{
			id: "62c431d42e24eb5822d108691",
			quantity: "12",
			amount: "493.99",
			description: "vestido21",
		},
	],
};

let infoProduct = [
	{ size: "41", color: "yellow" },
	{ size: "42", color: "blue" },
	{ size: "41", color: "yellow" },
];

let infoProductErr = [
	{ size: "41", color: "yellow" },
	{ size: "42", color: "blue" },
	{ size: "51", color: "yyellow" },
];

describe("Test verify User Input", function () {
	let pathVerify = `api/verifycart/${id}`;

	it("Name is Invalid", function (done) {
		chai
			.request(host)
			.post(pathVerify)
			.set({ token: `Bearer ${token}` })
			.send({
				info: {
					...verObj,
					sender: { ...verObj.sender, name: "a" },
					infoProduct: infoProduct,
				},
				infoProduct: infoProduct,
			})
			.end(function (err, res) {
				assert.equal(res.text, '{"error":"Invalid Name"}');
				assert.equal(res.status, 400);
				done();
			});
	});

	it("Invalid PostalCode", function (done) {
		chai
			.request(host)
			.post(pathVerify)
			.set({ token: `Bearer ${token}` })
			.send({
				info: { ...verObj, shipping: { ...verObj.shipping, postalCode: "0" } },
				infoProduct: infoProduct,
			})
			.end(function (err, res) {
				assert.equal(res.text, '{"error":"Invalid Address"}');
				assert.equal(res.status, 400);
				done();
			});
	});

	it("Invalid Number", function (done) {
		chai
			.request(host)
			.post(pathVerify)
			.set({ token: `Bearer ${token}` })
			.send({
				info: { ...verObj, shipping: { ...verObj.shipping, number: "" } },
				infoProduct: infoProduct,
			})
			.end(function (err, res) {
				assert.equal(res.text, '{"error":"Invalid Address"}');
				assert.equal(res.status, 400);
				done();
			});
	});

	it("Invalid District", function (done) {
		chai
			.request(host)
			.post(pathVerify)
			.set({ token: `Bearer ${token}` })
			.send({
				info: { ...verObj, shipping: { ...verObj.shipping, district: "a" } },
				infoProduct: infoProduct,
			})
			.end(function (err, res) {
				assert.equal(res.text, '{"error":"Invalid Address"}');
				assert.equal(res.status, 400);
				done();
			});
	});

	it("Invalid Street", function (done) {
		chai
			.request(host)
			.post(pathVerify)
			.set({ token: `Bearer ${token}` })
			.send({
				info: { ...verObj, shipping: { ...verObj.shipping, street: "a" } },
				infoProduct: infoProduct,
			})
			.end(function (err, res) {
				assert.equal(res.text, '{"error":"Invalid Address"}');
				assert.equal(res.status, 400);
				done();
			});
	});

	it("Invalid City", function (done) {
		chai
			.request(host)
			.post(pathVerify)
			.set({ token: `Bearer ${token}` })
			.send({
				info: { ...verObj, shipping: { ...verObj.shipping, city: "a" } },
				infoProduct: infoProduct,
			})
			.end(function (err, res) {
				assert.equal(res.text, '{"error":"Invalid Address"}');
				assert.equal(res.status, 400);
				done();
			});
	});

	it("Invalid State", function (done) {
		chai
			.request(host)
			.post(pathVerify)
			.set({ token: `Bearer ${token}` })
			.send({
				info: { ...verObj, shipping: { ...verObj.shipping, state: "a" } },
				infoProduct: infoProduct,
			})
			.end(function (err, res) {
				assert.equal(res.text, '{"error":"Invalid Address"}');
				assert.equal(res.status, 400);
				done();
			});
	});

	it("Invalid Email", function (done) {
		chai
			.request(host)
			.post(pathVerify)
			.set({ token: `Bearer ${token}` })
			.send({
				info: { ...verObj, sender: { ...verObj.sender, email: "a" } },
				infoProduct: infoProduct,
			})
			.end(function (err, res) {
				assert.equal(res.text, '{"error":"Invalid Email"}');
				assert.equal(res.status, 400);
				done();
			});
	});

	it("Invalid Phone", function (done) {
		chai
			.request(host)
			.post(pathVerify)
			.set({ token: `Bearer ${token}` })
			.send({
				info: {
					...verObj,
					sender: {
						...verObj.sender,
						phone: { areaCode: "71", number: "9830179821" },
					},
				},
				infoProduct: infoProduct,
			})
			.end(function (err, res) {
				assert.equal(res.text, '{"error":"Invalid Phone"}');
				assert.equal(res.status, 400);
				done();
			});
	});

	it("Invalid Cpf", function (done) {
		chai
			.request(host)
			.post(pathVerify)
			.set({ token: `Bearer ${token}` })
			.send({
				info: {
					...verObj,
					sender: {
						...verObj.sender,
						document: { ...verObj.sender.document, value: undefined },
					},
				},
				infoProduct: infoProduct,
			})
			.end(function (err, res) {
				assert.equal(res.text, '{"error":"Invalid Document Number"}');
				assert.equal(res.status, 400);
				done();
			});
	});

	it("Billing Address Different than Delivery is OK", function (done) {
		chai
			.request(host)
			.post(pathVerify)
			.set({ token: `Bearer ${token}` })
			.send({
				info: { ...verObj, billing: { ...verObj.billing, number: "2" } },
				infoProduct: infoProduct,
			})
			.end(function (err, res) {
				assert.equal(res.text, '{"error":"Invalid Address"}');
				assert.equal(res.status, 400);
				done();
			});
	});

	it("Missing Info", function (done) {
		chai
			.request(host)
			.post(pathVerify)
			.set({ token: `Bearer ${token}` })
			.send({
				infoProduct: infoProduct,
			})
			.end(function (err, res) {
				assert.equal(res.text, '{"error":"Missing Info"}');
				assert.equal(res.status, 400);
				done();
			});
	});

	it("Missing infoProduct", function (done) {
		chai
			.request(host)
			.post(pathVerify)
			.set({ token: `Bearer ${token}` })
			.send({
				info: { ...verObj, billing: { ...verObj.billing, number: "2" } },
			})
			.end(function (err, res) {
				assert.equal(res.text, '{"error":"Missing Info"}');
				assert.equal(res.status, 400);
				done();
			});
	});

	it("Different sizes from infoProduct and items", function (done) {
		chai
			.request(host)
			.post(pathVerify)
			.set({ token: `Bearer ${token}` })
			.send({
				info: verObj,
				infoProduct: [...infoProduct, { size: "41", color: "red" }],
			})
			.end(function (err, res) {
				assert.equal(
					res.text,
					'{"error":"Invalid sizes of items and descriptions."}'
				);
				assert.equal(res.status, 400);
				done();
			});
	});

	it("Wrong ID", function (done) {
		chai
			.request(host)
			.post(pathVerify)
			.set({ token: `Bearer ${token}` })
			.send({
				info: {
					...verObj,
					items: [
						{
							id: "6",
							quantity: "2",
							amount: "49.99",
							description: "vestido1",
						},
						...verObj.items,
					],
				},
				infoProduct: [...infoProduct, { size: "41", color: "red" }],
			})
			.end(function (err, res) {
				assert.equal(res.text, '{"error":"Invalid ID"}');
				assert.equal(res.status, 400);
				done();
			});
	});

	it("Product not found", function (done) {
		chai
			.request(host)
			.post(pathVerify)
			.set({ token: `Bearer ${token}` })
			.send({
				info: {
					...verObj,
					items: [
						{
							id: "63037aa302c32ad22d1ec6ef",
							quantity: "2",
							amount: "49.99",
							description: "vestido1",
						},
						...verObj.items,
					],
				},
				infoProduct: [...infoProduct, { size: "41", color: "red" }],
			})
			.end(function (err, res) {
				assert.equal(res.text, '{"error":"Product not found"}');
				assert.equal(res.status, 400);
				done();
			});
	});

	it("Different sizes or color", function (done) {
		chai
			.request(host)
			.post(pathVerify)
			.set({ token: `Bearer ${token}` })
			.set({ token: `Bearer ${token}` })
			.send({
				info: verObj,
				infoProduct: [
					...infoProduct.slice(0, 2),
					{ size: "99", color: "yellow" },
				],
			})
			.end(function (err, res) {
				assert.equal(res.text, '{"error":"Mismatch color or size"}');
				assert.equal(res.status, 400);
				done();
			});
	});

	it("Different price", function (done) {
		chai
			.request(host)
			.post(pathVerify)
			.set({ token: `Bearer ${token}` })
			.set({ token: `Bearer ${token}` })
			.send({
				info: {
					...verObj,
					items: [
						...verObj.items.slice(0, 2),
						{
							id: "62c431d42e24eb5822d10869",
							quantity: "1",
							amount: "59.99",
							description: "vestido2",
						},
					],
				},
				infoProduct: infoProduct,
			})
			.end(function (err, res) {
				assert.equal(res.text, '{"error":"Error product price"}');
				assert.equal(res.status, 400);
				done();
			});
	});

	it("Mismatch Title", function (done) {
		chai
			.request(host)
			.post(pathVerify)
			.set({ token: `Bearer ${token}` })
			.send({
				info: {
					...verObj,
					items: [
						...verObj.items.slice(0, 2),
						{
							...verObj.items.slice(2, 3)["0"],
							description: verObjErr.items.slice(2, 3)["0"].description,
						},
					],
				},
				infoProduct: infoProduct,
			})
			.end(function (err, res) {
				assert.equal(res.text, '{"error":"Mismatch title"}');
				assert.equal(res.status, 400);
				done();
			});
	});

	it("Everything is OK", function (done) {
		this.timeout(10000);
		setTimeout(done, 10000);
		chai
			.request(host)
			.post(pathVerify)
			.set({ token: `Bearer ${token}` })
			.send({ info: verObj, infoProduct: infoProduct })
			.end(function (err, res) {
				assert.equal(res.status, 200);
				assert.equal(res.text, '{"foi":"success"}');
				done();
			});
	});
});

//#region

/* describe("Products test", function () {
	let pathProduct = "api/products";
	it("should get product list", function (done) {
		chai
			.request(host)
			.get(pathProduct)
			.end(function (err, res) {
				assert.equal(typeof res.body, "object");
				assert.isAbove(Object.keys(res.body).length, 0);
				assert.isDefined(res.body[0].title);
				assert.equal(res.status, 200);
				done();
			});
	});
}); */

/* describe("Register test", function () {
	let path = "api/auth/register";

	it("register without error", function (done) {
		chai
			.request(host)
			.post(path)
			.send({
				username: "Ana",
				phone: "71999017982",
				number: "12345678",
				complement: "comp",
				currentAddress: {
					cep: "41750190",
					logradouro: "Travessa do Caxundé",
					complemento: "",
					bairro: "Armação",
					localidade: "Salvador",
					uf: "BA",
					ibge: "2927408",
					gia: "",
					ddd: "71",
					siafi: "3849",
				},
				email: "admimm@a.com",
				password: "123456",
			})
			.end(function (err, res) {
				assert.equal(res.body.register, true);
				assert.equal(res.status, 200);
				done();
			});
	});

	it("Register with short name", function (done) {
		chai
			.request(host)
			.post(path)
			.send({
				username: "",
				phone: "71999017982",
				number: "12345678",
				complement: "comp",
				currentAddress: {
					cep: "41750190",
					logradouro: "Travessa do Caxundé",
					complemento: "",
					bairro: "Armação",
					localidade: "Salvador",
					uf: "BA",
					ibge: "2927408",
					gia: "",
					ddd: "71",
					siafi: "3849",
				},
				email: "admimm@a.com",
				password: "12345678",
			})
			.end(function (err, res) {
				assert.equal(res.body.register, false);
				assert.equal(res.status, 200);
				done();
			});
	});

	it("register without cep", function (done) {
		chai
			.request(host)
			.post(path)
			.send({
				username: "Ana",
				phone: "71999017982",
				number: "1",
				complement: "comp",
				currentAddress: {
					cep: "",
					logradouro: "Travessa do Caxundé",
					complemento: "",
					bairro: "Armação",
					localidade: "Salvador",
					uf: "BA",
					ibge: "2927408",
					gia: "",
					ddd: "71",
					siafi: "3849",
				},
				email: "admimm@a.com",
				password: "12345678",
			})
			.end(function (err, res) {
				assert.equal(res.body.register, false);
				assert.equal(res.status, 200);
				done();
			});
	});

	it("register cep with invalid characters", function (done) {
		chai
			.request(host)
			.post(path)
			.send({
				username: "Ana",
				phone: "71999017982",
				complement: "comp",
				currentAddress: {
					cep: "abc17548",
					logradouro: "Travessa do Caxundé",
					complemento: "",
					bairro: "Armação",
					localidade: "Salvador",
					uf: "BA",
					ibge: "2927408",
					gia: "",
					ddd: "71",
					siafi: "3849",
				},
				email: "admimm@a.com",
				password: "12345678",
			})
			.end(function (err, res) {
				assert.equal(res.body.register, false);
				assert.equal(res.status, 200);
				done();
			});
	});

	it("Register without number", function (done) {
		chai
			.request(host)
			.post(path)
			.send({
				username: "aaaa",
				phone: "71999017982",
				number: "",
				complement: "comp",
				currentAddress: [
					{
						cep: "41750190",
						logradouro: "Travessa do Caxundé",
						complemento: "",
						bairro: "Armação",
						localidade: "Salvador",
						uf: "BA",
						ibge: "2927408",
						gia: "",
						ddd: "71",
						siafi: "3849",
					},
				],
				email: "admimm@a.com",
				password: "12345678",
			})
			.end(function (err, res) {
				assert.equal(res.body.register, false);
				assert.equal(res.status, 200);
				done();
			});
	});

	it("Register with a short password", function (done) {
		chai
			.request(host)
			.post(path)
			.send({
				username: "aaa",
				phone: "71999017982",
				number: "12345678",
				complement: "comp",
				currentAddress: {
					cep: "41750190",
					logradouro: "Travessa do Caxundé",
					complemento: "",
					bairro: "Armação",
					localidade: "Salvador",
					uf: "BA",
					ibge: "2927408",
					gia: "",
					ddd: "71",
					siafi: "3849",
				},
				email: "admimm@a.com",
				password: "12345",
			})
			.end(function (err, res) {
				assert.equal(res.body.register, false);
				assert.equal(res.status, 200);
				done();
			});
	});

	it("Register email with invalid characters", function (done) {
		chai
			.request(host)
			.post(path)
			.send({
				username: "aaaa",
				phone: "71999017982",
				number: "12345678",
				complement: "comp",
				currentAddress: {
					cep: "41750190",
					logradouro: "Travessa do Caxundé",
					complemento: "",
					bairro: "Armação",
					localidade: "Salvador",
					uf: "BA",
					ibge: "2927408",
					gia: "",
					ddd: "71",
					siafi: "3849",
				},
				email: "æadmimm@a.com",
				password: "12345678",
			})
			.end(function (err, res) {
				assert.equal(res.body.register, false);
				assert.equal(res.status, 200);
				done();
			});
	});
}); */

//#endregion
