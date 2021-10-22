import React, { useState, useRef } from "react";
import useHover from "react-use-hover";
import styled from "styled-components";

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

const DeleteButton = styled.button`
	color: red;
	font-weight: 900;
	position: relative;
	top: 0;
	right: 0;
	display: ${(props) =>
		props.disableDelete ? "none" : props.isHovering ? "block" : "none"};

	&:hover {
		cursor: pointer;
	}
`;

const TaskComponent = (props) => {
	const [isEditing, setEditing] = useState(false);
	const contentRef = useRef();
	const [hovering, hoverProps] = useHover({ mouseEnterDelayMS: 300 });

	const clickHandler = () => {
		if (!isEditing) toggleEditable();
		setTimeout(() => {
			contentRef.current.focus();
		}, 0);
	};

	const keyDownHandler = (e) => {
		if (e.key === "Enter") {
			contentRef.current.blur();
		}
	};

	const onBlurHandler = () => {
		if (isEditing) toggleEditable();
		setTimeout(() => {
			contentRef.current.blur();
		}, 0);

		if (
			contentRef.current.innerText &&
			contentRef.current.innerText.length > 0
		) {
			const newContent = contentRef.current.innerText;
			contentRef.current.innerText = props.content;
			props.taskEditHandler(newContent);
		}
	};

	const toggleEditable = () => {
		setEditing((prev) => !prev);
	};

	const getClickProps = () => {
		return props.isNew
			? {
					onClick: clickHandler,
			  }
			: {
					onDoubleClick: clickHandler,
			  };
	};

	return (
		<Container
			{...props}
			ref={props.innerRef}
			onBlur={onBlurHandler}
			{...hoverProps}
			{...getClickProps()}
		>
			<Content
				spellCheck="false"
				contentEditable={isEditing ? "true" : "false"}
				suppressContentEditableWarning={true}
				onKeyDown={keyDownHandler}
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
				{props.content}
			</Content>
			<DeleteButton
				disableDelete={props.isNew}
				isHovering={hovering}
				onClick={props.deleteHandler}
			>
				X
			</DeleteButton>
			{props.children}
		</Container>
	);
};

export default TaskComponent;
