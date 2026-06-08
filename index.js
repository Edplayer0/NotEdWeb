require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");

const auth = require("./auth");
const db = require("./db-manager");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(cookieParser());
app.use(express.urlencoded());
app.use(express.static("public"));

app.get(
  "/",
  async (req, res, next) => {

    if (Object.keys(req.cookies).length !== 2) return next();

    let verifiedCookie = await auth.verifyToken(req.cookies.user, req.cookies.token);

    if (!verifiedCookie) return next();
    res.render("dashboard");
  },
  (req, res) => {
    res.render("login");
  }
);

app.post("/", async (req, res) => {
  let data = req.body;

  let authenticated = await auth.verifyUser(data);

  if (authenticated) {

    let expiration = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);

    let token = Math.random();
    db.setSession(data.user, token, expiration);

    const options = {
       httpOnly: true,
       expires: expiration
    };

    res.cookie("user", data.user, options);
    res.cookie("token", token, options);

    res.writeHead(200);
  } else {
    res.writeHead(400);
  }
  res.end();
});

app.listen(process.env.APP_PORT, () =>
  console.log(`Listening on port ${process.env.APP_PORT}`)
);
