import React from "react";
import styled from "styled-components";

const Button = styled.button`
	padding: 0.5rem;
	background-color: white;
	border-radius: 50%;
	border: 2px solid #f0c90a;

	&:hover {
		border-color: black;
	}
`;

const AddButton = (props) => {
	return <Button onClick={props.onClick}>➕</Button>;
};

export default AddButton;
