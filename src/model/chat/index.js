const { createStore, createEvent, sample } = require("effector");

// const { emitHistory } = require("../../lib/emitHistory");

const $chatHistory = createStore([]);
const addMessage = createEvent();
const sendTo = createEvent();

$chatHistory.on(addMessage, (history, newMsg) => [{ ...newMsg }, ...history]);

const historyEmitData = sample($chatHistory, sendTo, (history, userID) => ({
  history: history.slice(0, 10),
  userID
}));

// sample({
//   source: historyEmitData,
//   clock: sendTo,
//   target: emitHistory
// });

module.exports = {
  $chatHistory,
  addMessage,
  sendTo
};
