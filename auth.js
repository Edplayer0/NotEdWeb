const db = require("./db-manager");

exports.verifyUser = async (user) => {

  const realUser = await db.getUser(user.user);

  if (realUser.password === user.password) return true;
  return false;
};

exports.verifyToken = async (user, token) => {
  const dbSession = await db.getSession(user);

  if (!dbSession) return false;

  if (dbSession.token !== token) return false;
  if (new Date(dbSession.expires_at) < new Date()) return false;

  return true;
};
