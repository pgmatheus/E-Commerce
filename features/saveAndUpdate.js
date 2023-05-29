const Product = require("../models/Product");

const saveAndUpdate = async (product, operation) => {
	for (let i = 0; i < product.length; i++) {
		let stock = true;
		let arrInfo = product[i].id.split("_");
		let prodId = arrInfo[0];
		let colorId;
		if (arrInfo[1][0] !== "#") {
			colorId = "#" + arrInfo[1];
		} else {
			colorId = arrInfo[1];
		}
		let numberId = arrInfo[2];
		let fProduct = await Product.findOne({ _id: prodId });
		let newStockArray = [];
		for (let j = 0; j < fProduct.infoStock.length; j++) {
			if (
				fProduct.infoStock[j].colorCode === colorId &&
				fProduct.infoStock[j].size === numberId
			) {
				if (operation === "minus") {
					// modificar depois
					newStockArray.push({
						...fProduct.infoStock[j],
						quantity:
							fProduct.infoStock[j].quantity - parseInt(product[i].quantity),
					});
				} else {
					newStockArray.push({
						...fProduct.infoStock[j],
						quantity:
							fProduct.infoStock[j].quantity + parseInt(product[i].quantity),
					});
				}
			} else {
				newStockArray.push(fProduct.infoStock[j]);
			}
		}

		let verifyStock = newStockArray.filter((e) => e.quantity !== 0);
		if (verifyStock.length === 0) {
			stock = false;
		}

		fProduct.infoStock = newStockArray;
		fProduct.inStock = stock;
		await fProduct.save();
	}
};

module.exports = saveAndUpdate;
