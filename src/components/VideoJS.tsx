import 'video.js/dist/video-js.css'
import { FC } from 'preact/compat'
import { Ref } from 'preact/compat'
import { useEffect, useState } from 'preact/hooks'
import classnames, { width } from 'classnames/tailwind'
import videojs, { VideoJsPlayer, VideoJsPlayerOptions } from 'video.js'

interface VideoJsProps {
  options: VideoJsPlayerOptions
  onReady: () => void
  videoRef: Ref<HTMLVideoElement>
  videoLink: string
}

const playerStyles = classnames(width('w-full'))

export const VideoJS: FC<VideoJsProps> = ({
  options,
  onReady,
  videoRef,
  videoLink,
}) => {
  const [player, setPlayer] = useState<VideoJsPlayer | null>(null)

  useEffect(() => {
    if (player) return
    const videoElement = videoRef.current
    if (!videoElement) return

    setPlayer(
      videojs(videoElement, options, () => {
        onReady()
      })
    )
  }, [onReady, options, player, videoRef])

  return (
    <div data-vjs-player>
      <video
        controls
        preload="none"
        ref={videoRef}
        className="video-js vjs-default-skin"
        poster="img/poster"
        crossOrigin="anonymous"
      >
        <source src={videoLink} type="video/mp4" />
      </video>
    </div>
  )
}

export default VideoJS
