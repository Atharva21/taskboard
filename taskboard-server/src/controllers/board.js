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

exports.deleteBoard = async (req, res) => {
	try {
		const { boardId } = req.params;
		const deletedBoard = await boardService.deleteBoardById(
			req.session.userId,
			boardId
		);
		res.successData(deletedBoard);
	} catch (error) {
		return res.sendError(error);
	}
};

exports.getBoard = async (req, res) => {
	try {
		const { boardId } = req.params;
		const board = await boardService.getFullBoard(boardId);
		return res.successData(board);
	} catch (error) {
		return res.sendError(error);
	}
};

exports.updateState = async (req, res) => {
	try {
		const { boardId } = req.params;
		const updatedBoard = await boardService.updateState(boardId, req.body);
		res.successData(updatedBoard);
	} catch (error) {
		return res.sendError(error);
	}
};
