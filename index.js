const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();

const cors = require("cors");

const pool = require("./db");
// const { response } = require("express");

const postRouter = require("./Routes/postRouter");
const userRouter = require("./Routes/userRouter");
const commentRouter = require("./Routes/commentRouter");
const voteRouter = require("./Routes/voteRouter");

// middleware
app.use(cors());
app.use(express.json());

app.use("/api/posts", postRouter);
app.use("/api/users", userRouter);
app.use("/api/comments", commentRouter);
app.use("/api/votes", voteRouter);

// Routes

app.listen(5000, function () {
  console.log("server is running on port 5000");
});
