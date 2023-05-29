const router = require("express").Router();
const CryptoJS = require("crypto-js");
const Recaptcha = require("../models/Recaptcha");
const { count } = require("../models/RecaptchaToken");
const RecaptchaToken = require("../models/RecaptchaToken");
const catDog = require("../features/catdog");

/* const analizeDate = (entry, date) => {
	let arrLength = entry.length;
	if (arrLength < 3) {
	}
}; */

let minute = 60 * 1000;
let hour = 60 * minute;
let day = 24 * hour;

const diffTimeMinutes = (time1, time2) => {
	let diff = Math.round((time1.getTime() - time2.getTime()) / 60000);
	return diff;
};

const verifyBehavior = (attemps, date, timeArr) => {
	let diffTimeArr = [];
	let timeArrFiltered = [];
	let cond = true;
	let cont = 0;

	if (timeArr.length < 4) {
		return false;
	}

	if (diffTimeMinutes(timeArr[0], timeArr[1]) > 2430) {
		return false;
	}

	for (let i = 0; i < timeArr.length; i++) {
		if (cond) {
			if (timeArr[i].getTime() - date.getTime() < 77760 * minute) {
				timeArrFiltered.push(timeArr[i]);
			} else {
				cond = false;
			}
		}
	}

	for (let i = 0; i < timeArrFiltered.length - 1; i++) {
		if (
			timeArrFiltered[i].getTime() - timeArrFiltered[i + 1].getTime() <
			30 * minute
		) {
			cont++;
		}
	}

	if (cont > 5) {
		return true;
	} else {
		return false;
	}
};

router.post("/", async (req, res, next) => {
	try {
		let type = req.body.type;
		let date = new Date();
		let arrCaptcha = undefined;

		let address =
			req.headers["x-forwarded-for"] || req.socket.remoteAddress || null; // ip received

		let encriptedPassword = CryptoJS.AES.encrypt(
			address,
			process.env.CAPTCHA_KEY
		).toString(); // encrypted ipaddress

		const recapcha = await Recaptcha.findOneAndUpdate(
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
		);

		/* const recapcha = await Recaptcha.findOne({ address: address }); // Find ip in the database */
		if (!recapcha) {
			const newRecaptcha = new Recaptcha({
				address: address,
				typeReq: {
					register: [date],
					login: [date],
				},
			}); // if exists already

			const newRechaptchaToken = new RecaptchaToken({
				token: encriptedPassword,
			});

			const savedRecaptchaToken = await newRechaptchaToken.save();
			const savedRecaptcha = await newRecaptcha.save();

			return res.status(200).json({ token: encriptedPassword });
		} else {
			const needCapcha = verifyBehavior(
				recapcha.registerAttempts,
				date,
				recapcha.typeReq.register
			);

			if (!needCapcha) {
				const newRechaptchaToken2 = new RecaptchaToken({
					token: encriptedPassword,
				});

				const savedRecaptchaToken2 = await newRechaptchaToken2.save();
				return res.status(200).json({
					token: savedRecaptchaToken2.token,
				});
			} else {
				let numArrCaptcha = [
					Math.round(Math.random()),
					Math.round(Math.random()),
					Math.round(Math.random()),
					Math.round(Math.random()),
					Math.round(Math.random()),
					Math.round(Math.random()),
					Math.round(Math.random()),
					Math.round(Math.random()),
					Math.round(Math.random()),
				];

				arrCaptcha = [
					catDog(numArrCaptcha[0]),
					catDog(numArrCaptcha[1]),
					catDog(numArrCaptcha[2]),
					catDog(numArrCaptcha[3]),
					catDog(numArrCaptcha[4]),
					catDog(numArrCaptcha[5]),
					catDog(numArrCaptcha[6]),
					catDog(numArrCaptcha[7]),
					catDog(numArrCaptcha[8]),
				];

				const deleteRecaptcha = await RecaptchaToken.findOneAndDelete({
					address: address,
				});

				const newRechaptchaToken3 = new RecaptchaToken({
					token: encriptedPassword,
					arrCaptcha: numArrCaptcha,
					address: address,
				});

				const savedRecaptchaToken3 = await newRechaptchaToken3.save();
				return res.status(201).json({
					token: undefined,
					arrCaptcha: arrCaptcha,
				});
			}
		}
	} catch (err) {
		next(err);
		/* return res.status(400).json({
			success: false,
			message: "Error",
		}); */
	}
});

module.exports = router;
