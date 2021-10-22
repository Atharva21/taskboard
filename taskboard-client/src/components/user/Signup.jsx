import React, { useRef } from "react";
import axios from "../../config/axios";
import { useHistory } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
	display: grid;
	place-items: center;
	font-size: large;
`;

const Input = styled.input`
	font-size: large;
	border-radius: 0.2em;
	margin: 0.3em 0em;
`;

const FormContainer = styled.div`
	margin-top: 4em;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	justify-content: center;
	user-select: none;
`;

const TitleContainer = styled.div`
	display: grid;
	place-items: center;
	background-color: #f2d338;
`;

const Signup = () => {
	const username = useRef();
	const password = useRef();
	const history = useHistory();

	const clickHandler = async () => {
		try {
			const result = await axios.post("/users", {
				username: username.current.value,
				password: password.current.value,
			});
			console.log(result.data);
			if (result.status === 200) {
				history.push("/login");
			}
		} catch (error) {
			console.log(error.response.data);
		}
	};

	return (
		<>
			<TitleContainer>
				<h1>TaskBoard</h1>
			</TitleContainer>
			<Container>
				<FormContainer>
					<Input type="text" placeholder="username" ref={username} />
					<Input
						type="password"
						placeholder="password"
						ref={password}
					/>
					<button onClick={clickHandler}>Signup</button>
				</FormContainer>
			</Container>
		</>
	);
};

export default Signup;
