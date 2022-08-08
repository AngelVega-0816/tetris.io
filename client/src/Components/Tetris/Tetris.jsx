import React, { useContext } from "react";
import "./styles.css";

import { socket } from "../../bussines/SocketsConnection";

import Board from "../Board/Board";
import GameStats from "../GameStats/GameStats";
import Previews from "../Previews/Previews";

import { useBoard } from "../../hooks/useBoard";
import { useGameStats } from "../../hooks/useGameStats";
import { usePlayer } from "../../hooks/usePlayer";
import GameConstroller from "../GameConstroller/GameConstroller";
import BoardSocket from "../BoardSocket/BoardSocket";
import { useEffect } from "react";
import { useState } from "react";
import CodeRoom from "../CodeRoom/CodeRoom";
import Context from "../../context/context";

function Tetris({ rows, columns, setGameOver, multiplayer, init, code }) {
	const [gameStats, addLinesCleared] = useGameStats();
	const [player, setPlayer, resetPlayer] = usePlayer();
	const [board, setBoard] = useBoard({
		rows,
		columns,
		player,
		resetPlayer,
		addLinesCleared,
	});
	let [playerTwo, setPlayerTwo] = useState({});
	let [, setValContext] = useContext(Context);

	useEffect(() => {
		if (code) {
			socket.emit("board", { board, player, gameStats, code });
		}
	}, [board, player, gameStats, code]);

	// useEffect(() => {
	socket.on("game", (boardPlayerTwo) => {
		setPlayerTwo(boardPlayerTwo);
	});
	useEffect(() => {
		if (!multiplayer) {
			setValContext((prevState) => {
				return {
					...prevState,
					statsOne: gameStats,
				};
			});
		}
	}, [gameStats]);

	return (
		<div className={"Tetris"}>
			<CodeRoom code={code} />
			<div className="player">
				<Board board={board} />
				<div className="stats">
					<Previews tetrominoes={player.tetrominoes} />
					<GameStats gameStats={gameStats} />
				</div>
				<GameConstroller
					board={board}
					gameStats={gameStats}
					player={player}
					setGameOver={setGameOver}
					setPlayer={setPlayer}
					init={init}
					multiplayer={multiplayer}
				/>
			</div>
			{multiplayer && init === "start" && playerTwo?.board ? (
				<BoardSocket
					boardPlayerTwo={playerTwo?.board}
					tetrominoesPlayerTwo={playerTwo?.player?.tetrominoes}
					gameStatsPlayerTwo={playerTwo?.gameStats}
				/>
			) : null}
		</div>
	);
}

export default Tetris;
