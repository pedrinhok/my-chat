const User = require("./models/user")

module.exports = (server) => {

  // socket.io
  const io = require("socket.io")(server)

  // redis
  const redis = require("redis")
  const client = redis.createClient()
  const pub = redis.createClient()
  const sub = redis.createClient()
  sub.subscribe("chat")

  // socket.io redis adapter
  const adapter = require("socket.io-redis")(redis)
  io.adapter(adapter)

  // socket.io/redis emitter
  const emitter = require("socket.io-emitter")(client)
  const emit = emitter.of("/chat")

  // socket namespace
  const chat = io.of("/chat")

  // socket handshake
  chat.use((socket, next) => {
    if (!socket.handshake.query.user) {
      return next(new Error("Auth error"))
    }
    // const user = Number(socket.handshake.query.user)
    socket.user = socket.handshake.query.user
    next()
  })

  // socket connection
  chat.on("connection", (socket) => {
    console.log("connected")

    socket.on("disconnect", () => {
      console.log("disconnected")
    })

    socket.on("createroom", (room) => {
      console.log("create room")
    })

    socket.on("removeroom", (room) => {
      console.log("remove room")
    })

    socket.on("switchroom", (room) => {
      console.log("switch room")
      if (socket.room && socket.room !== room) {
        socket.leave(socket.room)
      }
      socket.room = room
      socket.join(socket.room)
    })

    socket.on("sendmessage", (message) => {
      console.log("send message")
      pub.publish("chat", JSON.stringify({
        room: socket.room,
        message: message
      }))
    })

  })

  sub.on("message", (namespace, message) => {
    message = JSON.parse(message)
    emit.to(message.room).emit("refresh", message.message)
  })

  return io

}
