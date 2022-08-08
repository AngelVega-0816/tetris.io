import React from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { socket } from "../../bussines/SocketsConnection";
import Context from "../../context/context";
import GameStats from "../GameStats/GameStats";
import "./styles.css";

function Finish({ one, multiplayer }) {
	let [, setValContext] = useContext(Context);
	let handleRestartData = () => {
		setValContext({
			loser: "",
			room: {},
			player: "",
		});
	};
	useEffect(() => {
		window.sessionStorage.clear()
	}, [])
	return (
		<div className="Finish">
			<h3>{multiplayer.id || one?.level ? "You Lost" : "You Win"}</h3>
			<div className="containStats neon">
				{one?.level ? (
					<div>
						<GameStats gameStats={one} />
					</div>
				) : (
					<>
						<div>
							<GameStats gameStats={multiplayer?.room[socket.id]?.gameStats} />
						</div>
						<div className="divisor neon"></div>
						<div>
							<GameStats
								gameStats={multiplayer.room[multiplayer.player].gameStats}
							/>
						</div>
					</>
				)}
			</div>
			<button onClick={handleRestartData}>Menu</button>
		</div>
	);
}

export default Finish;
