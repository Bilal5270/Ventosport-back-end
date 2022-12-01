const express = require("express");
const router = express.Router();
const pool = require("../database/connection");

//get all items
router.get("/items", async function (req, res) {
  pool
    .getConnection()
    .then((conn) => {
      conn.query("SELECT * from items").then((rows) => {
        res.json(rows);
        conn.end();
      });
    })
    .catch((err) => res.status(400).json("Error " + err));
});

//get items sorted by date
router.get("/items/recent", async function (req, res) {
  pool
    .getConnection()
    .then((conn) => {
      conn
        .query("SELECT * from items ORDER BY date_added DESC")
        .then((rows) => {
          res.json(rows);
          conn.end();
        });
    })
    .catch((err) => res.status(400).json("Error " + err));
});

//get items sorted by popularity
router.get("/items/popular", async function (req, res) {
  pool
    .getConnection()
    .then((conn) => {
      conn
        .query("SELECT * from items ORDER BY popularity DESC")
        .then((rows) => {
          res.json(rows);
          conn.end();
        });
    })
    .catch((err) => res.status(400).json("Error " + err));
});

//get items sorted by price (low to high)
router.get("/items/price-low", async function (req, res) {
  pool
    .getConnection()
    .then((conn) => {
      conn.query("SELECT * from items ORDER BY price ASC").then((rows) => {
        res.json(rows);
        conn.end();
      });
    })
    .catch((err) => res.status(400).json("Error " + err));
});

//get items sorted by price (high to low)
router.get("/items/price", async function (req, res) {
  pool
    .getConnection()
    .then((conn) => {
      conn.query("SELECT * from items ORDER BY price DESC").then((rows) => {
        res.json(rows);
        conn.end();
      });
    })
    .catch((err) => res.status(400).json("Error " + err));
});
