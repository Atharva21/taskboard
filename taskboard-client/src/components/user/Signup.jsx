import React, { useRef } from "react";
import axios from "../../config/axios";
import { useHistory } from "react-router-dom";

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
		<div>
			<input type="text" placeholder="username" ref={username} />
			<input type="password" placeholder="password" ref={password} />
			<button onClick={clickHandler}>Signup</button>
		</div>
	);
};

export default Signup;
