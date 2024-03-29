const { response } = require("express");
const express = require("express");
const router = express.Router();
const pool = require("../database/connection");

const allQuery =
  "SELECT listing.*, users.city, categories.name AS category_name, subcategory.name AS subcategory_name FROM listing LEFT JOIN categories ON listing.category = categories.category_id LEFT JOIN subcategory ON subcategory.subcategory_id = listing.subcategory LEFT JOIN users ON users.user_id = listing.user_id";

//get all listings
router.get("/", async function (req, res) {
  pool
    .getConnection()
    .then((conn) => {
      conn.query(allQuery).then((rows) => {
        res.json(rows);
        conn.end();
      });
    })

    .catch((err) => res.status(400).json("Error " + err));
});

//get listings from a user
router.get("/user/:user_id", async function (req, res) {
  const user_id = req.params.user_id;
  console.log("user: " + user_id);
  pool.getConnection().then((conn) => {
    conn
      .query(
        `SELECT listing.*, users.city, categories.name AS category_name, subcategory.name AS subcategory_name FROM listing LEFT JOIN categories ON listing.category = categories.category_id LEFT JOIN subcategory ON subcategory.subcategory_id = listing.subcategory LEFT JOIN users ON users.user_id = listing.user_id WHERE users.user_id = ${user_id} ORDER BY listing.date DESC`
      )
      .then((rows) => {
        res.json(rows);
        conn.release();
      });
  });
});

router.get("/all", async function (req, res) {
  pool
    .getConnection()
    .then((conn) => {
      conn.query(allQuery).then((rows) => {
        // for (const adv of rows) {
        //   fetch(`http://localhost:3001/${adv.image}`).then((result) => {
        //     const b64 = Buffer.from(result.arrayBuffer()).toString("base64");
        //     adv.productAfbeelding = "data:'image/png;base64," + b64;
        //   });
        // }
        res.json(rows);
        conn.end();
      });
    })
    .catch((err) => res.status(400).json("Error " + err));
});

// router.get("/me", async function (req, res) {
//   const UserID = req.user.id;
//   pool
//     .getConnection()
//     .then((conn) => {
//       conn
//         .query(
//           "SELECT listing.*, users.city, categories.name AS category_name, subcategory.name AS subcategory_name FROM listing LEFT JOIN categories ON listing.category = categories.category_id LEFT JOIN subcategory ON subcategory.subcategory_id = listing.subcategory LEFT JOIN users ON users.user_id = listing.user_id WHERE listing.user_id = ?",
//           UserID
//         )
//         .then((rows) => {
//           res.json(rows);
//           conn.end();
//         });
//     })
//     .catch((err) => res.status(400).json("Error " + err));
// });

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

//get the full liked listings from a user
router.get("/favorites/:user_id", async function (req, res) {
  const user_id = req.params.user_id;
  const this_query = `SELECT listing.*, users.city, categories.name AS category_name, subcategory.name AS subcategory_name FROM listing LEFT JOIN categories ON listing.category = categories.category_id LEFT JOIN subcategory ON subcategory.subcategory_id = listing.subcategory LEFT JOIN users ON users.user_id = listing.user_id LEFT JOIN liked ON liked.listing_id = listing.listing_id WHERE liked.user_id = ${user_id}`;

  pool
    .getConnection()
    .then((conn) => {
      conn.query(this_query).then((rows) => {
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
    const query = `DELETE FROM listing WHERE user_id = ${user_id} AND listing_id = ${listing_id}`;
    pool
      .getConnection()
      .then((conn) => {
        conn.query(query, []).then((rows) => {
          conn.end();
        });
      })
      .catch((err) => res.status(400).json("Error " + err));
  }
);

//delete My listing
router.delete("/my/delete/:user_id/:listing_id", async function (req, res) {
  const user_id = req.params.user_id;
  const listing_id = req.params.listing_id;
  console.log(user_id, listing_id);

  const query = `DELETE FROM listing WHERE user_id = ${user_id} AND listing_id = ${listing_id}`;
  pool
    .getConnection()
    .then((conn) => {
      conn.query(query, [user_id, listing_id]).then((rows) => {
        console.log("ok");
        res.json([]);
        conn.end();
      });
    })
    .catch((err) => {
      console.log(" ere");
      res.status(400).json("Error " + err);
    });
});

router.get("/:listing_id", async function (req, res) {
  pool
    .getConnection()
    .then((conn) => {
      conn
        .query(
          "SELECT listing.*, users.city,users.username, categories.name AS category_name, subcategory.name AS subcategory_name FROM listing LEFT JOIN categories ON listing.category = categories.category_id LEFT JOIN subcategory ON subcategory.subcategory_id = listing.subcategory LEFT JOIN users ON users.user_id = listing.user_id WHERE listing_id = ?",
          req.params.listing_id
        )
        .then((rows) => {
          res.json(rows);
          conn.end();
        });
    })
    .catch((err) => res.status(400).json("Error " + err));
});

module.exports = router;
