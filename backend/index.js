const express = require("express");
const cors = require("cors");
var http = require("http");
const app = express();
const PORT = process.env.PORT || 3001;
const path = require("path");
const fs = require("fs");

// app.use(express.static("uploads"));

//Cors-anywhere
app.use(cors());
app.use(express.json());

//Routes

const bidRoute = require("./Routes/bids");
app.use("/bids", bidRoute);

const testRoute = require("./Routes/users");
app.use("/users", testRoute);

const adRoute = require("./Routes/PlaceAd");
app.use("/placeAd", adRoute);

const listingRoute = require("./Routes/listings");
app.use("/listings", listingRoute);

const categoryRoute = require("./Routes/categories");
app.use("/categories", categoryRoute);

app.get("/image/:fileName", function (req, res) {
  const filePath = path.join(__dirname, "uploads", req.params.fileName);
  res.type("image/png");
  fs.createReadStream(filePath).pipe(res);
});
const PaymentRoute = require("./Routes/Payment");
app.use("/Payment", PaymentRoute);

//Running server on Port
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
