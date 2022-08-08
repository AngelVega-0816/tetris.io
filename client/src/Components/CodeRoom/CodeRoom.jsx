import React from "react";
import "./styles.css";

function CodeRoom({code}) {
	return (
		code && (
			<div className="CodeRoom">
				<h5>
					Código:
					{` ${code}`}
				</h5>
			</div>
		)
	);
}

export default CodeRoom;
