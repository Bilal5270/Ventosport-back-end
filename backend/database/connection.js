const mariadb = require("mariadb");

const pool = mariadb.createPool({
  host: "109.237.211.172",
  user: "test",
  password: "Welk0m",
  connectionLimit: 20,
  database: "Ventosportdb",
});

module.exports = pool;
