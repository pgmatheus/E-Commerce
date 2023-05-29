const router = require("express").Router();

const returnOnlyNumber = (arr) => {
	let onlyNumber = "";
	let onlyNumberArr;

	if (arr && arr.length > 0 && arr.match(/[0-9]+/g)) {
		onlyNumberArr = arr.match(/[0-9]+/g);

		for (let i = 0; i < onlyNumberArr.length; i++) {
			onlyNumber = onlyNumber.concat(onlyNumberArr[i]);
		}
		return onlyNumber;
	} else {
		return undefined;
	}
};

module.exports = returnOnlyNumber;
