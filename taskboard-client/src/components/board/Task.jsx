import React from "react";

import styled from "styled-components";
import { Draggable } from "react-beautiful-dnd";

const Container = styled.div`
	border: 1px solid black;
	border-radius: 5px;
	display: flex;
	justify-content: center;
	padding: 0.5em;
	margin-bottom: 8px;
	background-color: ${(props) => (props.isDragging ? "#f2b138" : "white")};
	word-break: break-word;

	&:hover {
		background-color: lightyellow;
	}
`;

const Content = styled.div`
	min-height: 20px;
	flex-grow: 1;
`;

const Task = ({ task, index }) => {
	return (
		<Draggable draggableId={task._id} index={index}>
			{(provided, snapshot) => {
				return (
					<Container
						{...provided.draggableProps}
						{...provided.dragHandleProps}
						ref={provided.innerRef}
						isDragging={snapshot.isDragging}
					>
						<Content>{task.content}</Content>
					</Container>
				);
			}}
		</Draggable>
	);
};

export default Task;
