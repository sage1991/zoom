import React, { FC, useEffect, useState } from "react"
import { io } from "socket.io-client"

const socket = io("http://192.168.0.221:3000")

export const App: FC = () => {
  const [ isEnterRoom, setIsEnterRoom ] = useState<boolean>(false)
  const [ roomName, setRoomName ] = useState<string>("")
  const [ count, setCount ] = useState<number>(0)
  const [ nickName, setNickName ] = useState<string>("")
  const [ message, setMessage ] = useState<string>("")
  const [ chatList, setChatList ] = useState<string[]>([])
  const [ rooms, setRooms ] = useState<string[]>([])

  useEffect(() => {
    socket.on("welcome", (nickName: string, newCount: number) => {
      setCount(newCount)
      setChatList(prev => [ ...prev, `${nickName} joined!` ])
    })
    socket.on("bye", (nickName: string, newCount: number) => {
      setCount(newCount)
      setChatList(prev => [ ...prev, `${nickName} left!` ])
    })
    socket.on("new-message", (message: string) => {
      setChatList(prev => [ ...prev, message ])
    })
    socket.on("room_change", (rooms: string[]) => {
      setRooms(rooms)
    })
  }, [])

  const onRomeNameSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    socket.emit("enter-room", roomName, () => {
      setIsEnterRoom(true)
    })
  }

  const onRoomNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoomName(e.target.value)
  }

  const onMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setMessage("")
    socket.emit("new-message", message, roomName, () => {
      setChatList(prev => [ ...prev, `You: ${message}` ])
    })
  }

  const onMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value)
  }

  const onNickNameSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    socket.emit("nickname", nickName)
  }

  const onNickNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickName(e.target.value)
  }

  let contents = (
    <div id="welcome">
      <form onSubmit={onRomeNameSubmit}>
        <input
          type="text"
          placeholder="room name"
          required
          value={roomName}
          onChange={onRoomNameChange}
        />
        <button>Enter Room</button>
      </form>
      <h4>Open Rooms:</h4>
      <ul>
        { rooms.map((name) => <li key={name}>{ name }</li>) }
      </ul>
    </div>
  )

  if (isEnterRoom) {
    contents = (
      <div id="room">
        <h3>Room {roomName} ({count})</h3>
        <ul>{chatList.map((chat, index) => <li key={index}>{chat}</li>)}</ul>
        <form onSubmit={onNickNameSubmit}>
          <input
            type="text"
            placeholder="nickname"
            required
            value={nickName}
            onChange={onNickNameChange}
          />
          <button>Save</button>
        </form>
        <form onSubmit={onMessageSubmit}>
          <input
            type="text"
            placeholder="message"
            required
            value={message}
            onChange={onMessageChange}
          />
          <button>Send</button>
        </form>
      </div>
    )
  }

  return (
    <>
      <header>
        <h1>Noom</h1>
      </header>
      <main>
        {contents}
      </main>
    </>
  )
}
