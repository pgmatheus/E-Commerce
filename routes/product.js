const Product = require("../models/Product");
const {
	verifyToken,
	verifyTokenAndAuthorization,
	verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();

//CREATE

router.post("/", verifyTokenAndAdmin, async (req, res, next) => {
	const newProduct = new Product(req.body);

	try {
		const savedProduct = await newProduct.save();
		res.status(200).json(savedProduct);
	} catch (err) {
		next(err);
		/* res.status(500).json(err); */
	}
});

//UPDATE
router.put("/:id", verifyTokenAndAdmin, async (req, res, next) => {
	try {
		const updatedProduct = await Product.findByIdAndUpdate(
			req.params.id,
			{
				$set: req.body,
			},
			{ new: true }
		);

		res.status(200).json(updatedProduct);
	} catch (err) {
		next(err);
		/* res.status(500).json(err); */
	}
});

//DELETE
router.delete("/:id", verifyTokenAndAdmin, async (req, res, next) => {
	try {
		await Product.findByIdAndDelete(req.params.id);
		res.status(200).json("Product has been deleted...");
	} catch (err) {
		/* res.status(500).json(err); */
		next(err);
	}
});

//GET PRODUCT
router.get("/find/:id", async (req, res, next) => {
	try {
		const product = await Product.findById(req.params.id);
		res.status(200).json(product);
	} catch (err) {
		/* res.status(500).json(err); */
		next(err);
	}
});

//GET ALL PRODUCTS
router.get("/", async (req, res, next) => {
	// const qNew = req.query.new;

	try {
		let qSearch = req.query.search;
		let qFilters = req.query.filters;
		let products;

		if (qSearch) {
			//Option if filter is used
			products = await Product.find({
				title: { $regex: qSearch, $options: "i" },
			}).sort({ updatedAt: -1 });

			// products = await Product.find().sort({ updatedAt: -1 });
		} else {
			products = await Product.find().sort({ updatedAt: -1 });
		}

		if (req?.body?.adminId) {
			const adminInfo = await User.findOne({ _id: req.body.adminId });
			if (!adminInfo || adminInfo.isAdmin === false) {
				return res.status(400).json("You are not allowed to that");
			}
		} else {
			products = products.filter((e) => e.inStock === true);
		}

		res.status(200).json(products);
	} catch (err) {
		next(err);
		/* res.status(500).json(err); */
	}
});

router.get("/allproducts", verifyTokenAndAdmin, async (req, res, next) => {
	try {
		const allProducts = await Product.find();

		if (!allProducts) {
			return res.status(400).json({ success: false, message: "Error DB" });
		} else {
			return res
				.status(200)
				.json({ success: true, message: "", value: allProducts });
		}
	} catch (err) {
		next(err);
	}
});

module.exports = router;
