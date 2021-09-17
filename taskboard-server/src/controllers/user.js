const _ = require("lodash");

const userService = require("../services/user");
const log = require("../util/logger");

exports.signUp = async (req, res) => {
	try {
		const savedUser = await userService.saveUser(req.body);
		return res.successData(_.omit(savedUser.toJSON(), ["password"])); // send response without password
	} catch (error) {
		return res.sendError(error);
	}
};

exports.login = async (req, res) => {
	try {
		await userService.comparePassword(req.body);
		req.session.loggedIn = true;
		return res.successMessage("logged in");
	} catch (error) {
		return res.sendError(error);
	}
};

exports.logout = (req, res) => {
	try {
		req.session.destroy((error) => {
			if (error) {
				return res.sendAPIStatus(500);
			}
			// TODO fetch cookie name from request?
			res.clearCookie("connect.sid"); //clear cookie
			return res.successMessage("logged out successfully");
		});
	} catch (error) {
		return res.sendError(error);
	}
};
