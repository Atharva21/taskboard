import React from "react";

import styled from "styled-components";
import { Draggable } from "react-beautiful-dnd";

const Container = styled.div`
	border: 1px solid lightgrey;
	border-radius: 5px;
	padding: 8px;
	margin-bottom: 8px;
	background-color: ${(props) => (props.isDragging ? "grey" : "#222")};
`;

const Task = ({ task, index }) => {
	return (
		<Draggable draggableId={task.id} index={index}>
			{(provided, snapshot) => {
				return (
					<Container
						{...provided.draggableProps}
						{...provided.dragHandleProps}
						ref={provided.innerRef}
						isDragging={snapshot.isDragging}
					>
						{task.content}
					</Container>
				);
			}}
		</Draggable>
	);
};

export default Task;
