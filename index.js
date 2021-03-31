const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
require("express-async-errors");
const app = express();

const cors = require("cors");

const pool = require("./db");
// const { response } = require("express");

const postRouter = require("./Routes/postRouter");
const userRouter = require("./Routes/userRouter");
const commentRouter = require("./Routes/commentRouter");
const voteRouter = require("./Routes/voteRouter");
const articleRouter = require("./Routes/articleRouter");

// middleware
app.use(cors());
app.use(express.json());

app.use("/api/posts", postRouter);
app.use("/api/users", userRouter);
app.use("/api/comments", commentRouter);
app.use("/api/articles", articleRouter);
app.use("/api/votes", voteRouter);

// Error Handling

app.use(function (error, req, res, next) {
  console.log(error.name);
  if (error.name === "TokenExpiredError") {
    return res.status(401).send({ error: "Burner Account Has Expired" });
  } else if (error.name === "JsonWebTokenError") {
    return res
      .status(401)
      .send({ error: "Couldn't Verify User. Please Log In." });
  } else {
    return res.status(500).send({ error: "Something broke!" });
  }
});

// Routes

app.listen(5000, function () {
  console.log("server is running on port 5000");
});
