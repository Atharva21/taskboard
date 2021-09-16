import status from "http-status";

class BaseError extends Error {
	statusCode;
	description;
	isOperational;

	constructor(args) {
		const { statusCode, description, isOperational } = args;
		super(description);
		this.statusCode = statusCode;
		this.description = description ?? status[statusCode];
		this.isOperational =
			isOperational ?? status[`${statusCode}_CLASS`] !== "5xx";
	}
}

module.exports = BaseError;
