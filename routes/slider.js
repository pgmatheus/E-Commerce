const Slider = require("../models/Slider");

const {
	verifyToken,
	verifyTokenAndAuthorization,
	verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();

// Upload slider m

router.post("/", verifyTokenAndAdmin, async (req, res, next) => {
	try {
		const newSlider = new Slider(req.body);
		const savedSlider = await newSlider.save();
		res.status(200).json(savedSlider);
	} catch (err) {
		next(err);
		/* res.status(500).json(err); */
	}
});

// Req slider

router.get("/", async (req, res, next) => {
	try {
		/* const slideSaved = req.query; */
		let sliders = await Slider.find().sort({ createdAt: -1 });
		res.status(200).json(sliders);
	} catch (err) {
		next(err);
		/* res.status(500).json; */
	}
});

module.exports = router;
