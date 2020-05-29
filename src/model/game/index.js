const { createEvent, createStore, guard } = require("effector");

const { createCountdown } = require("../../lib/create-countdown");

const startRound = createEvent();
const pauseGame = createEvent();
const restartGame = createEvent();

const $roundTimer = createStore(60);

const gameStatus = createCountdown("formSubmit", {
  start: startRound,
  pause: pauseGame,
  restart: restartGame
});

$roundTimer.on(gameStatus.tick, (_, seconds) => seconds);

$roundTimer.watch(timeLeft => {
  console.log("object", timeLeft);
  if (timeLeft < 55) {
    // pauseGame();
  }
});

module.exports = {
  startRound,
  pauseGame,
  $roundTimer
  // restartGame
};
