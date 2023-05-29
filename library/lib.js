// tunnel

// npx localtunnel --subdomain taliska fashion  --port 5000


// Correios

/* /\* nCdServico - String

Código do serviço:

04014 = SEDEX à vista
04065 = SEDEX à vista pagamento na entrega
04510 = PAC à vista
04707 = PAC à vista pagamento na entrega
40169 = SEDEX12 ( à vista e a faturar)
40215 = SEDEX 10 (à vista e a faturar)
40290 = SEDEX Hoje Varejo
sCepOrigem - String

CEP de Origem sem hífen. Exemplo: 05311900

sCepDestino - String

CEP de Destino sem hífen

nVlPeso - String

Peso da encomenda, incluindo sua embalagem. O peso deve ser informado em quilogramas. Se o formato for Envelope, o valor máximo permitido será 1 kg

nCdFormato - Inteiro

Formato da encomenda (incluindo embalagem)

1 = Formato caixa/pacote
2 = Formato rolo/prisma
3 = Envelope
nVlComprimento - Decimal

Comprimento da encomenda (incluindo embalagem), em centímetros

nVlAltura - Decimal

Altura da encomenda (incluindo embalagem), em centímetros. Se o formato for envelope, informar zero (0)

nVlLargura - Decimal

Largura da encomenda (incluindo embalagem), em centímetros

nVlDiametro - Decimal

Diâmetro da encomenda (incluindo embalagem), em centímetros

Não obrigatórios
nCdEmpresa - String

Seu código administrativo junto à ECT. O código está disponível no corpo do contrato firmado com os Correios

sDsSenha - String

Senha para acesso ao serviço, associada ao seu código administrativo. A senha inicial corresponde aos 8 primeiros dígitos do CNPJ informado no contrato

sCdMaoPropria - String

Indica se a encomenda será entregue com o serviço adicional mão própria

S = sim
N = não PADRÃO
nVlValorDeclarado - Decimal

Indica se a encomenda será entregue com o serviço adicional valor declarado. Neste campo deve ser apresentado o valor declarado desejado, em Reais

sCdAvisoRecebimento - String

Indica se a encomenda será entregue com o serviço adicional de aviso de recebimento

S = sim
N = não PADRÃO

let Correios = require('node-correios');
let correios = new Correios();

correios.consultaCEP({ cep: '00000000' })
.then(result => {
console.log(result);
})
.catch(error => {
console.log(error);
});

\*

//--- chai

// install dependencies
// yarn add chai chai-http mocha


// adicionar no server.js

const expect      = require('chai').expect;

