const bcrypt = require("bcryptjs");

const UserModel = require("../models/user");
const APIError = require("../util/APIError");
const log = require("../util/logger");

// signup
exports.saveUser = async ({ username, password, email }) => {
	try {
		const savedUser = await UserModel.create({
			username,
			password: await bcrypt.hash(password, 10),
			email,
		});
		return savedUser;
	} catch (error) {
		if (error.code && error.code === 11000) {
			return Promise.reject(
				new APIError({
					statusCode: 400,
					description: "duplicate username",
				})
			);
		}
		return Promise.reject(error);
	}
};

// login
exports.comparePassword = async ({ username, password }) => {
	try {
		const user = await getUserByUsername(username);
		const isValid = await bcrypt.compare(password, user?.password);
		return isValid
			? Promise.resolve(user._id)
			: Promise.reject(
					new APIError({
						statusCode: 401,
						description: "invalid credentials",
					})
			  );
	} catch (error) {
		return Promise.reject(error);
	}
};

exports.addBoardIdToUser = async (userId, boardId) => {
	try {
		const updatedUser = await UserModel.findByIdAndUpdate(
			userId,
			{
				$push: {
					boardIds: boardId,
				},
			},
			{
				new: true,
			}
		);
		if (!updatedUser) {
			return Promise.reject(
				new APIError({
					statusCode: 404,
					description: `userId ${userId} not found`,
				})
			);
		}
		return updatedUser;
	} catch (error) {
		return Promise.reject(error);
	}
};

exports.removeBoardIdFromUser = async (userId, boardId) => {
	try {
		const updatedUser = await UserModel.findByIdAndUpdate(
			userId,
			{
				$pull: {
					boardIds: new Types.ObjectId(boardId),
				},
			},
			{
				new: true,
			}
		);
		if (!updatedUser) {
			return Promise.reject(
				new APIError({
					statusCode: 404,
					description: `userId ${userId} not found`,
				})
			);
		}
		return updatedUser;
	} catch (error) {
		return Promise.reject(error);
	}
};

const getUserByUsername = async (username) => {
	try {
		const user = await UserModel.findOne({
			username,
		});
		if (!user) {
			return Promise.reject(
				new APIError({
					statusCode: 404,
					description: `username ${username} not found!`,
				})
			);
		}
		return user;
	} catch (error) {
		return Promise.reject(error);
	}
};
