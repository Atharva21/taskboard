const status = require("http-status");

class APIError extends Error {
	statusCode;
	description;
	isOperational;
	data;

	constructor(args) {
		const { statusCode, description, data, isOperational } = args;
		super(description);
		this.statusCode = statusCode;
		this.description = description ?? status[statusCode];
		this.data = data;
		this.isOperational =
			isOperational ?? status[`${statusCode}_CLASS`] !== "5xx";
	}
}

module.exports = APIError;
