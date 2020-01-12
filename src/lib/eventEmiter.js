const { createEvent, createEffect, sample } = require("effector");
const { $usersOnline } = require("../model/users");

const emitOnline = createEvent();

module.exports = socket => {
  const onlineEmiter = createEffect({
    handler(usersOnline) {
      socket.emit("USERS_ONLINE", usersOnline);
    }
  });

  sample({
    source: $usersOnline,
    clock: emitOnline,
    target: onlineEmiter
  });

  return {
    emitOnline
  };
};
