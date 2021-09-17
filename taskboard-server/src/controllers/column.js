const columnService = require("../services/column");
const log = require("../util/logger");

exports.saveColumn = async (req, res) => {
	try {
		const savedColumn = await columnService.saveColumn(req.body);
		return res.successData(savedColumn);
	} catch (error) {
		return res.sendError(error);
	}
};

exports.updateColumn = async (req, res) => {
	try {
		const { columnId } = req.params;
		const { title } = req.body;
		const updatedColumn = await columnService.updateTitleById(
			columnId,
			title
		);
		return res.successData(updatedColumn);
	} catch (error) {
		return res.sendError(error);
	}
};
