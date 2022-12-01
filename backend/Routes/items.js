const express = require("express");
const router = express.Router();
const pool = require("../database/connection");

//get all listings
router.get("/listings", async function (req, res) {
  pool
    .getConnection()
    .then((conn) => {
      conn.query("SELECT * from listing").then((rows) => {
        res.json(rows);
        conn.end();
      });
    })
    .catch((err) => res.status(400).json("Error " + err));
});

//get listings sorted by date
router.get("/listings/recent", async function (req, res) {
  pool
    .getConnection()
    .then((conn) => {
      conn.query("SELECT * from listing ORDER BY date DESC").then((rows) => {
        res.json(rows);
        conn.end();
      });
    })
    .catch((err) => res.status(400).json("Error " + err));
});

// //get listings sorted by popularity
// router.get("/items/popular", async function (req, res) {
//   pool
//     .getConnection()
//     .then((conn) => {
//       conn
//         .query("SELECT * from items ORDER BY popularity DESC")
//         .then((rows) => {
//           res.json(rows);
//           conn.end();
//         });
//     })
//     .catch((err) => res.status(400).json("Error " + err));
// });

//get items sorted by price (low to high)
router.get("/listings/price-low", async function (req, res) {
  pool
    .getConnection()
    .then((conn) => {
      conn.query("SELECT * from listing ORDER BY price ASC").then((rows) => {
        res.json(rows);
        conn.end();
      });
    })
    .catch((err) => res.status(400).json("Error " + err));
});

//get items sorted by price (high to low)
router.get("/listings/price", async function (req, res) {
  pool
    .getConnection()
    .then((conn) => {
      conn.query("SELECT * from listing ORDER BY price DESC").then((rows) => {
        res.json(rows);
        conn.end();
      });
    })
    .catch((err) => res.status(400).json("Error " + err));
});
