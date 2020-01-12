const express = require("express");
const http = require("https");

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT ? process.env.PORT : 8000;

const io = require("socket.io")(server);

const { addUser, deleteUser } = require("./model/users");
const { addMessage } = require("./model/chat");

io.on("connection", socket => {
  const socketID = socket.id;
  console.log(`socket.id`, socket.id);

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

server.listen(PORT, () => {
  console.log(`APP started at ${PORT}`);
});
