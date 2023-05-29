/// Correios
// Consultar CEP
const { consultarCep } = require("correios-brasil");

// Cep pode ser String ou Number
const cep = "41650472"; // 21770200 , '21770-200', '21770 200'.... qualquer um formato serve

consultarCep(cep).then((response) => {});

// Cálculo do frete

const { calcularPrecoPrazo } = require("correios-brasil");

let args = {
	// Não se preocupe com a formatação dos valores de entrada do cep, qualquer uma será válida (ex: 21770-200, 21770 200, 21asa!770@###200 e etc),
	sCepOrigem: "41650472",
	sCepDestino: "41750192",
	nVlPeso: "1",
	nCdFormato: "1",
	nVlComprimento: "20",
	nVlAltura: "20",
	nVlLargura: "20",
	nCdServico: ["04014", "04510"], //Array com os códigos de serviço
	nVlDiametro: "0",
};

calcularPrecoPrazo(args).then((response) => {});

{
	/* <div
								style={{
									height: "auto",
									margin: "0 auto",
									maxWidth: 128,
									width: "100%",
								}}
							>
								<QRCode
									size={256}
									style={{ height: "auto", maxWidth: "100%", width: "100%" }}
									value={"hey"}
									viewBox={`0 0 256 256`}
								/>
							</div> */
}
