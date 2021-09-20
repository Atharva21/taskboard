import React, { useEffect, useState, useRef } from "react";
import axios from "../../config/axios";
import { useHistory } from "react-router-dom";

const DashBoard = () => {
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
			// TODO if 401/403, redirect to login.
			console.error(error.response.data);
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
		<div>
			{boards &&
				boards.boards.map((board) => {
					return (
						<h1
							key={board._id}
							style={{ border: "1px solid blue" }}
							onClick={() => onBoardClicked(board._id)}
						>
							{board.title}
						</h1>
					);
				})}
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
		</div>
	);
};

export default DashBoard;
