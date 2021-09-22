import React, { useRef, useState } from "react";

import styled from "styled-components";
import Task from "./Task";
import AddButton from "../ui/AddButton";

import { Droppable, Draggable } from "react-beautiful-dnd";

const Container = styled.div`
	background-color: ${(props) => (props.isDragging ? "#f2d338" : "inherit")};
	margin: 8px;
	border: 2px solid #f0c90a;
	border-radius: 1.3em;
	width: 220px;
	text-align: center;
	display: flex;
	flex-direction: column;
	overflow: hidden;
`;
const Title = styled.h3`
	border-radius: 0.7em;
	padding: 8px;
`;
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
}) => {
	const taskContentRef = useRef();
	const titleRef = useRef();

	const [isEditing, setEditing] = useState(false);

	const toggleEditable = () => {
		setEditing((prev) => !prev);
	};

	const clickHandler = () => {
		if (!isEditing) toggleEditable();
		setTimeout(() => {
			titleRef.current.focus();
		}, 0);
	};

	const onBlurHandler = () => {
		if (isEditing) toggleEditable();
		setTimeout(() => {
			titleRef.current.blur();
		}, 0);

		if (
			titleRef.current.innerHTML &&
			column.title !== titleRef.current.innerHTML &&
			titleRef.current.innerHTML.length > 0
		) {
			const newTitle = titleRef.current.innerHTML;
			titleRef.current.innerHTML = column.title;
			onColumnEdit(column._id, newTitle);
		}
	};

	const taskAddHandler = () => {
		const content = taskContentRef.current.value;
		taskContentRef.current.value = "";
		onTaskAdd(content, column._id);
	};

	return (
		<Draggable draggableId={column._id} index={index}>
			{(provided, snapshot) => (
				<Container
					{...provided.draggableProps}
					ref={provided.innerRef}
					isDragging={snapshot.isDragging}
				>
					<Title
						{...provided.dragHandleProps}
						ref={titleRef}
						onDoubleClick={clickHandler}
						onBlur={onBlurHandler}
						spellCheck="false"
						contentEditable={isEditing ? "true" : "false"}
						suppressContentEditableWarning={true}
						style={
							isEditing
								? {
										cursor: "text",
										backgroundColor: "lightyellow",
								  }
								: {
										cursor: "inherit",
								  }
						}
						ref={titleRef}
					>
						{column.title}
					</Title>
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
										></Task>
									);
								})}
								{provided.placeholder}
								{!maxTasks && (
									<div>
										<div>
											<input
												type="text"
												spellCheck="false"
												ref={taskContentRef}
											/>
										</div>
										<AddButton
											onClick={taskAddHandler}
										></AddButton>
									</div>
								)}
							</TaskList>
						)}
					</Droppable>
				</Container>
			)}
		</Draggable>
	);
};

export default Column;
