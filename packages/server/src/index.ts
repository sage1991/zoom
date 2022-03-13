import http from "http"
import { Server } from "socket.io"

const server = http.createServer()
const io = new Server(server, {
  serveClient: false,
  cors: {
    origin: "*"
  }
})

const getPublicRooms = () => {
  const { sids, rooms } = io.sockets.adapter
  const publicRooms: string[] = []
  rooms.forEach((_, key) => {
    if (!sids.has(key)) {
      publicRooms.push(key)
    }
  })
  return publicRooms
}

const countRooms = (name: string) => {
  const room = io.sockets.adapter.rooms.get(name)
  return room?.size ?? 0
}

io.on("connection", (socket) => {
  console.log(socket)
  socket.data.nickName = "Anonymous"

  socket.onAny((eventName, ...args) => {
    console.log(io.sockets.adapter)
    console.log(`${eventName}: `, args)
  })

  socket.on("join-room", (roomName, callback) => {
    socket.join(roomName)
    socket.to(roomName).emit("welcome")
    callback()
  })

  socket.on("enter-room", (roomName, callback) => {
    socket.join(roomName)
    callback()
    socket.to(roomName).emit("welcome", socket.data.nickName, countRooms(roomName))
    io.sockets.emit("room_change", getPublicRooms())
  })

  socket.on("new-message", (message, roomName, callback) => {
    socket.to(roomName).emit("new-message", `${socket.data.nickName}: ${message}`)
    callback()
  })

  socket.on("nickname", nickName => {
    socket.data.nickName = nickName
  })

  socket.on("disconnecting", () => {
    socket.rooms.forEach(room => socket.to(room).emit("bye", socket.data.nickName, countRooms(room)))
  })

  socket.on("disconnect", () => {
    io.sockets.emit("room_change", getPublicRooms())
  })
})

server.listen(3000, () => {
  console.log("listening on port 3000")
})
