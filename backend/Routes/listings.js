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
          "SELECT listing.*, users.city, categories.name AS category_name, subcategory.name AS subcategory_name FROM listing INNER JOIN categories ON listing.category = categories.category_id INNER JOIN subcategory ON subcategory.subcategory_id = listing.subcategory INNER JOIN users ON users.user_id = listing.user_id"
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
          "SELECT listing.*, users.city, categories.name AS category_name, subcategory.name AS subcategory_name FROM listing INNER JOIN categories ON listing.category = categories.category_id INNER JOIN subcategory ON subcategory.subcategory_id = listing.subcategory INNER JOIN users ON users.user_id = listing.user_id"
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
          "SELECT listing.*, users.city, categories.name AS category_name, subcategory.name AS subcategory_name FROM listing INNER JOIN categories ON listing.category = categories.category_id INNER JOIN subcategory ON subcategory.subcategory_id = listing.subcategory INNER JOIN users ON users.user_id = listing.user_id ORDER BY listing.date DESC"
        )
        .then((rows) => {
          res.json(rows);
          conn.end();
        });
    })
    .catch((err) => res.status(400).json("Error " + err));
});

//get items sorted by price (low to high)
router.get("/low-to-high", async function (req, res) {
  pool
    .getConnection()
    .then((conn) => {
      conn
        .query(
          "SELECT listing.*, users.city, categories.name AS category_name, subcategory.name AS subcategory_name FROM listing INNER JOIN categories ON listing.category = categories.category_id INNER JOIN subcategory ON subcategory.subcategory_id = listing.subcategory INNER JOIN users ON users.user_id = listing.user_id ORDER BY price ASC"
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
          "SELECT listing.*, users.city, categories.name AS category_name, subcategory.name AS subcategory_name FROM listing INNER JOIN categories ON listing.category = categories.category_id INNER JOIN subcategory ON subcategory.subcategory_id = listing.subcategory INNER JOIN users ON users.user_id = listing.user_id ORDER BY price DESC"
        )
        .then((rows) => {
          res.json(rows);
          conn.end();
        });
    })
    .catch((err) => res.status(400).json("Error " + err));
});

module.exports = router;
