const ColumnModel = require("../models/column");
const APIError = require("../util/APIError");
const boardService = require("./board");
const log = require("../util/logger");

exports.saveColumn = async ({ boardId, title }) => {
	try {
		const savedColumn = await ColumnModel.create({
			title,
		});
		await boardService.addColumnIdToBoard(boardId, savedColumn._id);
		return savedColumn;
	} catch (error) {
		return Promise.reject(error);
	}
};

exports.updateTitleById = async (columnId, title) => {
	try {
		const updatedColumn = await ColumnModel.findByIdAndUpdate(
			columnId,
			{
				title,
			},
			{
				new: true,
			}
		);
		if (!updatedColumn) {
			return Promise.reject(
				new APIError({
					statusCode: 404,
					description: `columnId ${columnId} not found`,
				})
			);
		}
		return updatedColumn;
	} catch (error) {
		return Promise.reject(error);
	}
};

exports.addTaskIdToColumn = async (columnId, taskId) => {
	try {
		const updatedColumn = await ColumnModel.findByIdAndUpdate(
			columnId,
			{
				$push: {
					taskIds: taskId,
				},
			},
			{
				new: true,
			}
		);
		if (!updatedColumn) {
			return Promise.reject(
				new APIError({
					statusCode: 404,
					description: `columnId ${columnId} not found`,
				})
			);
		}
		return updatedColumn;
	} catch (error) {
		return Promise.reject(error);
	}
};

exports.removeTaskIdFrom = async (columnId, taskId) => {
	try {
		const updatedColumn = await ColumnModel.findByIdAndUpdate(
			columnId,
			{
				$pull: {
					taskIds: new Types.ObjectId(taskId),
				},
			},
			{
				new: true,
			}
		);
		if (!updatedColumn) {
			return Promise.reject(
				new APIError({
					statusCode: 404,
					description: `columnId ${columnId} not found`,
				})
			);
		}
		return updatedColumn;
	} catch (error) {
		return Promise.reject(error);
	}
};
