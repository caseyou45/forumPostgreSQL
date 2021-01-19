const commentRouter = require("express").Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Get All Comments

commentRouter.get("/", async (req, res) => {
  try {
    const comments = await pool.query("SELECT * FROM comments");
    res.json(comments.rows);
  } catch (error) {
    console.error(error);
  }
});

// Get All Post's Comments

commentRouter.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const comments = await pool.query(
      "SELECT * FROM comments, users WHERE comments.author = users.users_id AND comments.parent_post = $1",
      [id]
    );
    res.json(comments.rows);
  } catch (error) {
    console.error(error);
  }
});

// Create a Comment

commentRouter.post("/", async (req, res) => {
  try {
    const parent_comment = req.body.parent_comment || null;

    const { content, author, parent_post } = req.body;
    const date = new Date();
    const newComment = await pool.query(
      "INSERT INTO comments (content, date, author, parent_post, parent_comment) VALUES($1, $2, $3, $4, $5) RETURNING *",
      [content, date, author, parent_post, parent_comment]
    );

    res.json(newComment.rows);
  } catch (error) {
    console.log(error);
  }
});

// Delete a Comment

commentRouter.patch("/delete/:id", async (req, res) => {
  const { id } = req.params;
  const { content, author } = req.body;
  try {
    const comments = await pool.query(
      "UPDATE comments SET content=$1, author=$2 WHERE comments_id=$3 RETURNING *",
      [content, author, id]
    );
    res.json(comments.rows[0]);
  } catch (error) {
    console.error(error);
  }
});

// Edit a Comment's Content

commentRouter.patch("/edit/:id", async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  try {
    const comments = await pool.query(
      "UPDATE comments SET content=$1 WHERE comments_id=$2 RETURNING *",
      [content, id]
    );
    res.json(comments.rows[0]);
  } catch (error) {
    console.error(error);
  }
});

module.exports = commentRouter;
