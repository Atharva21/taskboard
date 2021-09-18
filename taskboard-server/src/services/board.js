const BoardModel = require("../models/board");
const APIError = require("../util/APIError");
const userService = require("./user");
const columnService = require("./column");
const taskService = require("./task");
const log = require("../util/logger");
const { Types } = require("mongoose");

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

exports.deleteBoardById = async (userId, boardId) => {
	try {
		await userService.removeBoardIdFromUser(userId, boardId);
		const deletedBoard = await BoardModel.findByIdAndDelete(boardId);
		if (!deletedBoard) {
			return Promise.reject(
				new APIError({
					statusCode: 404,
					description: `boardId ${boardId} not found`,
				})
			);
		}
		await columnService.deleteMultipleColumns(deletedBoard.columnIds);
		return deletedBoard;
	} catch (error) {
		return Promise.reject(error);
	}
};

exports.getFullBoard = async (boardId) => {
	try {
		const board = await BoardModel.findById(boardId);
		if (!board) {
			return Promise.reject(
				new APIError({
					statusCode: 404,
					description: `boardId ${boardId} not found`,
				})
			);
		}
		const columns = await columnService.getColumnsFromColumnIds(
			board.columnIds
		);
		const tasks = await Promise.all(
			columns.map((column) =>
				taskService.getTasksByTaskIds(column.taskIds)
			)
		);

		const columnObject = {};
		columns.forEach((column) => {
			columnObject[column._id] = column;
		});

		const taskObject = {};
		tasks.flat().forEach((task) => {
			taskObject[task._id] = task;
		});

		return {
			board,
			columns: columnObject,
			tasks: taskObject,
		};
	} catch (error) {
		return Promise.reject(error);
	}
};
