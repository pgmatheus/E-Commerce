const Cat = require("../models/Category");

const {
	verifyToken,
	verifyTokenAndAuthorization,
	verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();

// Upload slider

router.post("/", verifyTokenAndAdmin, async (req, res, next) => {
	try {
		const newCat = new Cat(req.body);
		const savedCat = await newCat.save();
		return res.status(200).json(savedCat);
	} catch (err) {
		next(err);
		/* return res.status(500).json(err); */
	}
});

// Req slider

router.get("/", async (req, res, next) => {
	try {
		let cats = await Cat.find();
		cats = cats.filter((e) => {
			return e.show === true;
		});
		let result = cats.slice();
		result.sort(function (a, b) {
			if (a.cat > b.cat) return 1;
			if (a.cat < b.cat) return -1;
			return 0;
		});
		/* .filter((e) => e.show === true) */
		/* .sort(({ title: a }, { title: b }) => a - b); */

		return res.status(200).json(result);
	} catch (err) {
		next(err);
		/* return res.status(500).json; */
	}
});

module.exports = router;
