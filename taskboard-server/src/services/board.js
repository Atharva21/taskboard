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

exports.deleteMultipleBoards = async (boardIds) => {
	try {
		const deletedBoards = await Promise.all(
			boardIds.map((boardId) =>
				BoardModel.findByIdAndDelete(boardId, { new: false })
			)
		);
		await Promise.all(
			deletedBoards.map((board) =>
				columnService.deleteMultipleColumns(board.columnIds)
			)
		);
		return deletedBoards;
	} catch (error) {
		return Promise.reject(error);
	}
};

exports.getAllBoardsOfUser = async (userId) => {
	try {
		const boardIds = await userService.getBoardIdsByUserId(userId);
		const boards = await BoardModel.find({
			_id: {
				$in: boardIds,
			},
		});
		log.info(boardIds);
		log.info(boards);
		return boards;
	} catch (error) {
		return Promise.reject(error);
	}
};

const updateColumnIds = async (boardId, columnIds) => {
	try {
		const updatedBoard = await BoardModel.findByIdAndUpdate(
			boardId,
			{
				columnIds,
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

exports.updateState = async (boardId, { board, columns }) => {
	try {
		const oldState = await this.getFullBoard(boardId);
		const oldColumnIds = oldState.board.columnIds;
		const oldTaskIds = [];
		Object.keys(oldState.tasks).forEach((taskId) => {
			oldTaskIds.push(taskId);
		});

		if (board && board.columnIds) {
			// validate columnIds are same.
			if (
				JSON.stringify([...oldColumnIds].sort()) !==
				JSON.stringify([...board.columnIds].sort())
			) {
				throw new APIError({
					statusCode: 400,
				});
			}
			await updateColumnIds(boardId, board.columnIds);
		}
		if (columns) {
			// validate taskIds present for each column
			let newTaskIds = [];
			Object.entries(columns).forEach(([_, column]) => {
				if (!column.taskIds) {
					throw new APIError({
						statusCode: 400,
					});
				}
				newTaskIds = newTaskIds.concat(column.taskIds);
			});
			// validate taskIds are same.
			if (
				JSON.stringify(oldTaskIds.sort()) !==
				JSON.stringify(newTaskIds.sort())
			) {
				throw new APIError({
					statusCode: 400,
				});
			}

			await Promise.all(
				Object.entries(columns).map(([_, column]) =>
					columnService.updateTaskIds(column._id, column.taskIds)
				)
			);
		}
		return await this.getFullBoard(boardId);
	} catch (error) {
		// even if update fails, client should get the actual state.
		return Promise.reject(
			new APIError({
				statusCode: 400,
				data: await this.getFullBoard(boardId),
			})
		);
	}
};
