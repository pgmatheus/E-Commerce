const nodemailer = require("nodemailer");
const shippingDelivery = require("../features/shippingDelivery");

const host = ("https://taliskafashion.com.br" || process.env.HOST_URL) + "/"; // verificar

/* const transporter = nodemailer.createTransport({
	host: "smtp.hostinger.com.br",
	port: "587",
	tls: {
		rejectUnauthorized: false,
	},
	auth: {
		user: process.env.EMAIL,
		pass: process.env.PASSWORD_EMAIL,
	},
}); */

let mailOptions = (to, subject, html, bcc, from) => {
	return {
		from: from,
		to: to,
		subject: subject,
		html: html,
		bcc: bcc || "",
		envelope: {
			from: `Taliska Fashion <${from}>`, // used as MAIL FROM: address for SMTP
			to: `${to}`, // used as RCPT TO: address for SMTP
			bcc: `${bcc}`,
		},
	};
};

/* let resetpassword = (token) => {
	return `
    <div style="display: flex;
  margin: auto;
  flex-direction: column;
  align-items: center;
            text-align: center">
<h1 style="margin:0px;">Taliska Fashion<h1>
  <h2 style="margin: -10px 0px 20px 0px;">Segue link para reset de password: </h2>
  <a style="cursor:pointer;" target="_blanck" href="${host}changepassword/?token=${token}" >${host}changepassword/?token=${token}</a>
  <h3 style="margin:20px;">Caso você não tenha solicitado, fique tranquilo(a), só ignorar este e-mail. Sua conta está protegida.</h3>  
</div>
    `;
}; */

const dontAns = () => {
	return `  <div style="text-align: center"><h3 style="margin:20px;">E-mail de envio automático. Não responder.</h3></div>`;
};

const showShippingEstimate = (obj) => {
	if (obj.shipping.showEstimate) {
		return `<p>Previsão de entrega: ${
			shippingDelivery(obj.shipping).value
		}</p>`;
	} else return ``;
};

let insertAddress = (obj) => {
	let tempArr = `<div style="background-color: #f5f1f0; text-align: center; padding: 5px 0px;">
 <div style="text-align: left; padding: 0px 100px">
 <p>Endereço: ${obj.shipping.cep.logradouro}, ${obj.shipping.cep.number}, 
   ${obj.shipping.cep.compl}, ${obj.shipping.cep.bairro}, 
   ${obj.shipping.cep.localidade}/${obj.shipping.cep.uf}.</p>      
  <p>Valor: R$${obj.shipping.pac.Valor.toString().replace(".", ",")}.</p>`;
	return (
		tempArr +
		showShippingEstimate(obj) +
		`</div>
  </div>    
   </div>`
	);
};

const genereteProductInfo = (product) => {
	let result = ``;
	if (product?.length > 0) {
		for (let i = 0; i < product.length; i++) {
			result =
				result +
				`<div style="background-color: #f5f1f0;">
    
			<div style="display: flex;
			justify-content: space-between;
			border-bottom: 1px solid rgba(0, 0, 0, 0.1);
			height: fit-content;">
			  <img style="width: 100px; min-height: 150px"  src="${product[i].img[0]}" />
			  <div>
			  <div style="margin: 10px 20px">
			  <span>
				<b>Produto:</b> ${product[i].title}
			  </span>
			  </div>
				
			  <div style="display: flex; margin: 10px 20px;">
				<b>Cor principal:</b>
			   
				<div 
					style="width: 20px;
						height: 20px;
						border-radius: 50%;
						background-color: ${product[i].color};
						margin-left: 5px;">
				</div>
			
				</div>
				<div style="margin: 10px 20px">
			  <span>
				<b>Tamanho:</b> ${product[i].size}
			  </span>
			  </div>
			  <div style="margin: 10px 20px">
				<span>
				<b>Quantidade:</b> ${product[i].quantity}
			  </span>
			  </div>
			  <div style="margin: 10px 20px">
			  <span>
				<b>Preço unitário:</b> R$${product[i].price.toString().replace(".", ",")}
			  </span>
			  </div>
				</div>			  
			  
			</div>`;
		}
		return result;
	}
};

let resetpassword = (token) => {
	return `
    <div style="
            text-align: center">
<h1 style="margin:0px;">Taliska Fashion<h1>
  <h2 style="margin: -10px 0px 20px 0px;">Segue link para reset de password: </h2>
  <a style="cursor:pointer;" target="_blanck" href="${host}changepassword/?token=${token}" >${host}changepassword/?token=${token}</a>
  <h3 style="margin:20px;">Caso você não tenha solicitado, fique tranquilo(a), só ignorar este e-mail. Sua conta está protegida.</h3>
  <h3 style="margin:20px;">E-mail de envio automático. Não responder.</h3>   
</div>
    `;
};

let paymentProcessed = (obj) => {
	let result = `<div>
	<div>
	<div style="text-align: center; margin-bottom: 20px";>
  <h1 style="margin:0px;">Taliska Fashion<h1>
	<h2 style="margin: -10px 0px 20px 0px;">Pagamento aprovado!</h2>
	<h3> Em breve enviaremos atualizações da postagem!</h3>
   </div>
   <div style=" min-width: 300px; max-width: 600px; margin: auto">
	`;
	result =
		result +
		genereteProductInfo(obj.product) +
		`</div>` +
		insertAddress({
			...obj,
			shipping: { ...obj.shipping, notPayed: false, showEstimate: true },
		}) +
		`</div>` +
		dontAns();
	return result;
};

let processedPurchase = (obj) => {
	let result = `<div>
	<div>
	<div style="text-align: center; margin-bottom: 20px";>
  <h1 style="margin:0px;">Taliska Fashion<h1>
	<h2 style="margin: -10px 0px 20px 0px;">Compra processada com sucesso! </h2>
	<h2>Informações de pagamento no link abaixo:  </h2>   
   <a style="cursor:pointer;  text-decoration: none;" target="_blanck" href="${host}purchases" >${host}purchases</a>  
   </div>
   <div style=" min-width: 300px; max-width: 600px; margin: auto">
	`;
	result =
		result +
		genereteProductInfo(obj.product) +
		`</div>` +
		insertAddress({
			...obj,
			shipping: { ...obj.shipping, notPayed: true, showEstimate: true },
		}) +
		`</div>` +
		dontAns();
	return result;
};

let productSent = (obj) => {
	let result = `<div>
	<div>
	<div style="text-align: center; margin-bottom: 20px";>
  <h1 style="margin:0px;">Taliska Fashion<h1>
	<h2 style="margin: -10px 0px 20px 0px;">Produto enviado!</h2>
	<h3> Seu código de rastreio é ${obj.shippingCode}!</h3>
	<h3>Você pode também acompanhar seu pedido no endereço abaixo:</h3>   
   <a style="cursor:pointer;  text-decoration: none;" target="_blanck" href="${host}purchases" >${host}purchases</a> 
   </div>
   <div style=" min-width: 300px; max-width: 600px; margin: auto">
	`;

	result =
		result +
		genereteProductInfo(obj.product) +
		`</div>` +
		insertAddress({
			...obj,
			shipping: { ...obj.shipping, notPayed: false, showEstimate: true },
		}) +
		`</div>` +
		dontAns();

	return result;
};

let productReceived = (obj) => {
	let result = `<div>
	<div>
	<div style="text-align: center; margin-bottom: 20px";>
  <h1 style="margin:0px;">Taliska Fashion<h1>
	<h2 style="margin: -10px 0px 20px 0px;">Compra recebida!</h2>
	<h2>Esperamos que goste!</h2>
   <div style=" min-width: 300px; max-width: 600px; margin: auto">
	`;

	result =
		result +
		genereteProductInfo(obj.product) +
		`</div>` +
		insertAddress({
			...obj,
			shipping: { ...obj.shipping, notPayed: false, showEstimate: false },
		}) +
		`</div>` +
		dontAns();

	return result;
};

let activateAccount = (token) => {
	return `
    <div style="
            text-align: center">
<h1 style="margin:0px;">Taliska Fashion<h1>
  <h2 style="margin: -10px 0px 20px 0px;">Segue link para ativação de conta: </h2>
  <a style="cursor:pointer;" target="_blanck" href="${host}activation/?token=${token}" >${host}activation/?token=${token}</a>
  <h3 style="margin:20px;">E-mail de envio automático. Não responder.</h3>   
</div>
    `;
};

let errorLog = (content) => {
	return `<div><pre>${content}</pre></div>`;
};

const nodemailerApp = async (obj) => {
	let html;
	/* const { next } = obj; */

	try {
		switch (obj.subject) {
			case "Taliska Fashion - Reset password":
				html = resetpassword(obj.token);
				break;
			case "Error log":
				html = errorLog(obj.content);
				break;
			case "Taliska Fashion - Ativação de conta":
				html = activateAccount(obj.token);
				break;
			case "Taliska Fashion - Compra processada":
				html = processedPurchase(obj.content);
				break;
			case "Taliska Fashion - Pagamento aprovado":
				html = paymentProcessed(obj.content);
				break;
			case "Taliska Fashion - Compra enviada":
				html = productSent(obj.content);
				break;
			case "Taliska Fashion - Compra recebida":
				html = productReceived(obj.content);
				break;
		}
	} catch (err) {
		console.log(err);
	}

	let transporter;

	if (obj.subject === "Error log") {
		transporter = nodemailer.createTransport({
			host: "smtp.hostinger.com.br",
			port: "587",
			/* tls: {
				rejectUnauthorized: false,
			}, */
			auth: {
				user: process.env.EMAILLOGS,
				pass: process.env.PASSWORD_EMAIL,
			},
		});
	} else {
		transporter = nodemailer.createTransport({
			host: "smtp.hostinger.com.br",
			port: "587",
			tls: {
				rejectUnauthorized: false,
			},
			auth: {
				user: process.env.EMAIL,
				pass: process.env.PASSWORD_EMAIL,
			},
		});
	}

	transporter.sendMail(
		mailOptions(obj.to, obj.subject, html, obj.bcc, obj.from),
		function (err, data) {
			if (err) {
				console.log(err);
			} else {
				console.log("sent mail");
			}
			return;
		}
	);
};

module.exports = nodemailerApp;
