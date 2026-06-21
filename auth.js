const bcrypt = require("bcryptjs");
const db = require("./db-manager");

exports.verifyUser = async (user) => {

  const realUser = await db.getUser(user.user);

  if (!realUser) return false;

  let result = await bcrypt.compare(user.password, realUser.password);

  return result;
};

exports.createUser = async (user) => {

  let saltRound = 12;

  let validData = true;

  if (!validData) return false;

  user.password = await bcrypt.hash(user.password, saltRound);

  db.createUser(user.user, user.password);

  return true;
  
}

exports.verifyToken = async (user, token) => {
  const dbSessions = await db.getSession(user);

  if (!dbSessions) return false;

  let currentDate = new Date();

  for (session of dbSessions) {

    if (session.token !== token) continue;
    if (new Date(session.expires_at) < currentDate) continue;

    return true;

  }

  return false;
};
