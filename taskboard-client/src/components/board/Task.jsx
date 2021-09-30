import React from "react";
import TaskComponent from "../ui/TaskComponent";
import { Draggable } from "react-beautiful-dnd";

const Task = ({ task, index, onTaskEdit }) => {
	const onEdit = (newContent) => onTaskEdit(task._id, newContent);

	return (
		<Draggable draggableId={task._id} index={index}>
			{(provided, snapshot) => {
				return (
					<TaskComponent
						innerRef={provided.innerRef}
						content={task.content}
						taskEditHandler={onEdit}
						{...provided.draggableProps}
						{...provided.dragHandleProps}
						isDragging={snapshot.isDragging}
					></TaskComponent>
				);
			}}
		</Draggable>
	);
};

export default Task;
