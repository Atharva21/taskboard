import React, { useRef, useState } from "react";

import styled from "styled-components";

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

	&:hover {
		cursor: grab;
	}
`;

const ColumnComponent = (props) => {
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
			titleRef.current.innerText &&
			props.title !== titleRef.current.innerText &&
			titleRef.current.innerText.length > 0
		) {
			const newTitle = titleRef.current.innerText;
			titleRef.current.innerText = props.title;
			props.titleEditHandler(newTitle);
		}
	};

	const keyDownHandler = (e) => {
		if (e.key === "Enter") {
			titleRef.current.blur();
		}
	};

	return (
		<Container
			ref={props.innerRef}
			{...props.draggableProps}
			isDragging={props.isDragging}
		>
			<Title
				{...props.dragHandleProps}
				ref={titleRef}
				onDoubleClick={clickHandler}
				onBlur={onBlurHandler}
				onKeyDown={keyDownHandler}
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
				{props.title}
			</Title>
			{props.children}
		</Container>
	);
};

export default ColumnComponent;
