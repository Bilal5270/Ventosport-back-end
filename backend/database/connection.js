const mariadb = require("mariadb");

const pool = mariadb.createPool({
  host: "109.237.211.172",
  user: "test",
  password: "Welkom",
  connectionLimit: 5,
  database: "Ventosportdb",
});


pool
  .getConnection()
  .then((conn) => {
    conn
      .query("SELECT 1 as val")
      .then((rows) => {
        console.log(rows); //[ {val: 1}, meta: ... ]

        return conn.query("INSERT INTO myTable value (?, ?)", [1, "mariadb"]);
      })
      .then((res) => {
        console.log(res); // { affectedRows: 1, insertId: 1, warningStatus: 0 }
        conn.end();
      })
      .catch((err) => {
        //handle error
        console.log(err);
        conn.end();
      });
  })
  .catch((err) => {
    //not connected
  });

async function asyncFunction() {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query("SELECT 1 as val");
    console.log(rows); //[ {val: 1}, meta: ... ]
    const res = await conn.query("INSERT INTO myTable value (?, ?)", [
      1,
      "mariadb",
    ]);
    console.log(res); // { affectedRows: 1, insertId: 1, warningStatus: 0 }
  } catch (err) {
    throw err;
  } finally {
    if (conn) return conn.end();
  }
}

function asyncFunction();

async function asyncFunction() {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query("SELECT 1 as val");
    console.log(rows); //[ {val: 1}, meta: ... ]
    const res = await conn.query("INSERT INTO myTable value (?, ?)", [
      1,
      "mariadb",
    ]);
    console.log(res); // { affectedRows: 1, insertId: 1, warningStatus: 0 }
  } catch (err) {
    throw err;
  } finally {
    if (conn) return conn.end();
  }
}
