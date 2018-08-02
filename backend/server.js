const mongoose = require("mongoose")
module.exports = mongoose.connect("mongodb://localhost/my-chat")

const app = require("./app")

const server = app.listen(8080, () => {
  console.log("running on port 8080")
})

const socket = require("./socket")(server)

module.exports = server
