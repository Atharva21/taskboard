const {
	body,
	check,
	param,
	Result,
	validationResult,
} = require("express-validator");

const log = require("../util/logger");

exports.validatePresentInBody = (...args) => {
	return async (req, res, next) => {
		try {
			const validations = args.map((arg) => {
				return body(arg)
					.notEmpty()
					.withMessage(`${arg} must be present`)
					.run(req);
			});
			await Promise.all(validations);
			const validationErrors = validationResult(req);
			if (validationErrors && !validationErrors.isEmpty()) {
				return res.status(400).json({
					success: false,
					errors: validationErrors["errors"],
				});
			}
		} catch (error) {
			return res.sendBadRequest();
		}
		return next();
	};
};

exports.validateCharacterLength = (parameter, { min, max }) => {
	return async (req, res, next) => {
		try {
			if (min !== null && min !== undefined) {
				await check(parameter)
					.isLength({ min })
					.withMessage(
						`${parameter} should be greater than ${min} characters`
					)
					.run(req);
			}
			if (max !== null && max !== undefined) {
				await check(parameter)
					.isLength({ max })
					.withMessage(
						`${parameter} should not be greater than ${max} characters`
					)
					.run(req);
			}
			const validationErrors = validationResult(req);
			if (validationErrors && !validationErrors.isEmpty()) {
				return res.status(400).json({
					success: false,
					errors: validationErrors["errors"],
				});
			}
		} catch (error) {
			return res.sendStatus(400);
		}
		return next();
	};
};
