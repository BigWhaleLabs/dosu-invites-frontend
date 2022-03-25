import { useEffect, useRef, useState } from 'preact/hooks'
import { useNavigate } from 'react-router-dom'
import { useSnapshot } from 'valtio'
import PlayerStore from 'stores/PlayerStore'

export default function useVideo() {
  const { dragFrame, frame, pause } = useSnapshot(PlayerStore)
  const navigate = useNavigate()

  const draggableGrid = 16
  const multiplier = 2

  const [video, setVideo] = useState<HTMLMediaElement>()

  const videoRef = useRef<HTMLVmVideoElement>(null)

  async function doSetVideo() {
    if (!videoRef.current) return

    const adapter = await videoRef.current.getAdapter()
    const player = await adapter.getInternalPlayer()
    player.playbackRate = draggableGrid
    setVideo(player)
  }

  function reloadVideo(time?: number) {
    if (!video) return

    video.pause()
    video.load()
    if (time) video.currentTime = time
    video.pause()
  }

  useEffect(() => {
    if (video) video.currentTime = dragFrame
  }, [video, dragFrame, pause])

  useEffect(() => {
    if (video) navigate(frame.toString())
  }, [navigate, frame, video])

  const onTimeUpdate = (time: number) => {
    if (video && pause) video.pause()

    PlayerStore.updateFrame(Math.floor(time))
  }

  useEffect(() => {
    const frame = +location.pathname.split('/')[1]
    !isNaN(frame) && PlayerStore.updateDragFrame(frame)

    // Allow the user to play the video by clicking the 'play' button
    setTimeout(() => PlayerStore.updatePause(false), 1000)
  }, [])

  return {
    draggableGrid,
    onTimeUpdate,
    multiplier,
    reloadVideo,
    videoRef,
    doSetVideo,
  }
}
