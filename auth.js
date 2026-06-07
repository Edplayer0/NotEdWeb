const db = require("./db-manager");

exports.verifyUser = async (user) => {

  const realUser = await db.getUser(user.user);

  if (realUser.password === user.password) return true;
  return false;
};

exports.verifyCookie = async (user, token) => {
  let dbSession = await db.getSession(user);
  if (dbSession[0] !== token) return false;
  if (dbSession[1] < new Date()) return false;
  return true;
};
