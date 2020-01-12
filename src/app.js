const express = require("express");

const app = express();
const http = require("http");
const server = http.createServer(app);

const io = require("socket.io")(server);

const port = process.env.PORT || 8080;

const { addUser, deleteUser } = require("./model/users");
const { addMessage } = require("./model/chat");

io.on("connection", socket => {
  const socketID = socket.id;

  const eventEmiter = require("./lib/eventEmiter.js")(socket);

  socket.on("INIT_SESSION", user => {
    addUser({ id: socketID, name: user.name });
    eventEmiter.emitOnline();
  });

  socket.on("USER_MESSAGE", msg => {
    addMessage(msg);
    io.emit("USER_MESSAGE", msg);
  });

  socket.on("USER_TYPING", () => {
    io.emit("USER_TYPING", socketID);
  });

  socket.on("disconnect", () => {
    deleteUser(socketID);
    eventEmiter.emitOnline();
  });
});

server.listen(port, () => {
  console.log(`APP started at ${port}`);
});
