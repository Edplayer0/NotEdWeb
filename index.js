require("dotenv").config({ quiet: true });

const crypto = require("crypto");
const express = require("express");
const cookieParser = require("cookie-parser");

const auth = require("./auth");
const db = require("./db-manager");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

app.get("/", auth.verifyToken, async (req, res) => {
  const notes = await db.getNotes(req.cookies.user);
  res.render("index", { account: true, notes });
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/features", (req, res) => {
  res.render("index", { account: false });
});

app.get("/editor", (req, res) => {
  res.render("editor");
});

app.post("/signin", async (req, res) => {
  const data = req.body;
  const authenticated = await auth.verifyUser(data);

  if (authenticated) {
    const expiration = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
    const token = crypto.randomBytes(32).toString("hex");

    await db.setSession(data.user, token, expiration);

    const options = {
      httpOnly: true,
      expires: expiration,
      sameSite: "lax",
    };

    res.cookie("user", data.user, options);
    res.cookie("token", token, options);

    return res.sendStatus(200);
  }

  return res.sendStatus(400);
});

app.post("/signup", async (req, res) => {
  const data = req.body;
  const result = await auth.createUser(data);

  if (result) return res.render("new-account-success");
  return res.render("new-account-error");
});

app.listen(process.env.APP_PORT, () =>
  console.log(`Listening on port ${process.env.APP_PORT}`)
);
