import React, { FC, useCallback, useEffect, useRef, useState } from "react"
import { socket } from "./socket"

interface Props {
  room: string
}

export const Call: FC<Props> = (props) => {
  const video = useRef<HTMLVideoElement>(null)
  const mediaStream = useRef<MediaStream>()
  const [ isCameraOn, setIsCameraOn ] = useState<boolean>(true)
  const [ isAudioOn, setIsAudioOn ] = useState<boolean>(true)
  const [ cameras, setCameras ] = useState<MediaDeviceInfo[]>([])
  const [ deviceId, setDeviceId ] = useState<string>("")

  const getMedia = useCallback(async () => {
    const constraint: MediaStreamConstraints = {
      audio: false,
      video: deviceId ? { deviceId }: { facingMode: "user" }
    }
    mediaStream.current = await navigator.mediaDevices.getUserMedia(constraint)
    if (video.current) {
      video.current.srcObject = mediaStream.current
    }
    return mediaStream.current
  }, [ deviceId ])

  const getCameras = useCallback(async (mediaStream: MediaStream) => {
    const devices = await navigator.mediaDevices.enumerateDevices()
    const cameras = devices.filter(device => device.kind === "videoinput")
    const currentCamera = await mediaStream.getVideoTracks()[0]
    const camera = cameras.find(camera => camera.label === currentCamera?.label)
    console.log(cameras, currentCamera)
    setCameras(cameras)
    if (camera) {
      setDeviceId(camera.deviceId)
    }
  }, [])

  useEffect(() => {
    getMedia()
      .then(getCameras)
  }, [ getMedia, getCameras ])

  useEffect(() => {
    socket.on("welcome", () => {
      console.log("someone join...")
    })
  }, [])

  const onMuteButtonClick = () => {
    mediaStream.current?.getAudioTracks().forEach((track) => track.enabled = !track.enabled)
    setIsAudioOn(prev => !prev)
  }

  const onVideoButtonClick = () => {
    mediaStream.current?.getVideoTracks().forEach((track) => track.enabled = !track.enabled)
    setIsCameraOn(prev => !prev)
  }

  const onCameraChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDeviceId(e.target.value)
  }

  return (
    <div>
      <video ref={video} autoPlay playsInline width={400} height={400} />
      <button onClick={onMuteButtonClick}>
        { isAudioOn ? "Mute" : "Unmute" }
      </button>
      <button onClick={onVideoButtonClick}>
        { isCameraOn ? "Turn Camera off" : "Turn Camera on" }
      </button>
      <select name="cameras" value={deviceId} onChange={onCameraChange}>
        { cameras.map(camera => <option key={camera.deviceId} value={camera.deviceId}>{camera.label}</option>) }
      </select>
    </div>
  )
}
