import React from "react";
import "./styles.css";
import { Action, actionForKey, actionIsDrop } from "../../bussines/Input";
import { playerController } from "../../bussines/PlayerController";
import { useInterval } from "../../hooks/useInterval";
import { useDropTime } from "../../hooks/useDropTime";
import { useEffect } from "react";

function GameConstroller({
	board,
	gameStats,
	player,
	setGameOver,
	setPlayer,
	init,
	multiplayer,
}) {
	const [dropTime, pauseDropTime, resumeDropTime] = useDropTime({
		gameStats,
	});

	useInterval(() => {
		handleInput({ action: Action.SlowDrop });
	}, dropTime);

	const onKeyUp = ({ code }) => {
		const action = actionForKey(code);
		if (actionIsDrop(action)) resumeDropTime();
	};

	const onKeyDown = ({ code }) => {
		const action = actionForKey(code);

		if (action === Action.Pause) {
			if (dropTime) {
				pauseDropTime();
			} else {
				resumeDropTime();
			}
		} else if (action === Action.Quit) {
			setGameOver(true);
		} else {
			if (actionIsDrop(action)) pauseDropTime();
			handleInput({ action });
		}
		handleInput({ action });
	};

	useEffect(() => {
		if (init && multiplayer) {
			if (init === "await") {
				pauseDropTime();
			} else if (init === "start") {
				resumeDropTime();
			}
		}
	}, [init]);

	const handleInput = ({ action }) => {
		playerController({
			action,
			board,
			player,
			setPlayer,
			setGameOver,
		});
	};


	return (
		<input
			type="text"
			className="GameController"
			onKeyDown={onKeyDown}
			onKeyUp={onKeyUp}
			autoFocus
		/>
	);
}

export default GameConstroller;
