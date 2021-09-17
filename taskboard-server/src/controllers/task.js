const taskService = require("../services/task");
const log = require("../util/logger");

exports.saveTask = async (req, res) => {
	try {
		const savedTask = await taskService.saveTask(req.body);
		return res.successData(savedTask);
	} catch (error) {
		return res.sendError(error);
	}
};

exports.updateTask = async (req, res) => {
	try {
		const { taskId } = req.params;
		const { content } = req.body;
		const updatedTask = await taskService.updateContentById(
			taskId,
			content
		);
		return res.successData(updatedTask);
	} catch (error) {
		return res.sendError(error);
	}
};

exports.deleteTask = async (req, res) => {
	try {
		const { taskId } = req.params;
		const { columnId } = req.body;
		const deletedTask = await taskService.deleteTaskById(columnId, taskId);
		return res.successData(deletedTask);
	} catch (error) {
		return res.sendError(error);
	}
};
