const express = require("express");
const router = express.Router();
const pool = require("../database/connection");

//get all listings
router.get("/", async function (req, res) {
  pool
    .getConnection()
    .then((conn) => {
      conn
        .query(
          "SELECT listing.*, users.city, categories.name AS category_name, subcategory.name AS subcategory_name FROM listing LEFT JOIN categories ON listing.category = categories.category_id LEFT JOIN subcategory ON subcategory.subcategory_id = listing.subcategory LEFT JOIN users ON users.user_id = listing.user_id"
        )
        .then((rows) => {
          res.json(rows);
          conn.end();
        });
    })

    .catch((err) => res.status(400).json("Error " + err));
});

router.get("/all", async function (req, res) {
  pool
    .getConnection()
    .then((conn) => {
      conn
        .query(
          "SELECT listing.*, users.city, categories.name AS category_name, subcategory.name AS subcategory_name FROM listing LEFT JOIN categories ON listing.category = categories.category_id LEFT JOIN subcategory ON subcategory.subcategory_id = listing.subcategory LEFT JOIN users ON users.user_id = listing.user_id"
        )
        .then((rows) => {
          res.json(rows);
          conn.end();
        });
    })
    .catch((err) => res.status(400).json("Error " + err));
});

router.get("/:listing_id", async function (req, res) {
  pool
    .getConnection()
    .then((conn) => {
      conn
        .query(
          "SELECT listing.*, users.city,users.username, categories.name AS category_name, subcategory.name AS subcategory_name FROM listing LEFT JOIN categories ON listing.category = categories.category_id LEFT JOIN subcategory ON subcategory.subcategory_id = listing.subcategory LEFT JOIN users ON users.user_id = listing.user_id WHERE listing_id = ?",
          req.params["listing_id"]
        )
        .then((rows) => {
          res.json(rows);
          conn.end();
        });
    })
    .catch((err) => res.status(400).json("Error " + err));
});

//get listings sorted by date
router.get("/recent", async function (req, res) {
  pool
    .getConnection()
    .then((conn) => {
      conn
        .query(
          "SELECT listing.*, users.city, categories.name AS category_name, subcategory.name AS subcategory_name FROM listing LEFT JOIN categories ON listing.category = categories.category_id LEFT JOIN subcategory ON subcategory.subcategory_id = listing.subcategory LEFT JOIN users ON users.user_id = listing.user_id ORDER BY listing.date DESC"
        )
        .then((rows) => {
          res.json(rows);
          conn.end();
        });
    })
    .catch((err) => res.status(400).json("Error " + err));
});

router.get("/cities", async function (req, res) {
  pool.getConnection().then((conn) => {
    conn.query("SELECT city from users").then((rows) => {
      res.json(rows);
      conn.end();
    });
  });
});

//get items sorted by price (low to high)
router.get("/low-to-high", async function (req, res) {
  pool
    .getConnection()
    .then((conn) => {
      conn
        .query(
          "SELECT listing.*, users.city, categories.name AS category_name, subcategory.name AS subcategory_name FROM listing LEFT JOIN categories ON listing.category = categories.category_id LEFT JOIN subcategory ON subcategory.subcategory_id = listing.subcategory LEFT JOIN users ON users.user_id = listing.user_id ORDER BY price ASC"
        )
        .then((rows) => {
          res.json(rows);
          conn.end();
        });
    })
    .catch((err) => res.status(400).json("Error " + err));
});

// //get items sorted by price (high to low)
router.get("/high-to-low", async function (req, res) {
  pool
    .getConnection()
    .then((conn) => {
      conn
        .query(
          "SELECT listing.*, users.city, categories.name AS category_name, subcategory.name AS subcategory_name FROM listing LEFT JOIN categories ON listing.category = categories.category_id LEFT JOIN subcategory ON subcategory.subcategory_id = listing.subcategory LEFT JOIN users ON users.user_id = listing.user_id ORDER BY price DESC"
        )
        .then((rows) => {
          res.json(rows);
          conn.end();
        });
    })
    .catch((err) => res.status(400).json("Error " + err));
});

router.get("/favorites/user/:user_id", async function (req, res) {
  pool
    .getConnection()
    .then((conn) => {
      conn
        .query(
          "SELECT * FROM liked WHERE liked.user_id = ?",
          req.params.user_id
        )
        .then((rows) => {
          res.json(rows);
          conn.end();
        });
    })
    .catch((err) => res.status(400).json("Error " + err));
});

//get a specific liked listing
router.get("/favorites/:user_id/:listing_id", async function (req, res) {
  const { user_id, listing_id } = req.params;
  pool
    .getConnection()
    .then((conn) => {
      conn
        .query(
          "SELECT * FROM liked WHERE user_id = ? AND listing_id = ?",
          [user_id, listing_id],
          (err, rows) => {
            if (err) {
              res.status(400).json("Error " + err);
            } else {
              res.json(rows);
            }
          }
        )
        .then((rows) => {
          res.json(rows);
          conn.end();
        });
    })
    .catch((err) => res.status(400).json("Error " + err));
});

// add a favorite listing to an user
router.post("/favorites/add", async function (req, res) {
  const { user_id, listing_id } = req.body;
  pool
    .getConnection()
    .then((conn) => {
      conn
        .query(
          `INSERT INTO liked (user_id, listing_id) VALUES (${user_id}, ${listing_id})`
        )
        .then(conn.end());
    })
    .catch((err) => res.status(400).json("Error " + err));
});

//delete a liked listing
router.delete(
  "/favorites/delete/:user_id/:listing_id",
  async function (req, res) {
    const user_id = req.params.user_id;
    const listing_id = req.params.listing_id;
    const query = `DELETE FROM liked WHERE user_id = ${user_id} AND listing_id = ${listing_id}`;
    pool
      .getConnection()
      .then((conn) => {
        conn.query(query, [user_id, listing_id]).then((rows) => {
          conn.end();
        });
      })
      .catch((err) => res.status(400).json("Error " + err));
  }
);

module.exports = router;
