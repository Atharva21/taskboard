import React, { useState, useEffect } from "react";
import Column from "./Column";

import styled from "styled-components";

import { DragDropContext, Droppable } from "react-beautiful-dnd";

import axios from "../../config/axios";
import ColumnComponent from "../ui/ColumnComponent";

const Container = styled.div`
	margin-top: 4em;
	display: flex;
	align-items: flex-start;
	justify-content: center;
	user-select: none;
`;

const TitleContainer = styled.div`
	display: grid;
	place-items: center;
	background-color: #f2d338;
`;

const Board = ({ match }) => {
	const [state, setState] = useState();

	useEffect(() => {
		fetchBoard();
	}, []);

	const fetchBoard = async () => {
		try {
			const result = await axios.get(`/boards/${match.params.id}`);
			setState(result.data.data);
		} catch (error) {
			console.error(error);
			console.error(error.response.data);
		}
	};

	const updateBoardState = async (newState) => {
		try {
			const result = await axios.post(
				`/boards/${match.params.id}`,
				newState
			);
			setState(result.data.data);
		} catch (error) {
			// TODO show response.message as error
			console.error(error.response.data);
			setState(error.response.data.data);
		}
	};

	const onTaskEdit = async (taskId, content) => {
		try {
			await axios.patch(`/tasks/${taskId}`, {
				content,
			});
			setState((prev) => {
				return {
					...prev,
					tasks: {
						...prev.tasks,
						[taskId]: {
							...prev.tasks[taskId],
							content,
						},
					},
				};
			});
		} catch (error) {
			// TODO
			console.log(error.response.data);
			setState({ ...state });
		}
	};

	const onColumnEdit = async (columnId, title) => {
		try {
			await axios.patch(`/columns/${columnId}`, {
				title,
			});
			setState((prev) => {
				return {
					...prev,
					columns: {
						...prev.columns,
						[columnId]: {
							...prev.columns[columnId],
							title,
						},
					},
				};
			});
		} catch (error) {
			// TODO
			console.log(error.response.data);
			setState({ ...state });
		}
	};

	const onDragEnd = (result) => {
		const { source, destination, draggableId, type } = result;
		if (!destination) return;
		if (
			destination.droppableId === source.droppableId &&
			destination.index === source.index
		) {
			return;
		}

		if (type === "column") {
			const newColumnIds = Array.from(state.board.columnIds);
			newColumnIds.splice(source.index, 1);
			newColumnIds.splice(destination.index, 0, draggableId);
			const newState = {
				...state,
				board: {
					...state.board,
					columnIds: newColumnIds,
				},
			};
			setState(newState);
			updateBoardState(newState);
			return;
		}

		const sourceColumn = state.columns[source.droppableId];

		const destinationColumn = state.columns[destination.droppableId];
		if (sourceColumn === destinationColumn) {
			const newTaskIds = Array.from(sourceColumn.taskIds);
			newTaskIds.splice(source.index, 1);

			newTaskIds.splice(destination.index, 0, draggableId);

			const newColumn = {
				...sourceColumn,
				taskIds: newTaskIds,
			};

			const newState = {
				...state,
				columns: {
					...state.columns,
					[newColumn._id]: newColumn,
				},
			};

			setState(newState);
			updateBoardState(newState);
			return;
		}

		const newSourceTaskIds = Array.from(sourceColumn.taskIds);
		const newDestinationTaskIds = Array.from(destinationColumn.taskIds);

		newSourceTaskIds.splice(source.index, 1);
		newDestinationTaskIds.splice(destination.index, 0, draggableId);

		const newSourceColumn = {
			...sourceColumn,
			taskIds: newSourceTaskIds,
		};

		const newDestinationColumn = {
			...destinationColumn,
			taskIds: newDestinationTaskIds,
		};

		const newState = {
			...state,
			columns: {
				...state.columns,
				[newSourceColumn._id]: newSourceColumn,
				[newDestinationColumn._id]: newDestinationColumn,
			},
		};
		setState(newState);
		updateBoardState(newState);
	};

	const onColumnAdd = async (title) => {
		try {
			await axios.post("/columns", {
				boardId: match.params.id,
				title,
			});
			fetchBoard();
		} catch (error) {
			console.error(error.response.data);
		}
	};

	const onTaskAdd = async (content, columnId) => {
		try {
			await axios.post("/tasks", {
				content,
				columnId,
			});
			fetchBoard();
		} catch (error) {
			console.error(error.response.data);
		}
	};

	// console.log(JSON.stringify(state, null, 3));

	const onTaskDelete = async (taskId, columnId) => {
		try {
			const result = await axios.delete(`/tasks/${taskId}`, {
				data: { columnId },
			});
			if (result.status === 200) {
				const newState = { ...state };
				const newColumn = newState.columns[columnId];
				newColumn.taskIds = newColumn.taskIds.filter(
					(tskId) => tskId !== taskId
				);
				const newTasks = {};
				Object.entries(newState.tasks).forEach(([key, value]) => {
					if (key !== taskId) {
						newTasks[key] = value;
					}
				});
				newState.tasks = newTasks;
				newState.columns = {
					...state.columns,
					[newColumn._id]: newColumn,
				};
				setState(newState);
			}
		} catch (error) {
			console.error(error.response.data);
		}
	};

	const onColumnDelete = async (columnId) => {
		try {
			const result = await axios.delete(`/columns/${columnId}`, {
				data: { boardId: match.params.id },
			});
			if (result.status === 200) {
				const newState = { ...state };
				const newBoard = newState.board;
				newBoard.columnIds = newBoard.columnIds.filter(
					(colId) => colId !== columnId
				);
				const newColumns = {};
				Object.entries(newState.columns).forEach(([key, value]) => {
					if (key !== columnId) {
						newColumns[key] = value;
					}
				});
				newState.columns = newColumns;
				newState.board["maxColumns"] = false;
				setState(newState);
			}
		} catch (error) {
			console.error(error.response.data);
		}
	};

	return (
		<div>
			<TitleContainer>
				<h1>{state?.board?.title}</h1>
			</TitleContainer>
			<DragDropContext onDragEnd={onDragEnd}>
				{state && state.board && (
					<Droppable
						droppableId={state.board._id}
						direction="horizontal"
						type="column"
					>
						{(provided, snapshot) => (
							<Container
								{...provided.droppableProps}
								ref={provided.innerRef}
								// isDraggingOver={snapshot.isDraggingOver}
							>
								{state.board.columnIds.map((colId, index) => {
									const column = state.columns[colId];
									if (column && column._id) {
										const tasks = column.taskIds.map(
											(taskId) => state.tasks[taskId]
										);

										return (
											<Column
												key={column._id}
												tasks={tasks}
												column={column}
												index={index}
												maxTasks={column.maxTasks}
												onTaskAdd={onTaskAdd}
												onColumnEdit={onColumnEdit}
												onTaskEdit={onTaskEdit}
												onTaskDelete={onTaskDelete}
												deleteHandler={onColumnDelete}
											/>
										);
									}
								})}
								{provided.placeholder}
								{state &&
									state.board &&
									!state.board.maxColumns && (
										<ColumnComponent
											title=""
											titleEditHandler={onColumnAdd}
											isNew
										></ColumnComponent>
									)}
							</Container>
						)}
					</Droppable>
				)}
			</DragDropContext>
		</div>
	);
};

export default Board;
