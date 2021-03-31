const userRouter = require("express").Router();
const pool = require("../db");
const client = require("../elephantsql");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Get all Users
userRouter.get("/", async (req, res) => {
  try {
    const users = await pool.query("SELECT * FROM users");
    res.json(users.rows);
  } catch (error) {
    console.error(error);
  }
});

// Create a User

userRouter.post("/signup", async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const newUser = await pool.query(
      "INSERT INTO users (username, password, email) VALUES($1, $2, $3) RETURNING *",
      [username, passwordHash, email]
    );

    const userForToken = {
      username: newUser.rows[0].username,
      id: newUser.rows[0].users_id,
    };

    let token;

    if (username.startsWith("burner-")) {
      token = jwt.sign(userForToken, process.env.SECRET, {
        expiresIn: "2m",
      });
    } else {
      token = jwt.sign(userForToken, process.env.SECRET);
    }

    res.json({
      token,
      username: newUser.rows[0].username,
      users_id: newUser.rows[0].users_id,
    });
  } catch (error) {
    res.json(error);
  }
});

// Login

userRouter.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);

    if (user.rows.length === 0) {
      res.json({
        error: "Invalid Username",
      });
    }

    const passwordCorrect =
      user === null
        ? false
        : await bcrypt.compare(password, user.rows[0].password);

    // if (!passwordCorrect) {
    //   return res.status(401).json({
    //     error: "Invalid Password",
    //   });
    // }

    if (!passwordCorrect) {
      res.json({
        error: "Invalid Password",
      });
    }

    const userForToken = {
      username: user.rows[0].username,
      id: user.rows[0].users_id,
    };
    const token = jwt.sign(userForToken, process.env.SECRET);

    res.json({
      token,
      username: user.rows[0].username,
      users_id: user.rows[0].users_id,
    });
  } catch (error) {
    res.json(error);
  }
});

module.exports = userRouter;
