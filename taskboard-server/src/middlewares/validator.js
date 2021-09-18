const { body, check, validationResult, param } = require("express-validator");
const APIError = require("../util/APIError");
const userService = require("../services/user");
const log = require("../util/logger");

exports.isLoggedIn = (req, res, next) => {
	if (req.session.userId) {
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
			return next();
		} catch (error) {
			return res.sendStatus(400);
		}
	};
};

exports.validateBoardIsOfUser = async (req, res, next) => {
	try {
		await userService.validateBoardIdPresent(
			req.session.userId,
			req.params.boardId
		);
		return next();
	} catch (error) {
		return res.sendError(error);
	}
};
