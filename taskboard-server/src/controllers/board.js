const boardService = require("../services/board");
const log = require("../util/logger");

exports.saveBoard = async (req, res) => {
	try {
		const savedBoard = await boardService.saveBoard(
			req.session.userId,
			req.body
		);
		return res.successData(savedBoard);
	} catch (error) {
		return res.sendError(error);
	}
};

exports.updateBoard = async (req, res) => {
	try {
		const { boardId } = req.params;
		const { title } = req.body;
		const updatedBoard = await boardService.updateTitleById(boardId, title);
		return res.successData(updatedBoard);
	} catch (error) {
		return res.sendError(error);
	}
};
