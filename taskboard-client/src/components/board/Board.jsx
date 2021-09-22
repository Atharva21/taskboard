import React, { useState, useEffect, useRef } from "react";
import Column from "./Column";

import styled from "styled-components";

import { DragDropContext, Droppable } from "react-beautiful-dnd";

import axios from "../../config/axios";

const Container = styled.div`
	margin-top: 4em;
	display: flex;
	align-items: flex-start;
	justify-content: center;
	user-select: none;
`;

const Board = ({ match }) => {
	const [state, setState] = useState();
	const newColumnRef = useRef();

	useEffect(() => {
		fetchBoard();
	}, []);

	const fetchBoard = async () => {
		try {
			const result = await axios.get(`/boards/${match.params.id}`);
			setState(result.data.data);
		} catch (error) {
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

	const onColumnAdd = async () => {
		try {
			const title = newColumnRef.current.value;
			newColumnRef.current.value = "";
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

	return (
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
									/>
								);
							})}
							{provided.placeholder}
							{state && state.board && !state.board.maxColumns && (
								<div>
									<div>
										<input
											type="text"
											spellCheck="false"
											ref={newColumnRef}
										/>
									</div>
									<button onClick={onColumnAdd}>
										Add column
									</button>
								</div>
							)}
						</Container>
					)}
				</Droppable>
			)}
		</DragDropContext>
	);
};

export default Board;
