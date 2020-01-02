const express = require("express");
const http = require("http");
const https = require("https");
const fs = require("fs");

const expressApp = express();
const server = http.createServer(expressApp);

const secureServer = https.createServer(
  {
    key: fs.readFileSync("./key.pem"),
    cert: fs.readFileSync("./cert.pem"),
    passphrase: "ilikecats"
  },
  expressApp
);

const io = require("socket.io")(server);
const ios = require("socket.io")(secureServer);

expressApp.use(express.static("public"));

const users = [];
const chatHistory = [];

ios.on("connection", socket => {
  const userID = socket.id;
  // console.log("object", socket);
  socket.on("REGISTER_USER", userCard => {
    const userInfo = {
      id: userID,
      name: userCard.name
    };
    console.log("users", users);
    users.push(userInfo);
    ios.emit("USERS_ONLINE", users);
  });

  socket.on("USER_MESSAGE", msg => {
    ios.emit("NEW_CHAT_MESSAGE", msg);
    chatHistory.push(msg);
  });

  socket.on("USER_DRAWNING", coordinates => {
    console.log("coordinates ", coordinates);
    ios.emit("USER_DRAWNING", coordinates);
  });

  socket.on("USER_DISCONNECTED", () => {
    if (usersDatabase.users[userID]) {
      delete users[userID];

      ios.emit("USERS_ONLINE", users);
    }
  });
});

server.listen(8000, () => {
  console.log("server started at 80");
});

secureServer.listen(8001, () => {
  console.log("secure server started at 443");
});
