const APIError = require("../util/APIError");

exports.isLoggedIn = (req, res, next) => {
	if (req.session.isLoggedIn) {
		return next();
	} else {
		return res.sendError(
			new APIError({
				statusCode: 403,
				description: "you need to be logged in to perform this action",
			})
		);
	}
};
