const { createStore, createEvent } = require("effector");

const $usersOnline = createStore([]);

const addUser = createEvent();
const deleteUser = createEvent();
const emitOnline = createEvent();

$usersOnline.on(addUser, (users, newUser) => [...users, { ...newUser }]);
$usersOnline.on(deleteUser, (users, id) => users.filter(u => u.id !== id));

module.exports = {
  $usersOnline,
  addUser,
  deleteUser,
  emitOnline
};
