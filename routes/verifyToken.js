const jwt = require("jsonwebtoken");
const User = require("../models/User");

const verifyToken = async (req, res, next) => {
	try {
		let userInfo;

		const authHeader = req?.headers?.token;

		if (authHeader) {
			const token = authHeader.split(" ")[1];

			jwt.verify(token, process.env.JWT_SEC, (err, user) => {
				if (err) return { success: false };
				req.user = user;
				userInfo = user;
			});

			if (!userInfo) {
				return { success: false };
			}

			const userDB = await User.findById(userInfo.id);

			if (!userDB) {
				return { success: false };
			}

			let passChange = userDB.passChange.getTime();

			if (passChange > userInfo.date) {
				return { success: false };
			}

			return { success: true, user: userInfo };
		} else {
			return { success: false };
		}
	} catch (err) {
		next(err);
	}
};

const verifyTokenAndAuthorization = async (req, res, next) => {
	try {
		let user = await verifyToken(req, res, next);

		if (user?.success) {
			if (user?.user?.isAdmin || user?.user?.id === req?.params?.id) {
				next();
			} else {
				return res.status(403).json("You are not alowed to do that!");
			}
		} else {
			return res.status(403).json("You are not alowed to do that!");
		}
	} catch (err) {
		next(err);
	}
};

/* const verifyTokenAndAuthorization = (req, res, next) => {
	
	verifyToken(req, res, () => {
		if (req?.user?.id === req?.params?.id || req?.user?.isAdmin) {
			next();
		} else {
			return res.status(403).json("You are not alowed to do that!");
		}
	});
}; */

const verifyTokenAndAdmin = async (req, res, next) => {
	try {
		let user = await verifyToken(req, res, next);

		if (user?.success) {
			if (user?.user?.isAdmin) {
				next();
			} else {
				return res.status(403).json("You are not alowed to do that!");
			}
		} else {
			return res.status(403).json("You are not alowed to do that!");
		}
	} catch (err) {
		next(err);
	}
};

/* const verifyTokenAndAdmin = (req, res, next) => {
	verifyToken(req, res, () => {
		if (req?.user?.isAdmin) {
			next();
		} else {
			return res.status(403).json("You are not alowed to do that!");
		}
	});
}; */

module.exports = {
	verifyToken,
	verifyTokenAndAuthorization,
	verifyTokenAndAdmin,
};
