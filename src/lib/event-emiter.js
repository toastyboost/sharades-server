const { createEffect, forward, sample } = require("effector");
const { emitOnline, $usersOnline } = require("../model/users");
const { $roundTimer } = require("../model/game");

// effects to model
// make events detecter

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

  const timeEmiter = createEffect({
    handler(timeLeft) {
      socket.emit("ROUND_COUNTDOWN", timeLeft);
    }
  });

  forward({
    from: $roundTimer,
    to: timeEmiter
  });
};
