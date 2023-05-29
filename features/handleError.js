const nodemailerApp = require("./nodemailerApp");

const handleError = async (obj) => {
	try {
		if (obj && obj.err && obj.mode === "SEND") {
			let err = obj.err;

			let message = err.message || "";
			let name = err.name || "";
			let cause = err.cause || "";
			let stack = err.stack || "";
			let user = obj?.req?.user;
			user = JSON.stringify(user) || "";
			let body = obj?.req?.body;
			body = JSON.stringify(body) || "";
			let params = obj?.req?.params;
			params = JSON.stringify(params) || "";
			let query = obj?.req?.query;
			query = JSON.stringify(query) || "";
			let originalUrl = obj?.req?.originalUrl || "";
			let route = obj?.req?.route;
			route = JSON.stringify(route) || "";
			let rawHeaders = obj?.req?.rawHeaders?.toString() || "";

			let objErrorMsg = {
				message: message,
				name: name,
				cause: cause,
				stack: stack,
				user: user,
				body: body,
				params: params,
				query: query,
				originalUrl: originalUrl,
				route: route,
				rawHeaders: rawHeaders,
			};

			await nodemailerApp({
				from: "logs@taliskafashion.com.br",
				to: "logs@taliskafashion.com.br",
				subject: "Error log",
				content: JSON.stringify(objErrorMsg, null, 2),
				bcc: "pgmatheus@hotmail.com",
			});

			return obj.res
				.status(400)
				.json({ success: false, message: "Error", error: true });

			/* console.dir(err, { depth: null });
			console.log("q");
			console.log(err?.message);
			console.log(err?.path);

			console.log(req?.body);
			console.log(req?.params); */
		}
	} catch (e) {
		return obj.res
			.status(400)
			.json({ success: false, message: "Error", error: true });
	}
	/* console.log({
		code: err.code || undefined, // ok
		status: err.response?.status || undefined, // ok
		method: err.response?.config.method || undefined, // n
		url: err.response?.config?.url || undefined, // ok
		data: err.response?.config?.data || undefined, // n
		statusText: err.response?.statusText || undefined, // ok
	}); */
};

module.exports = handleError;
