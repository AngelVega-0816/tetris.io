const express = require("express");
const httpServer = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "http://localhost:3000/");
	res.header("Access-Control-Allow-Credentials", "true");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept"
	);
	res.header("Access-Control-Allow-Methods", "GET, POST");
	next();
});

const server = httpServer.createServer(app);

const rooms = {};
let usersRooms = [];

const io = new Server(server, {
	cors: {
		origin: "http://localhost:3000/",
		methods: ["GET", "POST"],
		credentials: true,
	},
});

io.on("connection", (socket) => {

	socket.on("createRoom", (codeRoom) => {
		socket.join(codeRoom);
		rooms[codeRoom] = {};
		rooms[codeRoom][socket.id] = {};
		socket.emit("codeRoom", codeRoom);
		usersRooms.push([socket.id, codeRoom])
	});

	socket.on("enterRoom", (code, cb) => {
		if (Object.keys(rooms).includes(code)) {
			if(Object.keys(rooms[code]).length != 2) {
				socket.join(code);
				rooms[code][socket.id] = {};
				socket.to(code).emit("userRoom", rooms[code]);
				socket.emit("codeRoom", code);
	
				usersRooms.push([socket.id, code])
				cb()
			} else {
				cb("Full room")
			}
		} else {
			setTimeout(() => {
				cb("Invalid code")
			}, 0)
		}
	});

	socket.on("board", (data) => {
		if (Object.keys(rooms).includes(data.code)) {
			rooms[data.code][socket.id] = {
				...data,
			};
			socket.to(data.code).emit("game", data);
		}
	});

	socket.on("gameOver", (room, id) => {
		if (room !== "alone" && rooms[room]) {
			let copyRoom = {...rooms[room]}
			socket.in(room).emit("gameOverMe", socket.id, copyRoom, id, room);
			let ids = Object.keys(rooms[room])
			let idUser = ids.filter((idUser) => idUser !== id);
			socket.emit("gameOverYou", socket.id, copyRoom, idUser[0], room);
			delete rooms[room];

			for (let i = 0; i < usersRooms.length; i++) {
				if (usersRooms[i].includes(ids[0]) || usersRooms[i].includes(ids[1])) {
					usersRooms[i] = []
				}
			}
		} else if (room === "alone"){
			console.log(room);
			socket.emit("gameOverYou", "alone")
		}
	});

	socket.on("disconnect", (id) => {
		for (let i = 0; i < usersRooms.length; i++) {
			if (usersRooms[i].includes(socket.id)) {
				// numRoom = usersRooms[i][1];
				let room = usersRooms[i][1]
				socket.in(room).emit("gameOverMe",socket.id, { ...rooms[room] }, socket.id)
				delete rooms[usersRooms[i][1]]
				usersRooms[i] = []
			}
		}
	});
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
	console.log("Server listening" + PORT);
});
