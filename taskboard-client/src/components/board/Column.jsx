import React, { useRef } from "react";

import styled from "styled-components";
import Task from "./Task";
import AddButton from "../ui/AddButton";

import { Droppable, Draggable } from "react-beautiful-dnd";

const Container = styled.div`
	background-color: white;
	margin: 8px;
	border: 2px solid #f0c90a;
	border-radius: 10px;
	width: 220px;
	text-align: center;
	display: flex;
	flex-direction: column;
`;
const Title = styled.h3`
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

const Column = ({ tasks, column, index, onTaskAdd, maxTasks }) => {
	const contentRef = useRef();

	const taskAddHandler = () => {
		const content = contentRef.current.value;
		contentRef.current.value = "";
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
					<Title {...provided.dragHandleProps}>{column.title}</Title>
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
												ref={contentRef}
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
