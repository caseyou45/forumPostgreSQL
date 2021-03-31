const voteRouter = require("express").Router();
const pool = require("../db");
const client = require("../elephantsql");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const getTokenFrom = (request) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    return authorization.substring(7);
  }
  return null;
};

// Get All Votes

voteRouter.get("/", async (req, res) => {
  try {
    const comments = await pool.query("SELECT * FROM votes");
    res.json(comments.rows);
  } catch (error) {
    console.error(error);
  }
});

// Get All Users's Votes on a Article

voteRouter.get("/articles/:pid/user/:uid", async (req, res) => {
  const { pid, uid } = req.params;
  try {
    const comments = await pool.query(
      "SELECT * FROM votes WHERE votes.articles_id = $1 AND votes.author = $2 ",
      [pid, uid]
    );
    res.json(comments.rows);
  } catch (error) {
    console.error(error);
  }
});

// Get All Votes on an Article

voteRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const comments = await pool.query(
      "SELECT * FROM votes WHERE votes.articles_id = $1",
      [id]
    );
    res.json(comments.rows);
  } catch (error) {
    console.error(error);
  }
});

// Create a Vote

voteRouter.post("/", async (req, res) => {
  const token = getTokenFrom(req);
  const decodedToken = jwt.verify(token, process.env.SECRET);

  try {
    const { articles_id, comments_id, author, vote } = req.body;
    const date = new Date();
    const newComment = await pool.query(
      "INSERT INTO votes ( articles_id, comments_id, author, date, vote) VALUES($1, $2, $3, $4, $5) RETURNING *",
      [articles_id, comments_id, author, date, vote]
    );

    res.json(newComment.rows);
  } catch (error) {
    next(error);
  }
});

// Delete a Vote

voteRouter.delete("/:id", async (req, res) => {
  const token = getTokenFrom(req);
  const decodedToken = jwt.verify(token, process.env.SECRET);

  try {
    const { id } = req.params;

    const newComment = await pool.query(
      "DELETE FROM votes WHERE votes_id = $1 RETURNING *",
      [id]
    );

    res.json(newComment.rows);
  } catch (error) {
    next(error);
  }
});

// Edit a Vote's Vote

voteRouter.patch("/edit/:id", async (req, res) => {
  const { id } = req.params;
  const { vote } = req.body;
  try {
    const comments = await pool.query(
      "UPDATE votes SET vote=$1 WHERE votes_id=$2 RETURNING *",
      [vote, id]
    );
    res.json(comments.rows[0]);
  } catch (error) {
    console.error(error);
  }
});

module.exports = voteRouter;
