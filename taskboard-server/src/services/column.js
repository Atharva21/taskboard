const ColumnModel = require("../models/column");
const APIError = require("../util/APIError");
const boardService = require("./board");
const taskService = require("./task");
const log = require("../util/logger");
const { Types } = require("mongoose");

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

exports.deleteColumn = async (boardId, columnId) => {
	try {
		await boardService.removeColumnIdFromBoard(boardId, columnId);
		const deletedColumn = await ColumnModel.findByIdAndDelete(columnId, {
			new: false,
		});
		if (!deletedColumn) {
			return Promise.reject(
				new APIError({
					statusCode: 404,
					description: `columnId ${columnId} not found`,
				})
			);
		}
		await taskService.deleteMultipleTasks(deletedColumn.taskIds);
		return deletedColumn;
	} catch (error) {
		return Promise.reject(error);
	}
};

exports.deleteMultipleColumns = async (columnIds) => {
	try {
		const deletedColumns = await Promise.all(
			columnIds.map((columnId) =>
				ColumnModel.findByIdAndDelete(columnId, { new: false })
			)
		);
		await Promise.all(
			deletedColumns.map((column) =>
				taskService.deleteMultipleTasks(column.taskIds)
			)
		);
		return deletedColumns;
	} catch (error) {
		return Promise.reject(error);
	}
};
