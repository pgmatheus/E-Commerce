const router = require("express").Router();

const diffDays = (date1, date2) => {
	if (!date1 || !date2) {
		return { status: false, error: "Invalid date format" };
	}
	const diffTime = Math.abs(date2 - date1);

	if (!diffTime) {
		return { status: false, error: "Invalid date format" };
	}

	return { status: true, result: Math.ceil(diffTime / (1000 * 60 * 60 * 24)) };
};

module.exports = { diffDays };
