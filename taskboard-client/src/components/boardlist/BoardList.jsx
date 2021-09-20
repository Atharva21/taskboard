import React, { useEffect, useState, useRef } from "react";
import axios from "../../config/axios";
import { useHistory } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
	margin-top: 4em;
	user-select: none;
`;

const StyledBoardList = styled.div`
	padding: 1em;
	display: flex;
	align-items: flex-start;
`;

const StyledBoard = styled.div`
	padding: 1em;
	background-color: #f2b138;
	margin-right: 1em;
`;

const BoardList = () => {
	const inputRef = useRef();
	const [boards, setBoards] = useState();
	const history = useHistory();

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = async () => {
		try {
			const result = await axios.get("/boards");
			setBoards(result.data.data);
		} catch (error) {
			console.error(error.response.data);
			if (
				error.response.status === 401 ||
				error.response.status === 403
			) {
				history.push("/login");
			}
		}
	};

	const onBoardClicked = (boardId) => {
		console.log(boardId);
		history.push(`/board/${boardId}`);
	};

	const addBoardHandler = async () => {
		try {
			const title = inputRef.current.value;
			await axios.post("/boards", {
				title,
			});
			fetchData();
		} catch (error) {
			console.error(error.response.data);
		}
	};

	return (
		<Container>
			{boards && (
				<StyledBoardList>
					{boards.boards.map((board) => {
						return (
							<StyledBoard
								key={board._id}
								style={{ border: "1px solid blue" }}
								onClick={() => onBoardClicked(board._id)}
							>
								{board.title}
							</StyledBoard>
						);
					})}
				</StyledBoardList>
			)}
			{boards && !boards.maxBoards && (
				<div>
					<input
						type="text"
						placeholder="board title"
						ref={inputRef}
					/>
					<button onClick={addBoardHandler}>Add</button>
				</div>
			)}
		</Container>
	);
};

export default BoardList;
