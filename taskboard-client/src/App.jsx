import React from "react";
import styled from "styled-components";

import Login from "./components/user/Login";
import Signup from "./components/user/Signup";
import DashBoard from "./components/dashboard/DashBoard";
import Board from "./components/board/Board";
import { BrowserRouter as Router } from "react-router-dom";
import { Switch } from "react-router-dom";
import { Route } from "react-router-dom";

// TODO
const Container = styled.div``;

const App = () => {
	return (
		<Container className="App">
			<Router>
				<Switch>
					<Route path="/signup" exact component={Signup} />
					<Route path="/login" exact component={Login} />
					<Route path="/dashboard" exact component={DashBoard} />
					<Route path="/board/:id" exact component={Board} />
					<Route path="/" component={() => 404} />
				</Switch>
			</Router>
			{/* <Board></Board> */}
		</Container>
	);
};

export default App;
