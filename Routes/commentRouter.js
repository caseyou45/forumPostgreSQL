const commentRouter = require("express").Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const client = require("../elephantsql");

const getTokenFrom = (request) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    return authorization.substring(7);
  }
  return null;
};

// Get All Comments

commentRouter.get("/", async (req, res) => {
  try {
    const comments = await pool.query("SELECT * FROM comments");
    res.json(comments.rows);
  } catch (error) {
    next(error);
  }
});

// Get All Article's Comments Made By User

commentRouter.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const comments = await pool.query(
      "SELECT * FROM comments, users WHERE comments.author = users.users_id AND comments.parent_article = $1",
      [id]
    );
    res.json(comments.rows);
  } catch (error) {
    next(error);
  }
});

// Get One Article's Comment
// commentRouter.get("/:id", async (req, res) => {
//   const { id } = req.params;

//   try {
//     const comments = await pool.query(
//       "SELECT * FROM comments WHERE comments.parent_article = $1",
//       [id]
//     );
//     res.json(comments.rows);
//   } catch (error) {
//     console.error(error);
//   }
// });

// Create a Comment

commentRouter.post("/", async (req, res, next) => {
  try {
    const token = getTokenFrom(req);
    const decodedToken = jwt.verify(token, process.env.SECRET);

    const parent_comment = req.body.parent_comment || null;
    const { content, author, parent_article } = req.body;
    const date = new Date();
    const newCommentID = await pool.query(
      "INSERT INTO comments (content, date, author, parent_article, parent_comment) VALUES($1, $2, $3, $4, $5) RETURNING comments_id",
      [content, date, author, parent_article, parent_comment]
    );
    const newComment = await pool.query(
      "SELECT * FROM comments, users WHERE comments.author = users.users_id AND comments.comments_id = $1",
      [newCommentID.rows[0].comments_id]
    );
    return res.json(newComment.rows);
  } catch (error) {
    next(error);
  }
});

// Delete a Comment

commentRouter.patch("/delete/:id", async (req, res) => {
  const { id } = req.params;
  const { content, author } = req.body;

  const token = getTokenFrom(req);

  jwt.verify(token, process.env.SECRET);

  try {
    const comments = await pool.query(
      "UPDATE comments SET content=$1, author=$2 WHERE comments_id=$3 RETURNING *",
      [content, author, id]
    );
    res.json(comments.rows[0]);
  } catch (error) {
    next(error);
  }
});

// Edit a Comment's Content

commentRouter.patch("/edit/:id", async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  const token = getTokenFrom(req);

  jwt.verify(token, process.env.SECRET);

  try {
    const comments = await pool.query(
      "UPDATE comments SET content=$1 WHERE comments_id=$2 RETURNING *",
      [content, id]
    );
    res.json(comments.rows[0]);
  } catch (error) {
    next(error);
  }
});

module.exports = commentRouter;
