import React, { useEffect, useState } from "react";
import axios from "../../config/axios";
import { useHistory } from "react-router-dom";

const DashBoard = () => {
	const [boards, setBoards] = useState([]);
	const history = useHistory();

	useEffect(() => {
		const fetchData = async () => {
			try {
				const result = await axios.get("/boards");
				setBoards(result.data.data);
			} catch (error) {
				// TODO if 401/403, redirect to login.
				console.error(error.response.data);
			}
		};
		fetchData();
	}, []);

	const onBoardClicked = (boardId) => {
		console.log(boardId);
		history.push(`/board/${boardId}`);
	};

	return (
		<div>
			{boards.map((board) => {
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
		</div>
	);
};

export default DashBoard;
