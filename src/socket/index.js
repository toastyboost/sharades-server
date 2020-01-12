const { addUser, deleteUser } = require("../model/users");
const { addMessage } = require("../model/chat");

module.exports = server => {
  const io = require("socket.io")(server);

  io.on("connection", socket => {
    const socketID = socket.id;
    const eventEmiter = require("../lib/eventEmiter.js")(socket);

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
};

//   socket.on("USER_DRAWNING", coordinates => {
//     io.emit("USER_DRAWNING", coordinates);
//   });

// const privateMessage = createEffect({
//   handler({ userID, data }) {
//     io.to(`${userID}`).emit("CHAT_HISTORY", data);
//   }
// });
