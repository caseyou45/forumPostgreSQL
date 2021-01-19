const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  password: "Meowmix88**",
  host: "localhost",
  port: 5431,
  database: "forum",
});

module.exports = pool;
