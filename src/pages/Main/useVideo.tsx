import { useEffect, useState } from 'preact/hooks'
import { useHistory } from 'react-router-dom'
import AppStore from 'stores/AppStore'

export default function useVideo() {
  const history = useHistory()

  const draggableGrid = 16

  const [frame, setFrame] = useState(0)
  const [dragFrame, setDragFrame] = useState(0)
  const [dragPause, setDragPause] = useState(true)

  const video = document.querySelector('video')

  useEffect(() => {
    setDragFrame(+location.pathname.split('/')[1])
  }, [])

  useEffect(() => {
    if (video) {
      video.currentTime = dragFrame
    }
  }, [dragFrame, video])

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
    // Reload the video when the minting is complete
    if (AppStore.userAddress && AppStore.userFrame && video) {
      video.pause()
      video.load()
      video.pause()
    }
  }, [video])

  const onTimeUpdate = (time: number) => {
    if (video && dragPause) {
      video.pause()
    }
    setFrame(Math.floor(time))
  }
  return {
    draggableGrid,
    onTimeUpdate,
    setDragPause,
    dragFrame,
    frame,
    setDragFrame,
  }
}
