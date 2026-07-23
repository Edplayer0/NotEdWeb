const bcrypt = require("bcryptjs");
const db = require("./db-manager");

exports.verifyUser = async (user) => {
  const realUser = await db.getUser(user.user);

  if (!realUser) return false;

  let result = await bcrypt.compare(user.password, realUser.password);

  if (result) return realUser.id;
};

exports.createUser = async (user) => {
  let saltRound = 12;

  let validData = true;

  if (!validData) return false;

  user.password = await bcrypt.hash(user.password, saltRound);

  db.createUser(user.user, user.password);

  return true;
};

exports.verifyToken = async (req, res, next) => {
  if (!req.cookies.user || !req.cookies.token) {
    return res.render("index", { account: false });
  }

  const user = req.cookies.user;
  const token = req.cookies.token;
  const dbSessions = await db.getSession(user);

  if (!dbSessions) {
    return res.render("index", { account: false });
  }

  const currentDate = new Date();

  for (const session of dbSessions) {
    if (session.token !== token) continue;
    if (new Date(session.expires_at) < currentDate) continue;

    return next();
  }

  return res.render("index", { account: false });
};
