const router = require("express").Router();
const parseString = require("xml2js").parseString;

const result = (xml) => {
	return (result1 = new Promise((resolve, reject) =>
		parseString(xml, (err, result) => {
			if (err) reject(err);
			else resolve(result);
		})
	));
};

module.exports = result;
