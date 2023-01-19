const express = require("express");
const router = express.Router();
const multer = require("multer");
const pool = require("../database/connection");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "uploads/");
  },
  filename: (req, file, callback) => {
    callback(null, `image-${Date.now()}.${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
});

router.post("/", upload.single("image"), async function (req, res) {
  const user = req.body.user_id;
  const title = req.body.title;
  const description = req.body.description;
  const state = req.body.state;
  const category = req.body.category;
  const subcategory = req.body.subcategory;
  const bid = req.body.bid;
  const price = req.body.price;
  const image = req.file;
  const status = req.body.status;

  console.log(req.file);

  pool
    .getConnection()
    .then((conn) => {
      conn
        .query(
          `INSERT INTO listing (user_id, title, description, state, category, subcategory, bid, price, image, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            user,
            title,
            description,
            state,
            category,
            subcategory,
            bid,
            price,
            image,
            status,
          ]
        )
        .then(() => {
          res.json({
            message: "NEW AD",
            cookie: user,
          });
          conn.end();
        })
        .catch((err) =>
          res.status(400).json({
            message: "Error: " + err,
          })
        );
    })
    .catch((err) =>
      res.status(400).json({
        message: "Error: " + err,
      })
    );
});

router.get("/categories", async function (req, res) {
  pool
    .getConnection()

    .then((conn) => {
      conn
        .query(`SELECT name, category_id AS id FROM categories`)

        .then((rows) => {
          res.json(rows);
          conn.end();
        })
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

router.get("/subcategories/:id", async function (req, res) {
  pool
    .getConnection()
    .then((conn) => {
      conn
        .query(
          `SELECT name, subcategory_id AS id FROM subcategory WHERE category_id = ?`,
          req.params["id"]
        )
        .then((rows) => {
          res.json(rows);
          conn.end();
        })
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
