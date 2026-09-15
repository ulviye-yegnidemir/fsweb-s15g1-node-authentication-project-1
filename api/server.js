const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const session = require("express-session");

const authRouter = require("./auth/auth-router");
const usersRouter = require("./users/users-router");

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

server.use(
  session({
    name: "cikolatacips",
    secret: "gizli oturum anahtari",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60,
      secure: false,
      httpOnly: true,
    },
  })
);

server.get("/", (req, res) => {
  res.json({ api: "up" });
});

server.use("/api/auth", authRouter);
server.use("/api/users", usersRouter);

server.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message,
    stack: err.stack,
  });
});

module.exports = server;