var pg = require("pg");
var client = new pg.Client(
  "postgres://upmkcdlp:gSVuhBJKvWGJ3x7AGBD7-hCC7WikOjQd@ziggy.db.elephantsql.com:5432/upmkcdlp"
);

client.connect(function (err) {
  if (err) {
    return console.error("could not connect to postgres", err);
  }
  client.query('SELECT NOW() AS "theTime"', function (err, result) {
    if (err) {
      return console.error("error running query", err);
    }
    console.log(result.rows[0].theTime);
    // >> output: 2018-08-23T14:02:57.117Z
  });
});

module.exports = client;
