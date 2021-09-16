const status = require("http-status");

const APIError = require("../util/APIError");
const log = require("../util/logger");

module.exports = apiresponse = (_, res, next) => {
	res.successMessage = (message) => {
		return res.status(200).json({
			success: true,
			message,
		});
	};

	res.successData = (data) => {
		return res.status(200).json({
			success: true,
			data,
		});
	};

	res.sendError = (error) => {
		log.error(error);
		if (error instanceof APIError) {
			return res.status(error.statusCode).json({
				success: false,
				message: error.description,
			});
		}
		return res.status(500).json({
			success: false,
			message: "Internal Server Error.",
		});
	};

	res.sendAPIStatus = (statusCode) => {
		const statusClass = status[`${statusCode}_CLASS`];
		const message = status[statusCode];
		return res.status(statusCode).json({
			success: statusClass === "2xx",
			message,
		});
	};

	res.sendBadRequest = (message) => {
		return res.status(400).json({
			success: false,
			message: message ?? "Bad Request",
		});
	};

	return next();
};
