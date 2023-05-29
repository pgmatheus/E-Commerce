const Cart = require("../models/Cart");
const {
	verifyToken,
	verifyTokenAndAuthorization,
	verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();

//CREATE

/* router.post("/", verifyToken, async (req, res, next) => {
	try {
		
		const newCart = new Cart(req.body);
		const savedCart = await newCart.save();
		res.status(200).json(savedCart);
	} catch (err) {
		next(err);
	}
}); */

//UPDATE
/* router.put("/:id", verifyTokenAndAuthorization, async (req, res, next) => {
	try {
		const updatedCart = await Cart.findByIdAndUpdate(
			req.params.id,
			{
				$set: req.body,
			},
			{ new: true }
		);
		res.status(200).json(updatedCart);
	} catch (err) {
		next(err);
	}
}); */

//DELETE
/* router.delete("/:id", verifyTokenAndAuthorization, async (req, res, next) => {
	try {
		await Cart.findByIdAndDelete(req.params.id);
		res.status(200).json("Cart has been deleted...");
	} catch (err) {
		next(err);
	}
}); */

//GET USER CART
/* router.get(
	"/find/:userId",
	verifyTokenAndAuthorization,
	async (req, res, next) => {
		try {
			const cart = await Cart.findOne({ userId: req.params.userId });
			res.status(200).json(cart);
		} catch (err) {
			next(err);
		}
	}
); */

// //GET ALL

/* router.get("/", verifyTokenAndAdmin, async (req, res, next) => {
	try {
		const carts = await Cart.find();
		res.status(200).json(carts);
	} catch (err) {
		next(err);
	}
}); */

module.exports = router;
