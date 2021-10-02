import React, { useRef, useState } from "react";
import useHover from "react-use-hover";
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
const Title = styled.div`
	border-radius: 0.7em;
	min-height: 50px;
	padding: 8px 1px;
	display: flex;
	flex-direction: row;
	&:hover {
		cursor: grab;
	}
`;

const H3 = styled.h3`
	margin: 0px 10px;
	height: 100%;
	word-break: break-word;
	flex-grow: 1;
`;

const DeleteButton = styled.button`
	color: red;
	font-weight: 900;
	display: ${(props) =>
		props.disableDelete ? "none" : props.isHovering ? "block" : "none"};

	&:hover {
		cursor: pointer;
	}
`;

const ColumnComponent = (props) => {
	const titleRef = useRef();
	const [hovering, hoverProps] = useHover({ mouseEnterDelayMS: 300 });
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
				{...hoverProps}
				onDoubleClick={clickHandler}
				onBlur={onBlurHandler}
				onKeyDown={keyDownHandler}
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
			>
				<H3
					ref={titleRef}
					spellCheck="false"
					contentEditable={isEditing ? "true" : "false"}
					suppressContentEditableWarning={true}
				>
					{props.title}
				</H3>
				<DeleteButton
					disableDelete={props.isNew}
					isHovering={hovering}
					onClick={props.deleteHandler}
				>
					X
				</DeleteButton>
			</Title>
			{props.children}
		</Container>
	);
};

export default ColumnComponent;
