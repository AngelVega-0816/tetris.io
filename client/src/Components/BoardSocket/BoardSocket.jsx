import React from "react";
import Board from "../Board/Board";
import GameStats from "../GameStats/GameStats";
import Previews from "../Previews/Previews";

function BoardSocket({
	boardPlayerTwo,
	tetrominoesPlayerTwo,
	gameStatsPlayerTwo,
}) {
	return (
		<div className="player">
			<Board board={boardPlayerTwo} />
			<div className="stats">
				<Previews tetrominoes={tetrominoesPlayerTwo} />
				<GameStats gameStats={gameStatsPlayerTwo} />
			</div>
		</div>
	);
}

export default BoardSocket;
