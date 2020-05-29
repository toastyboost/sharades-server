const express = require("express");

const app = express();
const http = require("http");
const server = http.createServer(app);

const io = require("socket.io")(server);

const port = process.env.PORT || 8080;

const { addUser, deleteUser, emitOnline } = require("./model/users");
const { addMessage } = require("./model/chat");
const { startRound } = require("./model/game");

// The Game

startRound(99);

// Socket

io.on("connection", socket => {
  const socketID = socket.id;

  require("./lib/event-emiter")(socket);

  socket.on("INIT_SESSION", user => {
    addUser({ id: socketID, name: user.name });
    emitOnline();
  });

  socket.on("USER_MESSAGE", msg => {
    addMessage(msg);
    io.emit("USER_MESSAGE", msg);
  });

  socket.on("USER_TYPING", () => {
    io.emit("USER_TYPING", socketID);
  });

  socket.on("USER_DRAWNING", coordinates => {
    io.emit("USER_DRAWNING", coordinates);
  });

  socket.on("disconnect", () => {
    deleteUser(socketID);
    emitOnline();
  });
});

server.listen(port, () => {
  console.log(`APP started at ${port}`);
});
