const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const returnOnlyNumber = require("../features/returnnumber");
const RecaptchaToken = require("../models/RecaptchaToken");
const nodemailerApp = require("../features/nodemailerApp");
const Recaptcha = require("../models/Recaptcha");
const tokenPassword = process.env.TOKEN_PASSWORD_KEY;
const {
	verifyToken,
	verifyTokenAndAuthorization,
	verifyTokenAndAdmin,
} = require("./verifyToken");
let validRegex =
	/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const { verifyInput } = require("../features/verifyInput");

const sendEmailActivation = async (obj) => {
	let { user, next } = obj;
	try {
		let now = new Date().getTime();
		let sendEmailAfter = user?.emailSent?.getTime() || 91666959924373;

		if (now > sendEmailAfter) {
			await nodemailerApp({
				from: "taliskafashion@taliskafashion.com.br",
				to: user.email,
				subject: "Taliska Fashion - Ativação de conta",
				token: user.tokenActivation,
				bcc: "taliskafashion@taliskafashion.com.br",
			});

			return { success: true };
		}

		return { success: false };
	} catch (err) {
		next(err);
	}
};

const verifyRegister = async (req) => {
	let verifyInputR = await verifyInput(req);
	if (!verifyInputR) {
		return false;
	}

	if (!req || !(req.username && req.username.length > 2)) {
		return false;
	} else if (
		!req.currentAddress ||
		!req.currentAddress.cep ||
		!req.currentAddress.cep.length > 0 ||
		!returnOnlyNumber(req.currentAddress.cep) ||
		!(returnOnlyNumber(req.currentAddress.cep).length == 8)
	) {
		return false;
	} else if (!req.number || !(req.number.length > 0)) {
		return false;
	} else if (!req.password || !(req.password.length > 5)) {
		return false;
	} else if (
		!req.email ||
		!(req.email.length > 5) ||
		!req.email.match(validRegex)
	) {
		return false;
	}
	return true;
};

//REGISTER
router.post("/register", async (req, res, next) => {
	/* let verifyR = verifyRegister(req.body);

	res.status(200).json({ register: verifyR }); */

	try {
		let verifyR = verifyRegister(req.body);
		let address =
			req.headers["x-forwarded-for"] || req.socket.remoteAddress || null; // ip received
		const date = new Date();
		let token = req.body.token;

		if (verifyR) {
			const verUser = await User.findOne({ email: req.body.email });
			if (verUser) {
				return res
					.status(200)
					.json({ register: false, message: "email já registrado" });
			} else {
				/* 	const recapcha = await RecaptchaToken.findOneAndDelete({
					token: token,
				}); */

				const recapcha = await RecaptchaToken.findOne({
					token: token,
				});

				const hashedToken = CryptoJS.AES.decrypt(
					token,
					process.env.CAPTCHA_KEY
				);

				const OriginalPassword = hashedToken.toString(CryptoJS.enc.Utf8);

				/* const updateRecaptcha = await Recaptcha.findOneAndUpdate(
					{ address: address },
					{
						$push: {
							"typeReq.register": {
								$each: [date],
								$position: 0,
							},
						},
						$inc: { registerAttempts: 1 },
					}
				); */

				if (recapcha && OriginalPassword === address) {
					let newToken = CryptoJS.AES.encrypt(
						req.body.email,
						tokenPassword
					).toString();

					newToken = newToken.replace(/[^a-z0-9]/gi, "");

					const newUser = new User({
						username: req.body.username,
						email: req.body.email,
						phone: req.body.phone || "",
						number: req.body.number,
						currentAddress: [req.body.currentAddress],
						tokenActivation: newToken,
						password: CryptoJS.AES.encrypt(
							req.body.password,
							process.env.PASS_SEC
						).toString(),
					});

					/* try { */
					const savedUser = await newUser.save();
					const recapcha2 = await RecaptchaToken.findOneAndDelete({
						token: token,
					});
					await sendEmailActivation({ user: savedUser, next: next });
					return res.status(201).json({ register: true });
					/* } catch (err) {
						res.status(500).json(err);
					} */
				} else {
					return res.status(201).json({
						register: false,
						message: "Token Inválido, atualize a página e tente novamente",
					});
				}
			}
		} else {
			return res
				.status(200)
				.json({ register: false, message: "Preenchimento inválido" });
		}
	} catch (err) {
		next(err);
		/* res.status(403).json({ register: false }); */
	}

	/*   const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    street: req.body.street,
    complement: req.body.complement,
    number: req.body.number,
    district: req.body.district,
    cep: req.body.cep,
    city: req.body.city,
    anotherAdress: [],
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString(),
  });

  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    // res.status(500).json(err);
  } */
});

//LOGIN

router.post("/login", async (req, res, next) => {
	try {
		/* const user = await User.findOne({ username: req.body.username }); */

		let token = req.body.token;

		const recapcha = await RecaptchaToken.findOne({
			token: token,
		});

		let address =
			req.headers["x-forwarded-for"] || req.socket.remoteAddress || null; // ip received
		const date = new Date();

		/* const updateRecaptcha = await Recaptcha.findOneAndUpdate(
			{ address: address },
			{
				$push: {
					"typeReq.register": {
						$each: [date],
						$position: 0,
					},
				},
				$inc: { registerAttempts: 1 },
			}
		); */

		if (!recapcha) {
			return res
				.status(401)
				.json({ message: "Erro de captcha, favor atualizar página" });
		}

		const user = await User.findOne({ email: req.body.username });

		if (!user) {
			return res
				.status(401)
				.json({ message: "Usuário não encontrado ou senha incorreta" });
		}

		if (user.loginAfter.getTime() > date.getTime()) {
			return res.status(401).json({
				message:
					"Aguardar " +
					Math.ceil((user.loginAfter.getTime() - date.getTime()) / 60 / 1000) +
					" minutos(s) para logar",
			});
		}

		const hashedPassword = CryptoJS.AES.decrypt(
			user.password,
			process.env.PASS_SEC
		);

		const OriginalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

		if (OriginalPassword !== req.body.password) {
			const userFailedLogin = await User.findOneAndUpdate(
				{ email: req.body.username },
				{
					loginAfter: new Date(
						new Date().getTime() + 60 * 1000 * (user.loginFailures - 2) ** 3
					),
					$inc: { loginFailures: 1 },
				}
			);
			return res
				.status(401)
				.json({ message: "Usuário não encontrado ou senha incorreta" });
		}

		/* if (user.situation !== "active") {
			let emailSent = await sendEmailActivation({ user: user, next: next });
			let now = new Date().getTime();

			if (emailSent?.success) {
				user.emailSent = new Date(now + 1000 * 60 * 5);
				await user.save();
			}

			return res.status(401).json({
				message: "Favor ativar a conta no link do email.",
			});
		} */

		/* 		if (user.loginFailures > 3) {
			const updateTimeLoginAfter = await User.findOneAndUpdate(
				{ email: req.body.username },
				{
					loginAfter: new Date(
						date.getTime() + 60 * 1000 * 60 * (user.loginFailures - 3) ** 3
					),
				}
			);
		} */

		const accessToken = jwt.sign(
			{
				id: user._id,
				isAdmin: user.isAdmin,
				date: new Date().getTime(),
			},
			process.env.JWT_SEC,
			{ expiresIn: "99999d" }
		);

		/* const {
			password,
			loginFailures,
			situation,
			isAdmin,
			loginAfter,
			createdAt,
			...others
		} = user._doc; */

		const { _id, username, email, phone, updatedAt, currentAddress } =
			user._doc;

		/* if (
			user &&
			OriginalPassword == req.body.password &&
			user.loginAfter.getTime() > date.getTime()
		) { */
		const recapcha2 = await RecaptchaToken.findOneAndDelete({
			token: token,
		});

		const userFailedLogin = await User.findOneAndUpdate(
			{ email: req.body.username },
			{ loginFailures: 0 }
		);
		// }

		/* return res.status(200).json({ ...others, accessToken }); */

		if (user.isAdmin) {
			return res.status(200).json({
				_id: _id,
				username: username,
				email: email,
				phone: phone,
				updatedAt: updatedAt,
				currentAddress: currentAddress,
				accessToken: accessToken,
				isAdmin: true,
			});
		}

		return res.status(200).json({
			_id: _id,
			username: username,
			email: email,
			phone: phone,
			updatedAt: updatedAt,
			currentAddress: currentAddress,
			accessToken: accessToken,
		});

		/* res.status(401).json("Captcha inválido"); */
	} catch (err) {
		next(err);
		/* console.log(err); */
	}
});

//ACTIVATE USER

router.post("/activateuser/", async (req, res, next) => {
	try {
		const { token } = req.body;
		const user = await User.findOne({ tokenActivation: token });

		if (!user) {
			return res.status(400).json({ success: false, message: "Token error" });
		}

		user.situation = "active";
		await user.save();

		return res.status(200).json({
			success: true,
			message: "Usuário ativado",
		});
	} catch (err) {
		next(err);
	}
});

router.get(
	"/checktoken/:id",
	verifyTokenAndAuthorization,
	async (req, res, next) => {
		try {
			return res.status(200).json({ success: true, message: "token valid" });
		} catch (err) {
			next(err);
		}
	}
);

module.exports = router;
