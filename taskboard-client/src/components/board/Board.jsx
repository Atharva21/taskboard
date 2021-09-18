import React, { useState } from "react";
import Column from "./Column";

import styled from "styled-components";

import { DragDropContext, Droppable } from "react-beautiful-dnd";

import initialData from "./Data";

const Container = styled.div`
	margin-top: 4em;
	display: flex;
	align-items: flex-start;
	justify-content: center;
	user-select: none;
`;

const Board = () => {
	const [state, setState] = useState(initialData);

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
			const newColumnOrder = Array.from(state.columnOrder);
			newColumnOrder.splice(source.index, 1);
			newColumnOrder.splice(destination.index, 0, draggableId);
			setState({
				...state,
				columnOrder: newColumnOrder,
			});
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
					[newColumn.id]: newColumn,
				},
			};

			setState(newState);
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
				[newSourceColumn.id]: newSourceColumn,
				[newDestinationColumn.id]: newDestinationColumn,
			},
		};
		setState(newState);
	};

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<Droppable
				droppableId={state.boardId}
				direction="horizontal"
				type="column"
			>
				{(provided, snapshot) => (
					<Container
						{...provided.droppableProps}
						ref={provided.innerRef}
						// isDraggingOver={snapshot.isDraggingOver}
					>
						{state.columnOrder.map((colId, index) => {
							const column = state.columns[colId];
							const tasks = column.taskIds.map(
								(taskId) => state.tasks[taskId]
							);

							return (
								<Column
									key={column.id}
									tasks={tasks}
									column={column}
									index={index}
								/>
							);
						})}
						{provided.placeholder}
					</Container>
				)}
			</Droppable>
		</DragDropContext>
	);
};

export default Board;
