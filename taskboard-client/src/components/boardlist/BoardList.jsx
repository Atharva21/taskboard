import React, { useEffect, useState, useRef } from "react";
import axios from "../../config/axios";
import { useHistory } from "react-router-dom";
import StyledBoardComponent from "../ui/StyledBoardComponent";
import styled from "styled-components";

const Container = styled.div`
	display: flex;
	flex-direction: column;
	margin-left: 2em;
	margin-top: 4em;
	user-select: none;
`;

const StyledBoardList = styled.div`
	padding: 1em;
	display: flex;
	align-items: flex-start;
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
		history.push(`/board/${boardId}`);
	};

	const addBoardHandler = async () => {
		try {
			const title = inputRef.current.value;
			inputRef.current.value = "";
			await axios.post("/boards", {
				title,
			});
			fetchData();
		} catch (error) {
			console.error(error.response.data);
		}
	};

	const deleteHandler = async (boardId) => {
		try {
			const result = await axios.delete(`/boards/${boardId}`);
			await fetchData();
		} catch (error) {
			console.error(error.response.data);
		}
	};

	return (
		<Container>
			<h1>My Boards:</h1>
			{boards && (
				<StyledBoardList>
					{boards.boards.map((board) => {
						return (
							<StyledBoardComponent
								key={board._id}
								title={board.title}
								boardId={board._id}
								onBoardClicked={onBoardClicked}
								deleteHandler={deleteHandler}
							/>
						);
					})}
				</StyledBoardList>
			)}
			{boards && !boards.maxBoards && (
				<div>
					<input
						type="text"
						spellCheck="false"
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
