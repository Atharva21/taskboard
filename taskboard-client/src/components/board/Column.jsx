import React from "react";
import TaskComponent from "../ui/TaskComponent";

import styled from "styled-components";
import Task from "./Task";
import ColumnComponent from "../ui/ColumnComponent";
import { Droppable, Draggable } from "react-beautiful-dnd";

const TaskList = styled.div`
	padding: 8px;
	transition: background-color 0.2s ease;
	background-color: ${(props) =>
		props.isDraggingOver ? "#f2d338" : "inherit"};
	flex-grow: 1;
	min-height: 100px;
`;

const Column = ({
	tasks,
	column,
	index,
	onTaskAdd,
	maxTasks,
	onColumnEdit,
	onTaskEdit,
	onTaskDelete,
}) => {
	const taskEditHandler = (newContent) => {
		onTaskAdd(newContent, column._id);
	};

	const titleEditHandler = (newContent) => {
		onColumnEdit(column._id, newContent);
	};

	return (
		<Draggable draggableId={column._id} index={index}>
			{(provided, snapshot) => (
				<ColumnComponent
					draggableProps={provided.draggableProps}
					dragHandleProps={provided.dragHandleProps}
					titleEditHandler={titleEditHandler}
					innerRef={provided.innerRef}
					title={column.title}
					isDragging={snapshot.isDragging}
				>
					<Droppable droppableId={column._id} type="task">
						{(provided, snapshot) => (
							<TaskList
								{...provided.droppableProps}
								ref={provided.innerRef}
								isDraggingOver={snapshot.isDraggingOver}
							>
								{tasks.map((task, idx) => {
									return (
										<Task
											task={task}
											key={task._id}
											index={idx}
											onTaskEdit={onTaskEdit}
											onDelete={(taskId) =>
												onTaskDelete(taskId, column._id)
											}
										></Task>
									);
								})}
								{provided.placeholder}
								{!maxTasks && (
									<TaskComponent
										content=""
										taskEditHandler={taskEditHandler}
									></TaskComponent>
								)}
							</TaskList>
						)}
					</Droppable>
				</ColumnComponent>
			)}
		</Draggable>
	);
};

export default Column;
