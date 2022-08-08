import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import "./styles.css";

function Menu({ start, handleSubmit }) {
	let [multi, setMulti] = useState(false);
	let [errors, setErrors] = useState({ error: null });

	let [code, setCode] = useState("");
	let handleCode = (event) => {
		setCode(event.target.value);
	};

	let handleMultiMenu = () => {
		setMulti(true);
	};

	useEffect(() => {
		if (!/^[0-9]*$/.test(code)) {
      setErrors({error: "Code debe ser número"})
		} else if (errors.error) {
      setErrors({error: null})
    }
	}, [code]);

	let title = ["T", "E", "T", "R", "I", "S", ".", "i", "o"]

	return (
		<div className={"menuContainer"}>
			<div className="title">
				<h3>
					{title.map((e, i) => <span key={e + i}>{e}</span>)}
				</h3>
			</div>
			<div className="buttons">
				{!multi ? (
					<>
						<button onClick={(event) => start(false)}>One Player</button>
						<button onClick={handleMultiMenu}>Multiplayer</button>
					</>
				) : (
					<>
						<button onClick={(event) => start(true)}>Create room</button>
						<form
							onSubmit={(event) => handleSubmit(event, code, errors, setErrors)}
							className="neon formRoom"
						>
							<p>Join room</p>
							<input
								type="text"
								value={code}
								onChange={handleCode}
								placeholder="Código"
							/>
							{errors.error ? <p className="errors">{errors.error}</p> : null}
							<button type="submit">Join</button>
						</form>
					</>
				)}
			</div>
		</div>
	);
}

export default Menu;
