import { useEffect, useRef, useState } from 'preact/hooks'
import { useNavigate } from 'react-router-dom'

export default function useVideo() {
  const navigate = useNavigate()

  const draggableGrid = 16
  const multiplier = 2

  const [frame, setFrame] = useState(0)
  const [dragFrame, setDragFrame] = useState(0)
  const [dragPause, setDragPause] = useState(true)
  const [video, setVideo] = useState<HTMLMediaElement>()

  const videoRef = useRef<HTMLVmVideoElement>(null)

  async function doSetVideo() {
    if (videoRef.current) {
      const adapter = await videoRef.current.getAdapter()
      const player = await adapter.getInternalPlayer()
      player.playbackRate = draggableGrid
      setVideo(player)
    }
  }

  function reloadVideo(time?: number) {
    if (video) {
      video.pause()
      video.load()
      if (time) {
        video.currentTime = time
      }
      video.pause()
    }
  }

  useEffect(() => {
    if (video) {
      video.currentTime = dragFrame
    }
  }, [video, dragFrame, dragPause])

  useEffect(() => {
    if (video) {
      navigate(frame.toString())
    }
  }, [navigate, frame, video])

  const onTimeUpdate = (time: number) => {
    if (video && dragPause) {
      video.pause()
    }
    setFrame(Math.floor(time))
  }

  useEffect(() => {
    const frame = +location.pathname.split('/')[1]
    !isNaN(frame) && setDragFrame(frame)
    // Allow the user to play the video by clicking the 'play' button
    setTimeout(() => setDragPause(false), 1000)
  }, [])

  return {
    draggableGrid,
    onTimeUpdate,
    setDragPause,
    dragFrame,
    frame,
    setDragFrame,
    multiplier,
    reloadVideo,
    videoRef,
    doSetVideo,
  }
}
