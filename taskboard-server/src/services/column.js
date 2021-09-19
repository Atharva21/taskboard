const ColumnModel = require("../models/column");
const APIError = require("../util/APIError");
const boardService = require("./board");
const taskService = require("./task");
const log = require("../util/logger");
const { Types } = require("mongoose");
const { COLUMN_LIMIT } = require("../util/environment");

exports.saveColumn = async ({ boardId, title }) => {
	try {
		const columnIds = await boardService.getColumnIdsFromBoard(boardId);
		if (columnIds.length >= COLUMN_LIMIT) {
			return Promise.reject(
				new APIError({
					statusCode: 400,
					description: "column limit reached",
				})
			);
		}
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

exports.getTaskIdsFromColumn = async (columnId) => {
	try {
		const column = await ColumnModel.findById(columnId);
		if (!column) {
			return Promise.reject(
				new APIError({
					statusCode: 404,
					description: `columnId ${columnId} not found`,
				})
			);
		}
		return column.taskIds;
	} catch (error) {
		return Promise.reject(error);
	}
};

exports.getColumnsFromColumnIds = async (columnIds) => {
	try {
		const columns = await ColumnModel.find({
			_id: {
				$in: columnIds,
			},
		});
		return columns;
	} catch (error) {
		return Promise.reject(error);
	}
};

exports.updateTaskIds = async (columnId, taskIds) => {
	try {
		const updatedColumn = await ColumnModel.findByIdAndUpdate(
			columnId,
			{
				taskIds,
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
