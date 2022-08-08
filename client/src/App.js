import Game from "./Components/Game/Game";
import styles from "./App.module.css";
import { useState } from "react";
import { socket } from "./bussines/SocketsConnection";
import Finish from "./Components/Finish/Finish";
import Context from "./context/context";

function App() {
	let [valContext, setValContext] = useState({
		loser: "",
		room: {},
		statsOne: [],
		player: "",
	});

	let updateContext = (loser, player, room) => {
		setValContext((prevState) => {
			return {
				...prevState,
				loser,
				player,
				room
			};
		});
	};

	socket.on("gameOverMe", (loser, roomData, player, room) => {
		updateContext(loser, player, roomData);
	});
	socket.on("gameOverYou", (loser, roomData, player, room) => {
		if(loser === "alone" && !room) {
			updateContext(true, {}, null)
		} else {
			updateContext(loser, player, roomData);
		}
	});
	return (
		<Context.Provider value={[valContext, setValContext]}>
			<div className={styles.App}>
				{!valContext.loser ? (
					<Game rows={20} columns={10} />
				) : (
					<Finish one={valContext.statsOne} multiplayer={{id: socket.id === valContext.loser, player: valContext.player, room: valContext.room}}/>
				)}
			</div>
		</Context.Provider>
	);
}

export default App;
