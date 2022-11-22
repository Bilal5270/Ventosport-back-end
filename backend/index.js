const { text, json } = require("express");
const http = require("http");
const express = require("express");
const mariadb = require("mariadb");
// import "./database/connection";

const pool = mariadb.createPool({
  host: "109.237.211.172",
  user: "test",
  password: "Welk0m",
  connectionLimit: 5,
  database: "Ventosportdb",
});

// const pool = mariadb.createPool({
//   host: "127.0.0.1",
//   user: "root",
//   password: "Ventosport",
//   connectionLimit: 5,
// });

const PORT = process.env.PORT || 3001;

const app = express();

app.get("/api", (req, res) => {
  res.json({ message: "Server is aan!" });
});

app.get("/test", async (req, res) => {
  pool
    .getConnection()
    .then((conn) => {
      conn
        .query("SELECT * from myTable")
        .then((rows) => {
          console.log(rows);
          conn.end();
          return res.end("OK");
        })
        .catch((err) => {
          console.log(err);
          conn.end();
          return res.end("Error");
        });
    })
    .catch((err) => {
      console.log(err);
      return res.end("Error");
    });
});

// app.get("/test", async (req, res) => {
//   let conn;
//   try {
//     conn = pool.getConnection();

//     const rows = await conn.query(`SELECT * from bids`, (err, rows) => {
//       if (err) throw err;
//       console.log("Result: " + result);
//     });

//     const jsonS = JSON.stringify(rows);

//     res.writeHead(200, { "Content-Type": "text/html" });
//     res.end(jsonS);
//     (await conn).end;
//   } catch (e) {
//     const err = {
//       message: e.message,
//       e: e,
//     };
//     res.end(JSON.stringify(err));
//   }
// });

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
