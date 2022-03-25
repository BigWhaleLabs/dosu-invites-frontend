import 'video.js/dist/video-js.css'
import { FC } from 'preact/compat'
import { Ref } from 'preact/compat'
import { useEffect, useState } from 'preact/hooks'
import videojs, { VideoJsPlayer, VideoJsPlayerOptions } from 'video.js'

interface VideoJsProps {
  options: VideoJsPlayerOptions
  onReady: () => void
  videoRef: Ref<HTMLVideoElement>
  videoLink: string
  onTimeUpdate: (time: number) => void
}

export const VideoJS: FC<VideoJsProps> = ({
  options,
  onReady,
  videoRef,
  videoLink,
  onTimeUpdate,
}) => {
  const [player, setPlayer] = useState<VideoJsPlayer | null>(null)

  useEffect(() => {
    if (player) return
    const videoElement = videoRef.current
    if (!videoElement) return

    setPlayer(
      videojs(videoElement, options, function () {
        onReady()
        this.on('timeupdate', function (this: VideoJsPlayer) {
          onTimeUpdate(this.currentTime())
        })
      })
    )
  }, [onReady, onTimeUpdate, options, player, videoRef])

  const videoStyles = 'video-js vjs-1-1'

  return (
    <div data-vjs-player>
      <video
        controls
        ref={videoRef}
        className={videoStyles}
        crossOrigin="anonymous"
      >
        <source src={videoLink} type="video/mp4" />
        Your browser doesn't support this video
      </video>
    </div>
  )
}

export default VideoJS