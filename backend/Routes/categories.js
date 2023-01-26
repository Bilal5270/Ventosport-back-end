const e = require("express");
const express = require("express");
const router = express.Router();
const pool = require("../database/connection");

router.get("/", async function (req, res) {
  pool
    .getConnection()
    .then((conn) => {
      conn.query("SELECT * FROM categories").then((rows) => {
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
      conn.query("SELECT category_id, name FROM categories").then((rows) => {
        res.json(rows);
        conn.end();
      });
    })

    .catch((err) => res.status(400).json("Error " + err));
});

router.get("/subcategory", async function (req, res) {
  pool
    .getConnection()
    .then((conn) => {
      conn.query("SELECT * FROM subcategory").then((rows) => {
        res.json(rows);
        conn.end();
      });
    })

    .catch((err) => res.status(400).json("Error " + err));
});

router.get("/sub", async function (req, res) {
  pool
    .getConnection()
    .then((conn) => {
      conn
        .query(
          "SELECT c.name as category_name, s.name as subcategory_name FROM categories c JOIN subcategory s ON c.category_id = s.category_id"
        )
        .then((rows) => {
          res.json(rows);
          conn.end();
        });
    })

    .catch((err) => res.status(400).json("Error " + err));
});

//get the listings from the category id
router.get("/:id", async function (req, res) {
  const category_id = req.params.id;
  console.log(req.params);
  console.log(req.params.id);
  res.setHeader("Content-Type", "application/json");
  if (category_id) {
    pool
      .getConnection()
      .then((conn) => {
        conn
          .query(
            `SELECT listing.*, users.city, categories.name AS category_name, subcategory.name AS subcategory_name FROM listing LEFT JOIN categories ON listing.category = categories.category_id LEFT JOIN subcategory ON subcategory.subcategory_id = listing.subcategory LEFT JOIN users ON users.user_id = listing.user_id WHERE listing.category = ?`,
            req.params.id
          )
          .then((rows) => {
            res.json(rows);
            conn.end();
          });
      })

      .catch((err) => res.status(400).json("Error " + err));
  } else {
    return;
  }
});

//
router.get("/:id/recent", async function (req, res) {
  const category_id = req.params.id;
  res.setHeader("Content-Type", "application/json");
  if (category_id) {
    pool
      .getConnection()
      .then((conn) => {
        conn
          .query(
            `SELECT listing.*, users.city, categories.name AS category_name, subcategory.name AS subcategory_name FROM listing LEFT JOIN categories ON listing.category = categories.category_id LEFT JOIN subcategory ON subcategory.subcategory_id = listing.subcategory LEFT JOIN users ON users.user_id = listing.user_id WHERE listing.category = ? ORDER BY listing.date DESC`,
            req.params.id
          )
          .then((rows) => {
            res.json(rows);
            conn.end();
          });
      })

      .catch((err) => res.status(400).json("Error " + err));
  } else {
    return;
  }
});

router.get("/:id/high-to-low", async function (req, res) {
  const category_id = req.params.id;
  res.setHeader("Content-Type", "application/json");
  if (category_id) {
    pool
      .getConnection()
      .then((conn) => {
        conn
          .query(
            `SELECT listing.*, users.city, categories.name AS category_name, subcategory.name AS subcategory_name FROM listing LEFT JOIN categories ON listing.category = categories.category_id LEFT JOIN subcategory ON subcategory.subcategory_id = listing.subcategory LEFT JOIN users ON users.user_id = listing.user_id WHERE listing.category = ? ORDER BY price DESC`,
            req.params.id
          )
          .then((rows) => {
            res.json(rows);
            conn.end();
          });
      })

      .catch((err) => res.status(400).json("Error " + err));
  } else {
    return;
  }
});

router.get("/:id/low-to-high", async function (req, res) {
  const category_id = req.params.id;
  res.setHeader("Content-Type", "application/json");
  if (category_id) {
    pool
      .getConnection()
      .then((conn) => {
        conn
          .query(
            `SELECT listing.*, users.city, categories.name AS category_name, subcategory.name AS subcategory_name FROM listing LEFT JOIN categories ON listing.category = categories.category_id LEFT JOIN subcategory ON subcategory.subcategory_id = listing.subcategory LEFT JOIN users ON users.user_id = listing.user_id WHERE listing.category = ? ORDER BY price ASC`,
            req.params.id
          )
          .then((rows) => {
            res.json(rows);
            conn.end();
          });
      })

      .catch((err) => res.status(400).json("Error " + err));
  } else {
    return;
  }
});

router.get("/listings/:id", async function (req, res) {
  const category_id = req.params.id;
  res.setHeader("Content-Type", "application/json");
  if (category_id) {
    pool
      .getConnection()
      .then((conn) => {
        conn
          .query(`SELECT * FROM listings WHERE category = ?`, req.params.id)
          .then((rows) => {
            res.json(rows);
            conn.end();
          });
      })

      .catch((err) => res.status(400).json("Error " + err));
  } else {
    return;
  }
});

module.exports = router;
