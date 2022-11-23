const express = require('express');
const app = express.Router();
const db = require('../index')


app.post('/', async (req, res) => {

    const username = req.body.username;
    const password = req.body.password;

     await db.query("INSERT INTO users (userName, password) VALUES (?,?)",
        [username, password],
        (err, result) => {
            console.log(err)
        })
})

module.exports = app