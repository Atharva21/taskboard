import React from "react";
import styled from "styled-components";
import useHover from "react-use-hover";

const StyledBoard = styled.div`
	position: relative;
	padding: 1em;
	border-radius: 0.5em;
	background-color: #f2b138;
	margin-right: 1em;
	font-size: 1.5em;
`;

const DeleteButton = styled.button`
	position: absolute;
	top: 0.2em;
	right: 0.2em;
	border-radius: 1em;
	color: red;
	font-size: small;
	font-weight: 40;
	display: ${(props) => (props.isHovering ? "block" : "none")};
	&:hover {
		cursor: pointer;
	}
`;

const StyledBoardComponent = (props) => {
	const [hovering, hoverProps] = useHover({ mouseEnterDelayMS: 300 });

	return (
		<StyledBoard
			{...hoverProps}
			style={{ border: "1px solid black" }}
			onClick={() => props.onBoardClicked(props.boardId)}
		>
			{props.title}
			<DeleteButton
				isHovering={hovering}
				onClick={(e) => {
					e.stopPropagation();
					props.deleteHandler(props.boardId);
				}}
			>
				X
			</DeleteButton>
		</StyledBoard>
	);
};

export default StyledBoardComponent;
