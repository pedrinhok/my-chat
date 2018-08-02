const express = require("express")
const app = express()
const bodyParser = require("body-parser")

const User = require("./models/user")
const Room = require("./models/room")

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.get("/rooms", (req, res) => {
  Room.find().then((rooms) => res.send(rooms))
})

module.exports = app
