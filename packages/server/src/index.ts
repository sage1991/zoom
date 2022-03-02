import http from "http"
import WebSocket from "ws"

const server = http.createServer()
const wss = new WebSocket.Server({ server })

const sockets: WebSocket.WebSocket[] = []

wss.on("connection", (socket) => {
  sockets.push(socket)
  // @ts-ignore
  socket.nickname = "Anonymous"

  console.log("Connected to the Browser ✅")
  socket.on("close", () => {
    console.log("Disconnected from the Browser ❌")
  })
  socket.on("message", (data) => {
    const message = JSON.parse(data.toString())
    switch (message.type) {
      case "SEND_MESSAGE":
        // @ts-ignore
        sockets.forEach(__socket => __socket.send(`${socket.nickname}: ${message.payload}`))
        break
      case "SET_NICKNAME":
        // @ts-ignore
        socket.nickname = message.payload
        break
    }
  })
})

server.listen(3000, () => {
  console.log("listening on port 3000")
})
