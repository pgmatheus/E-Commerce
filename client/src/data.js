export const sliderItems = [
	{
		id: 0,
		img: "https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/Template%20-%20cropped%20feminino.jpg?alt=media&token=4dd517dd-4d50-49de-88e6-5ae8e30be6d7",
		title: "SUMMER SALE",
		desc: "DON'T COMPROMISE ON STYLE! GET FLAT 30% OFF FOR NEW ARRIVALS.",
		bg: "f5fafd",
	},
	{
		id: 1,
		img: "https://i.ibb.co/DG69bQ4/2.png",
		title: "AUTUMN COLLECTION",
		desc: "DON'T COMPROMISE ON STYLE! GET FLAT 30% OFF FOR NEW ARRIVALS.",
		bg: "fcf1ed",
	},
	{
		id: 2,
		img: "https://i.ibb.co/cXFnLLV/3.png",
		title: "LOUNGEWEAR LOVE",
		desc: "DON'T COMPROMISE ON STYLE! GET FLAT 30% OFF FOR NEW ARRIVALS.",
		bg: "fbf0f4",
	},
];

export const categories = [
	{
		id: 1,
		img: "https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/o/Template%20-%20cropped%20feminino.jpg?alt=media&token=4dd517dd-4d50-49de-88e6-5ae8e30be6d7",
		title: "CROPPED",
		cat: "women",
	},
	{
		id: 2,
		img: "https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
		title: "LOUNGEWEAR LOVE",
		cat: "coat",
	},
	{
		id: 3,
		img: "https://images.pexels.com/photos/5480696/pexels-photo-5480696.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
		title: "LIGHT JACKETS",
		cat: "jeans",
	},
];

export const popularProducts = [
	{
		id: 1,
		img: "https://d3o2e4jr3mxnm3.cloudfront.net/Mens-Jake-Guitar-Vintage-Crusher-Tee_68382_1_lg.png",
	},
	{
		id: 2,
		img: "https://cdn.shopify.com/s/files/1/0101/4832/products/Angela_Natural_Tee.png?v=1606780388",
	},
	{
		id: 3,
		img: "https://www.prada.com/content/dam/pradanux_products/U/UCS/UCS319/1YOTF010O/UCS319_1YOT_F010O_S_182_SLF.png",
	},
	{
		id: 4,
		img: "https://www.burdastyle.com/pub/media/catalog/product/cache/7bd3727382ce0a860b68816435d76e26/107/BUS-PAT-BURTE-1320516/1170x1470_BS_2016_05_132_front.png",
	},
	{
		id: 5,
		img: "https://images.ctfassets.net/5gvckmvm9289/3BlDoZxSSjqAvv1jBJP7TH/65f9a95484117730ace42abf64e89572/Noissue-x-Creatsy-Tote-Bag-Mockup-Bundle-_4_-2.png",
	},
	{
		id: 6,
		img: "https://d3o2e4jr3mxnm3.cloudfront.net/Rocket-Vintage-Chill-Cap_66374_1_lg.png",
	},
	{
		id: 7,
		img: "https://www.vintageindustries.nl/download_front/qympzk1762/2217_Arrow_Jacket_Forest.png",
	},
	{
		id: 8,
		img: "https://www.pngarts.com/files/3/Women-Jacket-PNG-High-Quality-Image.png",
	},
];

export const filterCategories = ["categories", "color", "size"]; // Adicionar para uma requisição

export const titleConvertValue = () => {
	// Need update when changing language --- server later

	let obj = {};

	obj.title = {
		categories: ["Categoria"],
		size: ["Tamanho"],
		color: ["Cor Principal"],
	};

	obj.size = {
		1: ["1"],
		2: ["2"],
		3: ["3"],
		4: ["4"],
		5: ["5"],
		6: ["6"],
		7: ["7"],
		8: ["8"],
		9: ["9"],
		10: ["10"],
		11: ["11"],
		12: ["12"],
		13: ["13"],
		14: ["14"],
		15: ["15"],
		16: ["16"],
		17: ["17"],
		18: ["18"],
		19: ["19"],
		20: ["20"],
		21: ["21"],
		22: ["22"],
		23: ["23"],
		24: ["24"],
		25: ["25"],
		26: ["26"],
		27: ["27"],
		28: ["28"],
		29: ["29"],
		30: ["30"],
		31: ["31"],
		32: ["32"],
		33: ["33"],
		34: ["34"],
		35: ["35"],
		36: ["36"],
		37: ["37"],
		38: ["38"],
		39: ["39"],
		40: ["40"],
		41: ["41"],
		42: ["42"],
		43: ["43"],
		44: ["44"],
		45: ["45"],
		46: ["46"],
		47: ["47"],
		48: ["48"],
		49: ["49"],
		50: ["50"],
		51: ["51"],
		52: ["52"],
		53: ["53"],
		54: ["54"],
		55: ["55"],
		56: ["56"],
		57: ["57"],
		58: ["58"],
		59: ["59"],
		60: ["60"],
		61: ["61"],
		62: ["62"],
		63: ["63"],
		64: ["64"],
		65: ["65"],
		66: ["66"],
		67: ["67"],
		68: ["68"],
		69: ["69"],
		70: ["70"],
		71: ["71"],
		72: ["72"],
		73: ["73"],
		74: ["74"],
		75: ["75"],
		76: ["76"],
		77: ["77"],
		78: ["78"],
		79: ["79"],
		80: ["80"],
		81: ["81"],
		82: ["82"],
		83: ["83"],
		84: ["84"],
		85: ["85"],
		86: ["86"],
		87: ["87"],
		88: ["88"],
		89: ["89"],
		90: ["90"],
		91: ["91"],
		92: ["92"],
		93: ["93"],
		94: ["94"],
		95: ["95"],
		96: ["96"],
		97: ["97"],
		98: ["98"],
		99: ["99"],
		100: ["100"],
		ÚNICO: ["ÚNICO"],
		P: ["P"],
		PP: ["PP"],
		M: ["M"],
		G: ["G"],
		GG: ["GG"],
		XG: ["XG"],
		XGG: ["XGG"],
		EG: ["EG"],
		EGG: ["EGG"],
	};

	obj.color = {
		maroon: ["marrom", "#800000"],
		darkred: ["vermelho escuro", "#8B0000"],
		brown: ["castanho", "#A52A2A"],
		firebrick: ["tijolo refratário", "#B22222"],
		crimson: ["carmesim", "#DC143C"],
		red: ["vermelho", "#FF0000"],
		tomato: ["tomate", "#FF6347"],
		coral: ["coral", "#FF7F50"],
		indianred: ["vermelho indiano", "#CD5C5C"],
		lightcoral: ["coral claro", "#F08080"],
		darksalmon: ["salmão escuro", "#E9967A"],
		salmon: ["salmão", "#FA8072"],
		lightsalmon: ["salmão claro", "#FFA07A"],
		orangered: ["vermelho alaranjado", "#FF4500"],
		darkorange: ["laranja escuro", "#FF8C00"],
		orange: ["laranja", "#FFA500"],
		gold: ["ouro", "#FFD700"],
		darkgoldenrod: ["haste dourada escura", "#B8860B"],
		goldenrod: ["vara de ouro", "#DAA520"],
		palegoldenrod: ["haste dourada pálida", "#EEE8AA"],
		darkkhaki: ["cáqui escuro", "#BDB76B"],
		khaki: ["cáqui", "#F0E68C"],
		olive: ["oliva", "#808000"],
		yellow: ["amarelo", "#FFFF00"],
		yellowgreen: ["amarelo verde", "#9ACD32"],
		darkolivegreen: ["verde oliva escuro", "#556B2F"],
		olivedrab: ["azeitona monótona", "#6B8E23"],
		lawngreen: ["gramado verde", "#7CFC00"],
		greenyellow: ["verde amarelo", "#ADFF2F"],
		darkgreen: ["verde escuro", "#006400"],
		green: ["verde", "#008000"],
		forestgreen: ["verde floresta", "#228B22"],
		lime: ["lima", "#00FF00"],
		limegreen: ["verde limão", "#32CD32"],
		lightgreen: ["luz verde", "#90EE90"],
		palegreen: ["verde pálido", "#98FB98"],
		darkseagreen: ["verde mar escuro", "#8FBC8F"],
		mediumspringgreen: ["verde primavera médio", "#00FA9A"],
		springgreen: ["primavera verde", "#00FF7F"],
		seagreen: ["verde mar", "#2E8B57"],
		mediumaquamarine: ["aqua marinho médio", "#66CDAA"],
		mediumseagreen: ["verde mar médio", "#3CB371"],
		lightseagreen: ["verde mar claro", "#20B2AA"],
		darkslategray: ["cinza ardósia escuro", "#2F4F4F"],
		teal: ["cerceta", "#008080"],
		darkcyan: ["ciano escuro", "#008B8B"],
		aqua: ["aqua", "#00FFFF"],
		cyan: ["ciano", "#00FFFF"],
		lightcyan: ["ciano claro", "#E0FFFF"],
		darkturquoise: ["turquesa escuro", "#00CED1"],
		turquoise: ["turquesa", "#40E0D0"],
		mediumturquoise: ["turquesa médio", "#48D1CC"],
		paleturquoise: ["turquesa pálida", "#AFEEEE"],
		aquamarine: ["verde água", "#7FFFD4"],
		powderblue: ["pó azul", "#B0E0E6"],
		babyblue: ["azul bebê", "#add8e6"],
		cadetblue: ["azul cadete", "#5F9EA0"],
		steelblue: ["aço azul", "#4682B4"],
		cornflowerblue: ["flor de milho azul", "#6495ED"],
		deepskyblue: ["céu azul profundo", "#00BFFF"],
		dodgerblue: ["trapaceiro azul", "#1E90FF"],
		lightblue: ["azul claro", "#ADD8E6"],
		skyblue: ["céu azul", "#87CEEB"],
		lightskyblue: ["céu azul claro", "#87CEFA"],
		midnightblue: ["azul da meia noite", "#191970"],
		navy: ["marinha", "#000080"],
		darkblue: ["azul escuro", "#00008B"],
		mediumblue: ["azul médio", "#0000CD"],
		blue: ["azul", "#0000FF"],
		royalblue: ["azul royal", "#4169E1"],
		blueviolet: ["violeta azul", "#8A2BE2"],
		indigo: ["índigo", "#4B0082"],
		darkslateblue: ["azul ardósia escuro", "#483D8B"],
		slateblue: ["azul ardósia", "#6A5ACD"],
		mediumslateblue: ["azul ardósia médio", "#7B68EE"],
		mediumpurple: ["roxo médio", "#9370DB"],
		darkmagenta: ["magenta escuro", "#8B008B"],
		darkviolet: ["violeta escuro", "#9400D3"],
		darkorchid: ["orquídea escura", "#9932CC"],
		mediumorchid: ["orquídea média", "#BA55D3"],
		purple: ["roxo", "#800080"],
		thistle: ["cardo", "#D8BFD8"],
		plum: ["ameixa", "#DDA0DD"],
		violet: ["tolet", "#EE82EE"],
		magenta: ["magenta", "#FF00FF"],
		orchid: ["orquídea", "#DA70D6"],
		mediumvioletred: ["vermelho violeta médio", "#C71585"],
		palevioletred: ["vermelho violeta pálido", "#DB7093"],
		deeppink: ["rosa pink", "#FF1493"],
		hotpink: ["rosa quente", "#FF69B4"],
		lightpink: ["luz rosa", "#FFB6C1"],
		pink: ["rosa", "#FFC0CB"],
		antiquewhite: ["branco antigo", "#FAEBD7"],
		beige: ["bege", "#F5F5DC"],
		bisque: ["bisque", "#FFE4C4"],
		blanchedalmond: ["amêndoa branqueada", "#FFEBCD"],
		wheat: ["trigo", "#F5DEB3"],
		cornsilk: ["seda de milho", "#FFF8DC"],
		lemonchiffon: ["chiffon de limão", "#FFFACD"],
		lightgoldenrodyellow: ["haste dourada clara amarela", "#FAFAD2"],
		lightyellow: ["luz amarela", "#FFFFE0"],
		saddlebrown: ["sela marrom", "#8B4513"],
		sienna: ["siena", "#A0522D"],
		chocolate: ["chocolate", "#D2691E"],
		peru: ["peru", "#CD853F"],
		sandybrown: ["marrom arenoso", "#F4A460"],
		burlywood: ["madeira robusta", "#DEB887"],
		tan: ["bronzeado", "#D2B48C"],
		rosybrown: ["marrom rosado", "#BC8F8F"],
		moccasin: ["mocassim", "#FFE4B5"],
		navajowhite: ["navajo branco", "#FFDEAD"],
		peachpuff: ["folhado de pêssego", "#FFDAB9"],
		mistyrose: ["rosa enevoada", "#FFE4E1"],
		lavenderblush: ["rubor de lavanda", "#FFF0F5"],
		linen: ["linho", "#FAF0E6"],
		oldlace: ["renda velha", "#FDF5E6"],
		papayawhip: ["chicote de papaia", "#FFEFD5"],
		seashell: ["concha do mar", "#FFF5EE"],
		mintcream: ["creme de menta", "#F5FFFA"],
		slategray: ["ardósia cinza", "#708090"],
		lightslategray: ["cinza ardósia claro", "#778899"],
		lightsteelblue: ["azul aço claro", "#B0C4DE"],
		lavender: ["lavanda", "#E6E6FA"],
		floralwhite: ["floral branco", "#FFFAF0"],
		aliceblue: ["alice azul", "#F0F8FF"],
		ghostwhite: ["fantasma branco", "#F8F8FF"],
		honeydew: ["melada", "#F0FFF0"],
		ivory: ["marfim", "#FFFFF0"],
		azure: ["azul celeste", "#F0FFFF"],
		snow: ["neve", "#FFFAFA"],
		black: ["preto", "#000000"],
		dimgray: ["cinza escuro", "#696969"],
		gray: ["cinza", "#808080"],
		darkgray: ["cinza escuro médio", "#A9A9A9"],
		silver: ["prata", "#C0C0C0"],
		lightgray: ["cinza claro", "#D3D3D3"],
		gainsboro: ["ganhosboro", "#DCDCDC"],
		whitesmoke: ["fumaça branca", "#F5F5F5"],
		white: ["branco", "#FFFFFF"],
		marsala: ["marsala", "#B57170"],
		lilac: ["lilás", "#c8a2c8"],
		lighpink: ["rosa bebê", "#FFB6C1"],
	};

	obj.categories = {
		vestido: ["Vestido"],
		cropped: ["Cropped"],
		saia: ["Saia"],
		blusa: ["Blusa"],
		conjunto: ["Conjunto"],
		jeans: ["Jeans"],
		macacão: ["Macacão"],
		short: ["Short"],
		calça: ["Calça"],
	};

	return obj;
};
