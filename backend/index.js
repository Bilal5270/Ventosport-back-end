const express = require("express");
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

//Cors-anywhere
app.use(cors());
app.use(express.json());

//Routes

const testRoute = require('./Routes/users')
app.use('/users', testRoute)


//Running server on Port
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
