const express = require("express");
const app = express();
const helmet = require("helmet");
/* const path = require("path"); */
app.use(
	helmet.contentSecurityPolicy({
		directives: {
			"img-src": [
				"'self'",
				"https://firebasestorage.googleapis.com/v0/b/shop-81949.appspot.com/",
			],
			"script-src": ["'self'", "https://js.stripe.com/"],
			"connect-src": [
				"'self'",
				"https://viacep.com.br/ws/",
				"https://js.stripe.com/",
				"https://www.taliskafashion.com.br/",
			],
			fontSrc: ["'self'", "fonts.googleapis.com", "fonts.gstatic.com"],
			frameSrc: ["'self'", "https://js.stripe.com"],
		},
	})
);
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");
const stripeRoute = require("./routes/stripe");
const sliderRoute = require("./routes/slider");
const catRoute = require("./routes/category");
const postOfficeRoute = require("./routes/postOffice");
const recapchaRoute = require("./routes/recaptcha");
const verifyRecapchaRoute = require("./routes/verifyCaptcha");
const pagseguroRoute = require("./routes/pagseguro");
const verifyCart = require("./routes/verifyCart");
const verifyProductAndShipping = require("./routes/verifyProductAndShipping");
const handleError = require("./features/handleError");
const mongoSanitize = require("express-mongo-sanitize");
app.disable("x-powered-by");

/* const infoPayment = require("./routes/infoPayment"); */
const cors = require("cors");
var bodyParser = require("body-parser");

mongoose
	.connect(process.env.MONGO_URL)
	.then(() => console.log("DB Connection Successfull!"))
	.catch((err) => {
		console.log(err);
	});

app.use(cors());
app.use("/api/checkout", stripeRoute);
app.use(express.json());
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use(mongoSanitize());
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/carts", cartRoute);
app.use("/api/orders", orderRoute);
app.use("/api/slider", sliderRoute);
app.use("/api/category", catRoute);
app.use("/api/postoffice", postOfficeRoute);
app.use("/api/recapcha", recapchaRoute);
app.use("/api/verifyrecapcha", verifyRecapchaRoute);
app.use("/api/pagseguro", pagseguroRoute);
app.use("/api/verifycart", verifyCart);
app.use("/api/verifyproductandshipping", verifyProductAndShipping);
/* app.use(process.env.API_ADDRESS, infoPayment); */

if (process.env.ENVIRONMENT !== "DEV") {
	if (process.env.ENVIRONMENT === "ADM") {
		app.use(express.static("admin/build"));
		app.get("/*", (req, res, next) => {
			try {
				res.sendFile(__dirname + "/admin/build/index.html");
			} catch (err) {
				next(err);
			}
		});
	} else {
		app.use(express.static("client/build"));
		app.get("/*", (req, res, next) => {
			try {
				res.sendFile(__dirname + "/client/build/index.html");
			} catch (err) {
				next(err);
			}
		});
	}
}

/* app.use(express.static("public"));
		app.get("/*", (req, res) => {
			res.sendFile(__dirname + "/public/index.html");
		});  */

app.use(async function (err, req, res, next) {
	if (err) {
		await handleError({
			err: err,
			req: req,
			res: res,
			mode: process.env.MODE,
		});
	}
});

app.listen(5000 || process.env.PORT || 5000, () => {
	console.log("Backend server is running!");
});

/* module.exports = app; // for testing purposes */
