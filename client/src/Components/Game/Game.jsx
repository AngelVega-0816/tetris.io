import React from "react";
import { useState } from "react";
import { socket } from "../../bussines/SocketsConnection";
import { useGameOver } from "../../hooks/useGameOver";
import Menu from "../Menu/Menu";
import Tetris from "../Tetris/Tetris";

function Game({ rows, columns }) {
	const [gameOver, setGameOver, resetGameOver] = useGameOver();
	const [multiplayer, setMultiplayer] = useState(false);
	const [init, setInit] = useState(false);
	const [code, setCode] = useState(null);

	const start = (multi) => {
		if (multi) {
      const codeRoom = `${Math.ceil(Math.random() * 999)}`;
			setMultiplayer(multi);
			window.sessionStorage.setItem("room", codeRoom)
			socket.emit("createRoom", codeRoom);
			setInit("await");
      setCode(codeRoom)
			resetGameOver();
		} else {
			window.sessionStorage.setItem("room", "alone")
			resetGameOver();

		}
	};


	let handleSubmit = (event, code, errors, setErrors) => {
		event.preventDefault()
		if(!errors.error) {
			socket.emit("enterRoom", code, (error) => {
				if(!error) {
					setCode(code)
					setMultiplayer(true)
					setInit("start")
					resetGameOver()
					if(!window.sessionStorage.length) {
						window.sessionStorage.setItem("room", code)
					}
				} else {
					setErrors({error: error})
				}
			});
		}
	};

	socket.on("userRoom", (boolean) => {
		setInit("start");
	});
	return (
		<div >
			{gameOver ? (
				<Menu
					start={start}
					handleSubmit={handleSubmit}
				/>
			) : (
				<Tetris
					rows={rows}
					columns={columns}
					setGameOver={setGameOver}
					multiplayer={multiplayer}
					init={init}
          code={code}
				/>
			)}
		</div>
	);
}

export default Game;
