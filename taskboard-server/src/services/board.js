const BoardModel = require("../models/board");
const APIError = require("../util/APIError");
const userService = require("./user");
const log = require("../util/logger");

exports.saveBoard = async (userId, { title }) => {
	try {
		const savedBoard = await BoardModel.create({
			title,
		});
		// add this created board under corresponding user.
		await userService.addBoardIdToUser(userId, savedBoard._id);
		return savedBoard;
	} catch (error) {
		return Promise.reject(error);
	}
};

exports.updateTitleById = async (boardId, title) => {
	try {
		const updatedBoard = await BoardModel.findByIdAndUpdate(
			boardId,
			{
				title,
			},
			{
				new: true,
			}
		);
		if (!updatedBoard) {
			return Promise.reject(
				new APIError({
					statusCode: 404,
					description: `boardId ${boardId} not found`,
				})
			);
		}
		return updatedBoard;
	} catch (error) {
		return Promise.reject(error);
	}
};

exports.addColumnIdToBoard = async (boardId, columnId) => {
	try {
		const updatedBoard = await BoardModel.findByIdAndUpdate(
			boardId,
			{
				$push: {
					columnIds: columnId,
				},
			},
			{
				new: true,
			}
		);
		if (!updatedBoard) {
			return Promise.reject(
				new APIError({
					statusCode: 404,
					description: `boardId ${boardId} not found`,
				})
			);
		}
		return updatedBoard;
	} catch (error) {
		return Promise.reject(error);
	}
};

exports.removeColumnIdFromBoard = async (boardId, columnId) => {
	try {
		const updatedBoard = await BoardModel.findByIdAndUpdate(
			boardId,
			{
				$pull: {
					columnIds: new Types.ObjectId(columnId),
				},
			},
			{
				new: true,
			}
		);
		if (!updatedBoard) {
			return Promise.reject(
				new APIError({
					statusCode: 404,
					description: `boardId ${boardId} not found`,
				})
			);
		}
		return updatedBoard;
	} catch (error) {
		return Promise.reject(error);
	}
};
