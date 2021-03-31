const articleRouter = require("express").Router();
const pool = require("../db");
const client = require("../elephantsql");

// Create an Article

articleRouter.post("/", async (req, res) => {
  let articles = req.body;
  let newArticles = [];

  const postPromies = async (article) => {
    await pool.query(
      // "INSERT INTO articles (id, name, author, title, description, url, urlToImage, publishedAt, content) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
      "INSERT INTO articles (id, name, author, title, description, url, urlToImage, publishedAt, content) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) ON CONFLICT DO NOTHING RETURNING *",

      [
        article.source.id,
        article.source.name,
        article.author,
        article.title,
        article.description,
        article.url,
        article.urlToImage,
        article.publishedAt,
        article.content,
      ]
    );
  };

  let promises = articles.map((article) => {
    return pool
      .query(
        // "INSERT INTO articles (id, name, author, title, description, url, urlToImage, publishedAt, content) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
        "INSERT INTO articles (id, name, author, title, description, url, urlToImage, publishedAt, content) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) ON CONFLICT DO NOTHING RETURNING *",

        [
          article.source.id,
          article.source.name,
          article.author,
          article.title,
          article.description,
          article.url,
          article.urlToImage,
          article.publishedAt,
          article.content,
        ]
      )
      .then((results) => {
        return results.rows[0];
      });
  });
  Promise.all(promises).then((results) => {
    res.json(results);
  });

  // articles.map((el) => {
  //   let x = postPromies(el);
  //   newArticles.push(x);
  // });

  // Promise.all(newArticles).then((response) => {
  //   console.log(response);
  // });
});

// Get All Articles

articleRouter.get("/", async (req, res) => {
  try {
    const articles = await pool.query(
      "SELECT * FROM articles ORDER BY publishedat DESC"
    );

    res.json(articles.rows);
  } catch (error) {
    console.log(error);
  }
});

// Get All Articles by Date

articleRouter.get("/date/:id", async (req, res) => {
  let { id } = req.params;
  try {
    const articles = await pool.query(
      "SELECT * FROM articles WHERE publishedat = $1",
      [id]
    );

    res.json(articles.rows);
  } catch (error) {
    console.log(error);
  }
});

// Get All Articles with User Details

articleRouter.get("/users", async (req, res) => {
  try {
    const articles = await pool.query(
      "SELECT * FROM users, articles WHERE articles.author = users.users_id"
    );

    res.json(articles.rows);
  } catch (error) {
    console.log(error);
  }
});

// Get One Article

articleRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const article = await pool.query(
      "SELECT * FROM articles WHERE articles_id = $1",
      [id]
    );
    res.json(article.rows[0]);
  } catch (error) {
    console.error(error);
  }
});

// Get One User's Articles

articleRouter.get("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const articles = await pool.query(
      "SELECT * FROM articles WHERE author = $1",
      [id]
    );
    res.json(articles.rows);
  } catch (error) {
    console.error(error);
  }
});

module.exports = articleRouter;
