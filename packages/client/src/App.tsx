import React, { FC, useEffect, useRef, useState } from "react"

export const App: FC = () => {
  const socket = useRef<WebSocket>()
  const [ input, setInput ] = useState<string>("")
  const [ nickname, setNickName ] = useState<string>("")
  const [ messages, setMessages ] = useState<string[]>([])

  useEffect(() => {
    socket.current = new WebSocket(`ws://localhost:3000`)
    socket.current.addEventListener("open", () => {
      console.log("Connected to the Server ✅")
    })
    socket.current.addEventListener("message", (e) => {
      setMessages(prev => [ ...prev, e.data ])
    })
    socket.current.addEventListener("close", () => {
      console.log("Disconnected from the Server ❌")
    })

    return () => socket.current?.close()
  }, [])

  const onSubmitNickName = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    socket.current?.send(JSON.stringify({ type: "SET_NICKNAME", payload: nickname }))
  }

  const onSubmitInput = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    socket.current?.send(JSON.stringify({ type: "SEND_MESSAGE", payload: input }))
    setInput("")
  }

  const onChangeNickName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickName(e.target.value)
  }

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  return (
    <>
      <header>
        <h1>Noom</h1>
      </header>
      <main>
        <ul>
          {
            messages.map((message, index) => (
              <li key={index}>{message}</li>
            ))
          }
        </ul>
        <form onSubmit={onSubmitNickName}>
          <input
            type="text"
            placeholder="choose a nickname"
            value={nickname}
            onChange={onChangeNickName}
          />
          <button type="submit">Save</button>
        </form>
        <form onSubmit={onSubmitInput}>
          <input
            type="text"
            placeholder="write a message"
            value={input}
            onChange={onChangeInput}
          />
          <button type="submit">Send</button>
        </form>
      </main>
    </>
  )
}
