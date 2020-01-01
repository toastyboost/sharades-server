const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);

const { getUserInfo } = require("./lib/get-user-info");

const users = [];
const chatHistory = [];

io.on("connection", socket => {
  const userID = socket.id;
  console.log("object", socket);
  socket.on("REGISTER_USER", userCard => {
    const userInfo = {
      id: userID,
      name: userCard.name
    };
    console.log("users", users);
    users.push(userInfo);
    io.emit("USERS_ONLINE", users);
  });

  socket.on("USER_MESSAGE", msg => {
    io.emit("NEW_CHAT_MESSAGE", msg);
    chatHistory.push(msg);
  });

  socket.on("USER_DRAWNING", coordinates => {
    console.log("coordinates ", coordinates);
    io.emit("USER_DRAWNING", coordinates);
  });

  socket.on("USER_DISCONNECTED", () => {
    if (usersDatabase.users[userID]) {
      delete users[userID];

      io.emit("USERS_ONLINE", users);
    }
  });
});

const server = http.listen(8000, () => {
  console.log("App is working");
  console.log("Port:", server.address().port);
});
