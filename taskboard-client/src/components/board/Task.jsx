import React, { useState, useRef } from "react";

import styled from "styled-components";
import { Draggable } from "react-beautiful-dnd";

const Container = styled.div`
	border: 1px solid black;
	border-radius: 0.5em;
	display: flex;
	justify-content: center;
	margin-bottom: 8px;
	background-color: ${(props) => (props.isDragging ? "#f2b138" : "white")};
	word-break: break-word;

	&:hover {
		background-color: lightyellow;
	}
`;

const Content = styled.div`
	padding: 0.5em;
	min-height: 20px;
	flex-grow: 1;
`;

const Task = ({ task, index, onTaskEdit }) => {
	const [isEditing, setEditing] = useState(false);
	const contentRef = useRef();

	const clickHandler = () => {
		if (!isEditing) toggleEditable();
		setTimeout(() => {
			contentRef.current.focus();
		}, 0);
	};

	const onBlurHandler = () => {
		if (isEditing) toggleEditable();
		setTimeout(() => {
			contentRef.current.blur();
		}, 0);

		if (
			contentRef.current.innerHTML &&
			task.content !== contentRef.current.innerHTML &&
			contentRef.current.innerHTML.length > 0
		) {
			onTaskEdit(task._id, contentRef.current.innerHTML);
		}
	};

	const toggleEditable = () => {
		setEditing((prev) => !prev);
	};

	return (
		<Draggable draggableId={task._id} index={index}>
			{(provided, snapshot) => {
				return (
					<Container
						{...provided.draggableProps}
						{...provided.dragHandleProps}
						ref={provided.innerRef}
						isDragging={snapshot.isDragging}
						onDoubleClick={clickHandler}
						onBlur={onBlurHandler}
					>
						<Content
							spellCheck="false"
							contentEditable={isEditing ? "true" : "false"}
							suppressContentEditableWarning={true}
							style={
								isEditing
									? {
											cursor: "text",
									  }
									: {
											cursor: "inherit",
									  }
							}
							ref={contentRef}
						>
							{task.content}
						</Content>
					</Container>
				);
			}}
		</Draggable>
	);
};

export default Task;
