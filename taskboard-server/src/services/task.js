const TaskModel = require("../models/task");
const APIError = require("../util/APIError");
const columnService = require("./column");
const { TASK_LIMIT } = require("../util/environment");
const log = require("../util/logger");

exports.saveTask = async ({ columnId, content }) => {
	try {
		const taskIds = await columnService.getTaskIdsFromColumn(columnId);
		if (taskIds.length >= TASK_LIMIT) {
			return Promise.reject(
				new APIError({
					statusCode: 400,
					description: "task limit reached",
				})
			);
		}
		const savedTask = await TaskModel.create({
			content,
		});
		await columnService.addTaskIdToColumn(columnId, savedTask._id);
		return savedTask;
	} catch (error) {
		return Promise.reject(error);
	}
};

exports.updateContentById = async (taskId, content) => {
	try {
		const updatedTask = await TaskModel.findByIdAndUpdate(
			taskId,
			{
				content,
			},
			{
				new: true,
			}
		);
		if (!updatedTask) {
			return Promise.reject(
				new APIError({
					statusCode: 404,
					description: `taskId ${taskId} not found`,
				})
			);
		}
		return updatedTask;
	} catch (error) {
		return Promise.reject(error);
	}
};

exports.deleteTaskById = async (columnId, taskId) => {
	try {
		const deletedTask = await TaskModel.findByIdAndDelete(taskId, {
			new: false,
		});
		if (!deletedTask) {
			return Promise.reject(
				new APIError({
					statusCode: 404,
					description: `taskId ${taskId} not found`,
				})
			);
		}
		await columnService.removeTaskIdFrom(columnId, taskId);
		return deletedTask;
	} catch (error) {
		return Promise.reject(error);
	}
};

exports.deleteMultipleTasks = async (taskIds) => {
	try {
		const result = await TaskModel.deleteMany({
			_id: {
				$in: taskIds,
			},
		});
		if (!result) {
			return Promise.reject(
				new APIError({
					statusCode: 404,
					description: "taskIds not found",
				})
			);
		}
		return result;
	} catch (error) {
		return Promise.reject(error);
	}
};

exports.getTasksByTaskIds = async (taskIds) => {
	try {
		const tasks = await TaskModel.find({
			_id: {
				$in: taskIds,
			},
		});
		return tasks;
	} catch (error) {
		return Promise.reject(error);
	}
};
