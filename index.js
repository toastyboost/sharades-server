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

  socket.on("REGISTER_USER", userCard => {
    const userInfo = {
      id: userID,
      name: userCard.name
    };

    users.push(userInfo);
    console.log("users", users);
    ios.emit("USERS_ONLINE", users);
  });

  socket.on("USER_MESSAGE", msg => {
    ios.emit("NEW_CHAT_MESSAGE", msg);
    chatHistory.push(msg);
  });

  socket.on("USER_DRAWNING", coordinates => {
    ios.emit("USER_DRAWNING", coordinates);
  });

  socket.on("USER_DISCONNECTED", () => {
    if (usersDatabase.users[userID]) {
      delete users[userID];

      ios.emit("USERS_ONLINE", users);
    }
  });
});

const PORT = process.env.PORT || 8000;
const PORTS = process.env.PORTS || 8001;

server.listen(PORT, () => {
  console.log("server started at 8000");
});

secureServer.listen(PORTS, () => {
  console.log("secure server started at 8001");
});
