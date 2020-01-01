module.exports = getUserInfo = (id, base) => {
  const user = base.filter(user => user.id === id);
  return user;
};
