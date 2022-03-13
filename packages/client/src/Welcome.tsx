import React, { FC, useState } from "react"

interface Props {
  submitRoom: (room: string) => void
}

export const Welcome: FC<Props> = (props) => {
  const [ room, setRoom ] = useState<string>("")

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    props.submitRoom(room)
  }

  const onRoomNameChange = (e: React.ChangeEvent<HTMLInputElement>) => setRoom(e.target.value)

  return (
    <div>
      <form action="" onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="room name"
          required
          onChange={onRoomNameChange}
        />
        <button>Enter Room</button>
      </form>
    </div>
  )
}
