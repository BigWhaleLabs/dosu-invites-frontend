import { UserAgent, userAgent } from 'helpers/userAgent'
import { useEffect, useRef, useState } from 'preact/hooks'
import { useHistory } from 'react-router-dom'

export default function useVideo() {
  const history = useHistory()
  const isChrome = userAgent() === UserAgent.Chrome

  const draggableGrid = 16
  const multiplier = 2

  const [frame, setFrame] = useState(0)
  const [dragFrame, setDragFrame] = useState(0)
  const [dragPause, setDragPause] = useState(isChrome ? false : true)
  const [video, setVideo] = useState<HTMLMediaElement>()

  const videoRef = useRef<HTMLVmVideoElement>(null)

  async function doSetVideo() {
    if (videoRef.current) {
      const adapter = await videoRef.current.getAdapter()
      const player = await adapter.getInternalPlayer()
      player.playbackRate = draggableGrid
      player.currentTime = dragFrame
      player.pause()
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
    if (video && dragPause) {
      video.currentTime = dragFrame
    }
  }, [video, dragFrame, dragPause])

  useEffect(() => {
    if (video) {
      history.push(frame.toString())
    }
  }, [history, frame, video])

  const onTimeUpdate = (time: number) => {
    if (video && dragPause) {
      video.pause()
    }
    setFrame(Math.floor(time))
  }

  useEffect(() => {
    setDragFrame(+location.pathname.split('/')[1])
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
