const postRouter = require("express").Router();
const pool = require("../db");

// Create a post

postRouter.post("/", async (req, res) => {
  try {
    const { content, author } = req.body;
    const date = new Date();

    const newPost = await pool.query(
      "INSERT INTO posts (content, date, author) VALUES($1, $2, $3) RETURNING *",
      [content, date, author]
    );

    res.json(newPost.rows);
  } catch (error) {
    console.log(error);
  }
});

// Get All Posts

postRouter.get("/", async (req, res) => {
  try {
    const posts = await pool.query("SELECT * FROM posts");

    res.json(posts.rows);
  } catch (error) {
    console.log(error);
  }
});

// Get All Posts with User Details

postRouter.get("/users", async (req, res) => {
  try {
    const posts = await pool.query(
      "SELECT * FROM users,posts WHERE posts.author = users.users_id"
    );

    res.json(posts.rows);
  } catch (error) {
    console.log(error);
  }
});

// Get One Post

postRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const post = await pool.query(
      "SELECT * FROM posts, users WHERE posts.posts_id = $1",
      [id]
    );
    res.json(post.rows[0]);
  } catch (error) {
    console.error(error);
  }
});

// Get One Users Posts

postRouter.get("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const posts = await pool.query("SELECT * FROM posts WHERE author = $1", [
      id,
    ]);
    res.json(posts.rows);
  } catch (error) {
    console.error(error);
  }
});

module.exports = postRouter;
