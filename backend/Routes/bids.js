const { response } = require("express");
const express = require("express");
const router = express.Router();
const pool = require("../database/connection");

//get bids from a listing
router.get("/:listing_id", async function (req, response) {
  const listing_id = req.params.listing_id;
  pool.getConnection().then((conn) => {
    conn
      .query(
        `SELECT bids.*, users.username AS user FROM bids LEFT JOIN users ON users.user_id = bids.user_id WHERE listing_id = ${listing_id} ORDER BY bids.amount DESC`
      )
      .then((rows) => {
        response.json(rows);
        conn.release();
      })
      .catch((err) => {
        response.json({ message: "Error" });
        conn.release();
      });
  });
});

router.post("/", async function (req, response) {
  const { listing_id, user_id, amount } = req.body;
  pool.getConnection().then((conn) => {
    conn
      .query(
        `INSERT INTO bids (listing_id, user_id, amount, date) VALUES (${listing_id}, ${user_id}, ${amount}, CURRENT_TIMESTAMP())`
      )

      .then((rows) => {
        response.json({ message: "Bid added" });
        conn.release();
      })
      .catch((err) => {
        response.json({ message: err });
        conn.release();
      });
  });
});

module.exports = router;
