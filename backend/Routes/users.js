const express = require("express");
const router = express.Router();
const pool = require('../database/connection')
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");


//Get al users
router.get("/", async function (req, res) {
    pool.getConnection()
        .then((conn) => {
            conn.query('SELECT * from users')
                .then((rows) => {
                    res.json(rows)
                    conn.end()
                })
        })
        .catch(err => res.status(400).json('Error ' + err))
})

//Get a single user by their user_id
router.get("/:id", async function (req, res) {
    pool.getConnection()
        .then((conn) => {
            conn.query('SELECT * from users where user_id = ?', req.params.id)
                .then((rows) => {
                    res.json(rows)
                    conn.end()
                })
        })
        .catch(err => res.status(400).json('Error ' + err))
})

//Register a new user
router.post('/', async function (req, res) {

    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const phone = req.body.phone;
    const address = req.body.address;
    const zipcode = req.body.zipcode;

    const cryptedPassword = await bcrypt.hash(password, 10);

    pool.getConnection()
        .then((conn) => {
            conn.query(`INSERT INTO users (password, email, username, firstname, lastname, phone, address, zipcode) VALUES (?,?,?,?,?,?,?,?)`, [
                cryptedPassword, email, username, firstname, lastname, phone, address, zipcode
            ])
                .then(() => {
                    res.json('User added')
                    conn.end()
                })
                .catch(err => res.status(400).json('Error: ' + err))
        })
        .catch(err => res.status(400).json('Error: ' + err))
})

//Login an existing user
router.post('/login', async function (req, res) {
    pool.getConnection()
        .then((conn) => {

            //Check if username exist
            conn.query(`Select * from users WHERE username = ?`, req.body.username)

                //If username exist
                .then( (user) => {

                    //compare the entered and hashed password
                    bcrypt.compare(req.body.password, user[0].password)

                        //If passwords match
                        .then( (passwordCheck) => {

                            //Check if passwords match
                            if (!passwordCheck) {
                                return res.status(400).send({
                                    message: "Passwords do not match",
                                    l: req.body.username,
                                    k: user[0].password,
                                })
                            }

                            //Create JWT token
                            const token = jwt.sign(
                                {
                                    userId: user[0].id,
                                    username: user[0].username
                                },
                                "Random Token",
                                {
                                    expiresIn: "24h"
                                }
                            )

                            //Return successful response
                            res.status(200).send({
                                message: "Login Successful",
                                username: user[0].username,
                                token
                            })
                        })

                        //Catch if passwords don't match
                        .catch((e) => {
                            res.status(404).send({
                                message: "Passwords dont match",
                                e,
                            })
                        })
                })

                // catch error if username doesn't exist
                .catch((e) => {
                    res.status(400).send({
                        message: "Username not found",
                        e,
                    })
                })
        })
})

module.exports = router;