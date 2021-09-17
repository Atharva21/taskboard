const TaskModel = require("../models/task");
const APIError = require("../util/APIError");
const columnService = require("./column");
const log = require("../util/logger");

exports.saveTask = async ({ columnId, content }) => {
	try {
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
