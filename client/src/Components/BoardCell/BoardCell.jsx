import React from "react";
import "./styles.css";

function BoardCell({ cell }) {
	return (
		<div className={`BoardCell ${cell.className}`}>
		</div>
	);
}

export default BoardCell;