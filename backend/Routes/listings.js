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

//Golfsurfen category3
router.get("/golfsurfen", async function (req, res) {
  pool
    .getConnection()
    .then((conn) => {
      conn.query("SELECT * FROM listing WHERE category = 3;").then((rows) => {
        res.json(rows);
        conn.end();
      });
    })
    .catch((err) => res.status(400).json("Error " + err));
});
router.get("/golfrecent", async function (req, res) {
  pool
    .getConnection()
    .then((conn) => {
      conn
        .query(
          "SELECT listing.*, users.city, categories.name AS category_name, subcategory.name AS subcategory_name FROM listing LEFT JOIN categories ON listing.category = categories.category_id LEFT JOIN subcategory ON subcategory.subcategory_id = listing.subcategory LEFT JOIN users ON users.user_id = listing.user_id WHERE listing.category = 3 ORDER BY listing.date DESC"
        )
        .then((rows) => {
          res.json(rows);
          conn.end();
        });
    })
    .catch((err) => res.status(400).json("Error " + err));
});
router.get("/golfhigh-to-low", async function (req, res) {
  pool
    .getConnection()
    .then((conn) => {
      conn
        .query(
          "SELECT listing.*, users.city, categories.name AS category_name, subcategory.name AS subcategory_name FROM listing LEFT JOIN categories ON listing.category = categories.category_id LEFT JOIN subcategory ON subcategory.subcategory_id = listing.subcategory LEFT JOIN users ON users.user_id = listing.user_id WHERE listing.category = 3 ORDER BY price DESC"
        )
        .then((rows) => {
          res.json(rows);
          conn.end();
        });
    })
    .catch((err) => res.status(400).json("Error " + err));
});
router.get("/golflow-to-high", async function (req, res) {
  pool
    .getConnection()
    .then((conn) => {
      conn
        .query(
          "SELECT listing.*, users.city, categories.name AS category_name, subcategory.name AS subcategory_name FROM listing LEFT JOIN categories ON listing.category = categories.category_id LEFT JOIN subcategory ON subcategory.subcategory_id = listing.subcategory LEFT JOIN users ON users.user_id = listing.user_id WHERE listing.category = 3 ORDER BY price ASC"
        )
        .then((rows) => {
          res.json(rows);
          conn.end();
        });
    })
    .catch((err) => res.status(400).json("Error " + err));
});

//Kitesurfen category2
router.get("/kitesurfen", async function (req, res) {
  pool
    .getConnection()
    .then((conn) => {
      conn.query("SELECT * FROM listing WHERE category = 2;").then((rows) => {
        res.json(rows);
        conn.end();
      });
    })
    .catch((err) => res.status(400).json("Error " + err));
});
router.get("/kiterecent", async function (req, res) {
  pool
    .getConnection()
    .then((conn) => {
      conn
        .query(
          "SELECT listing.*, users.city, categories.name AS category_name, subcategory.name AS subcategory_name FROM listing LEFT JOIN categories ON listing.category = categories.category_id LEFT JOIN subcategory ON subcategory.subcategory_id = listing.subcategory LEFT JOIN users ON users.user_id = listing.user_id WHERE listing.category = 2 ORDER BY listing.date DESC"
        )
        .then((rows) => {
          res.json(rows);
          conn.end();
        });
    })
    .catch((err) => res.status(400).json("Error " + err));
});
router.get("/kitehigh-to-low", async function (req, res) {
  pool
    .getConnection()
    .then((conn) => {
      conn
        .query(
          "SELECT listing.*, users.city, categories.name AS category_name, subcategory.name AS subcategory_name FROM listing LEFT JOIN categories ON listing.category = categories.category_id LEFT JOIN subcategory ON subcategory.subcategory_id = listing.subcategory LEFT JOIN users ON users.user_id = listing.user_id WHERE listing.category = 2 ORDER BY price DESC"
        )
        .then((rows) => {
          res.json(rows);
          conn.end();
        });
    })
    .catch((err) => res.status(400).json("Error " + err));
});
router.get("/kitelow-to-high", async function (req, res) {
  pool
    .getConnection()
    .then((conn) => {
      conn
        .query(
          "SELECT listing.*, users.city, categories.name AS category_name, subcategory.name AS subcategory_name FROM listing LEFT JOIN categories ON listing.category = categories.category_id LEFT JOIN subcategory ON subcategory.subcategory_id = listing.subcategory LEFT JOIN users ON users.user_id = listing.user_id WHERE listing.category = 2 ORDER BY price ASC"
        )
        .then((rows) => {
          res.json(rows);
          conn.end();
        });
    })
    .catch((err) => res.status(400).json("Error " + err));
});

//Windsurfen category1
router.get("/windsurfen", async function (req, res) {
  pool
    .getConnection()
    .then((conn) => {
      conn.query("SELECT * FROM listing WHERE category = 1;").then((rows) => {
        res.json(rows);
        conn.end();
      });
    })
    .catch((err) => res.status(400).json("Error " + err));
});
router.get("/windrecent", async function (req, res) {
  pool
    .getConnection()
    .then((conn) => {
      conn
        .query(
          "SELECT listing.*, users.city, categories.name AS category_name, subcategory.name AS subcategory_name FROM listing LEFT JOIN categories ON listing.category = categories.category_id LEFT JOIN subcategory ON subcategory.subcategory_id = listing.subcategory LEFT JOIN users ON users.user_id = listing.user_id WHERE listing.category = 1 ORDER BY listing.date DESC"
        )
        .then((rows) => {
          res.json(rows);
          conn.end();
        });
    })
    .catch((err) => res.status(400).json("Error " + err));
});
router.get("/windhigh-to-low", async function (req, res) {
  pool
    .getConnection()
    .then((conn) => {
      conn
        .query(
          "SELECT listing.*, users.city, categories.name AS category_name, subcategory.name AS subcategory_name FROM listing LEFT JOIN categories ON listing.category = categories.category_id LEFT JOIN subcategory ON subcategory.subcategory_id = listing.subcategory LEFT JOIN users ON users.user_id = listing.user_id WHERE listing.category = 1 ORDER BY price DESC"
        )
        .then((rows) => {
          res.json(rows);
          conn.end();
        });
    })
    .catch((err) => res.status(400).json("Error " + err));
});
router.get("/windlow-to-high", async function (req, res) {
  pool
    .getConnection()
    .then((conn) => {
      conn
        .query(
          "SELECT listing.*, users.city, categories.name AS category_name, subcategory.name AS subcategory_name FROM listing LEFT JOIN categories ON listing.category = categories.category_id LEFT JOIN subcategory ON subcategory.subcategory_id = listing.subcategory LEFT JOIN users ON users.user_id = listing.user_id WHERE listing.category = 1 ORDER BY price ASC"
        )
        .then((rows) => {
          res.json(rows);
          conn.end();
        });
    })
    .catch((err) => res.status(400).json("Error " + err));
});

//Overig category5
router.get("/overig", async function (req, res) {
  pool
    .getConnection()
    .then((conn) => {
      conn.query("SELECT * FROM listing WHERE category = 5;").then((rows) => {
        res.json(rows);
        conn.end();
      });
    })
    .catch((err) => res.status(400).json("Error " + err));
});
router.get("/overigrecent", async function (req, res) {
  pool
    .getConnection()
    .then((conn) => {
      conn
        .query(
          "SELECT listing.*, users.city, categories.name AS category_name, subcategory.name AS subcategory_name FROM listing LEFT JOIN categories ON listing.category = categories.category_id LEFT JOIN subcategory ON subcategory.subcategory_id = listing.subcategory LEFT JOIN users ON users.user_id = listing.user_id WHERE listing.category = 5 ORDER BY listing.date DESC"
        )
        .then((rows) => {
          res.json(rows);
          conn.end();
        });
    })
    .catch((err) => res.status(400).json("Error " + err));
});
router.get("/overighigh-to-low", async function (req, res) {
  pool
    .getConnection()
    .then((conn) => {
      conn
        .query(
          "SELECT listing.*, users.city, categories.name AS category_name, subcategory.name AS subcategory_name FROM listing LEFT JOIN categories ON listing.category = categories.category_id LEFT JOIN subcategory ON subcategory.subcategory_id = listing.subcategory LEFT JOIN users ON users.user_id = listing.user_id WHERE listing.category = 5 ORDER BY price DESC"
        )
        .then((rows) => {
          res.json(rows);
          conn.end();
        });
    })
    .catch((err) => res.status(400).json("Error " + err));
});
router.get("/overiglow-to-high", async function (req, res) {
  pool
    .getConnection()
    .then((conn) => {
      conn
        .query(
          "SELECT listing.*, users.city, categories.name AS category_name, subcategory.name AS subcategory_name FROM listing LEFT JOIN categories ON listing.category = categories.category_id LEFT JOIN subcategory ON subcategory.subcategory_id = listing.subcategory LEFT JOIN users ON users.user_id = listing.user_id WHERE listing.category = 5 ORDER BY price ASC"
        )
        .then((rows) => {
          res.json(rows);
          conn.end();
        });
    })
    .catch((err) => res.status(400).json("Error " + err));
});

//Kleding category4
router.get("/kleding", async function (req, res) {
  pool
    .getConnection()
    .then((conn) => {
      conn.query("SELECT * FROM listing WHERE category = 4;").then((rows) => {
        res.json(rows);
        conn.end();
      });
    })
    .catch((err) => res.status(400).json("Error " + err));
});
router.get("/kledingrecent", async function (req, res) {
  pool
    .getConnection()
    .then((conn) => {
      conn
        .query(
          "SELECT listing.*, users.city, categories.name AS category_name, subcategory.name AS subcategory_name FROM listing LEFT JOIN categories ON listing.category = categories.category_id LEFT JOIN subcategory ON subcategory.subcategory_id = listing.subcategory LEFT JOIN users ON users.user_id = listing.user_id WHERE listing.category = 4 ORDER BY listing.date DESC"
        )
        .then((rows) => {
          res.json(rows);
          conn.end();
        });
    })
    .catch((err) => res.status(400).json("Error " + err));
});
router.get("/kledinghigh-to-low", async function (req, res) {
  pool
    .getConnection()
    .then((conn) => {
      conn
        .query(
          "SELECT listing.*, users.city, categories.name AS category_name, subcategory.name AS subcategory_name FROM listing LEFT JOIN categories ON listing.category = categories.category_id LEFT JOIN subcategory ON subcategory.subcategory_id = listing.subcategory LEFT JOIN users ON users.user_id = listing.user_id WHERE listing.category = 4 ORDER BY price DESC"
        )
        .then((rows) => {
          res.json(rows);
          conn.end();
        });
    })
    .catch((err) => res.status(400).json("Error " + err));
});
router.get("/kledinglow-to-high", async function (req, res) {
  pool
    .getConnection()
    .then((conn) => {
      conn
        .query(
          "SELECT listing.*, users.city, categories.name AS category_name, subcategory.name AS subcategory_name FROM listing LEFT JOIN categories ON listing.category = categories.category_id LEFT JOIN subcategory ON subcategory.subcategory_id = listing.subcategory LEFT JOIN users ON users.user_id = listing.user_id WHERE listing.category = 4 ORDER BY price ASC"
        )
        .then((rows) => {
          res.json(rows);
          conn.end();
        });
    })
    .catch((err) => res.status(400).json("Error " + err));
});

//Kanos category6
router.get("/kanos", async function (req, res) {
  pool
    .getConnection()
    .then((conn) => {
      conn.query("SELECT * FROM listing WHERE category = 6;").then((rows) => {
        res.json(rows);
        conn.end();
      });
    })
    .catch((err) => res.status(400).json("Error " + err));
});
router.get("/kanosrecent", async function (req, res) {
  pool
    .getConnection()
    .then((conn) => {
      conn
        .query(
          "SELECT listing.*, users.city, categories.name AS category_name, subcategory.name AS subcategory_name FROM listing LEFT JOIN categories ON listing.category = categories.category_id LEFT JOIN subcategory ON subcategory.subcategory_id = listing.subcategory LEFT JOIN users ON users.user_id = listing.user_id WHERE listing.category = 6 ORDER BY listing.date DESC"
        )
        .then((rows) => {
          res.json(rows);
          conn.end();
        });
    })
    .catch((err) => res.status(400).json("Error " + err));
});
router.get("/kanoshigh-to-low", async function (req, res) {
  pool
    .getConnection()
    .then((conn) => {
      conn
        .query(
          "SELECT listing.*, users.city, categories.name AS category_name, subcategory.name AS subcategory_name FROM listing LEFT JOIN categories ON listing.category = categories.category_id LEFT JOIN subcategory ON subcategory.subcategory_id = listing.subcategory LEFT JOIN users ON users.user_id = listing.user_id WHERE listing.category = 6 ORDER BY price DESC"
        )
        .then((rows) => {
          res.json(rows);
          conn.end();
        });
    })
    .catch((err) => res.status(400).json("Error " + err));
});
router.get("/kanoslow-to-high", async function (req, res) {
  pool
    .getConnection()
    .then((conn) => {
      conn
        .query(
          "SELECT listing.*, users.city, categories.name AS category_name, subcategory.name AS subcategory_name FROM listing LEFT JOIN categories ON listing.category = categories.category_id LEFT JOIN subcategory ON subcategory.subcategory_id = listing.subcategory LEFT JOIN users ON users.user_id = listing.user_id WHERE listing.category = 6 ORDER BY price ASC"
        )
        .then((rows) => {
          res.json(rows);
          conn.end();
        });
    })
    .catch((err) => res.status(400).json("Error " + err));
});

module.exports = router;
