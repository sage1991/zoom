import React, { FC, useRef, useState } from "react"

import { Call } from "./Call"
import { Welcome } from "./Welcome"
import { socket } from "./socket"

export const App: FC = () => {
  const [ isCall, setIsCall ] = useState<boolean>(false)
  const [ room, setRoom ] = useState<string>("")

  const submitRoom = (roomIn: string) => {
    socket.emit("join-room", roomIn, () => {
      setRoom(roomIn)
      setIsCall(true)
    })
  }

  return (
    <>
      <header>
        <h1>Noom</h1>
      </header>
      <main>
        { isCall ? <Call room={room} /> : <Welcome submitRoom={submitRoom} /> }
      </main>
    </>
  )
}
