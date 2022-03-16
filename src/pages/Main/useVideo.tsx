import { VideoJsPlayerOptions } from 'video.js'
import { useEffect, useRef, useState } from 'preact/hooks'
import { useNavigate } from 'react-router-dom'
import useBreakpoints from 'helpers/useBreakpoints'

export default function useVideo() {
  const { md } = useBreakpoints()
  const videoJsOptions: VideoJsPlayerOptions = {
    aspectRatio: md ? '16:9' : '4:3',
    controlBar: { volumePanel: false, pictureInPictureToggle: false },
    autoplay: false,
    controls: true,
    responsive: true,
    fluid: true,
    poster: 'img/poster.png',
    bigPlayButton: true,
  }

  const navigate = useNavigate()

  const draggableGrid = 16
  const multiplier = 2

  const [frame, setFrame] = useState(0)
  const [dragFrame, setDragFrame] = useState(0)
  const [dragPause, setDragPause] = useState(true)
  const [video, setVideo] = useState<HTMLMediaElement>()

  const videoRef = useRef<HTMLVideoElement>(null)

  function setupVideo() {
    if (!videoRef.current) return

    videoRef.current.playbackRate = draggableGrid
    setVideo(videoRef.current)
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
  }, [video, dragFrame, dragPause])

  useEffect(() => {
    if (video) navigate(frame.toString())
  }, [navigate, frame, video])

  const onTimeUpdate = (time: number) => {
    if (video && dragPause) video.pause()

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
    setupVideo,
    videoJsOptions,
  }
}
