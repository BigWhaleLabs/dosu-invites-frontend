import { useEffect, useState } from 'preact/hooks'
import { useHistory } from 'react-router-dom'

export default function useVideo() {
  const history = useHistory()

  const draggableGrid = 16
  const multiplier = 2

  const [frame, setFrame] = useState(0)
  const [dragFrame, setDragFrame] = useState(0)
  const [dragPause, setDragPause] = useState(false)

  const video = document.querySelector('video')

  useEffect(() => {
    if (video) {
      video.playbackRate = draggableGrid
    }
  }, [video])

  useEffect(() => {
    if (video) {
      history.push(frame.toString())
    }
  }, [history, frame, video])

  useEffect(() => {
    if (video) {
      video.currentTime = dragFrame
    }
  }, [dragFrame, video])

  const onTimeUpdate = (time: number) => {
    if (video && dragPause) {
      video.pause()
    }
    setFrame(Math.floor(time))
  }

  useEffect(() => {
    setDragFrame(+location.pathname.split('/')[1])
  }, [])

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

  return {
    draggableGrid,
    onTimeUpdate,
    setDragPause,
    dragFrame,
    frame,
    setDragFrame,
    multiplier,
    reloadVideo,
  }
}
