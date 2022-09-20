const express = require("express");
const app = express();
require("dotenv").config();

// Root path

app.get("/", (req, res) => {
  res.json({ message: "Ok" });
});

// Start server

app.listen(process.env.HTTP_PORT, () => {
  console.log(`Server running on port ${process.env.HTTP_PORT}`);
});
