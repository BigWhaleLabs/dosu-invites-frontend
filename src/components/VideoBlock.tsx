import { DefaultUi, Player, Poster, Video } from '@vime/react'
import {
  alignItems,
  borderRadius,
  classnames,
  display,
  height,
  width,
} from 'classnames/tailwind'
import { useSnapshot } from 'valtio'
import AppStore from 'stores/AppStore'
import FramesStore from 'stores/FramesStore'
import PlayerStore from 'stores/PlayerStore'
import useBreakpoints from 'helpers/useBreakpoints'
import useVideo from 'pages/Main/useVideo'

const backend = import.meta.env.VITE_BACKEND as string

const playerBox = classnames(
  display('flex'),
  alignItems('items-center'),
  width('w-full'),
  borderRadius('rounded-3xl')
)
const playerStyles = classnames(width('w-full'))
const altImg = classnames(height('h-fit'), borderRadius('rounded-3xl'))

function VideoBlock() {
  const { theme } = useSnapshot(AppStore)
  const { dragFrame } = useSnapshot(PlayerStore)
  const { framesToEthLength } = useSnapshot(FramesStore)
  const { onTimeUpdate, videoRef, doSetVideo } = useVideo()
  const { md } = useBreakpoints()
  const videoLink = `${backend}/video`

  return (
    <div className={playerBox}>
      <Player
        theme={theme}
        className={playerStyles}
        aspectRatio={md ? '16:9' : '1:1'}
        onVmCurrentTimeChange={(currentTime) =>
          onTimeUpdate(currentTime.detail)
        }
        onVmPlaybackReady={async () => await doSetVideo()}
      >
        {dragFrame > framesToEthLength ? (
          <img
            className={altImg}
            src={md ? 'img/noInvite169.png' : 'img/noInvite11.png'}
          />
        ) : (
          <>
            <Video poster="img/poster" crossOrigin="anonymous" ref={videoRef}>
              <source src={videoLink} type="video/mp4" />
            </Video>
            <Poster fit="fill" />
            <DefaultUi noSettings noCaptions />
          </>
        )}
      </Player>
    </div>
  )
}

export default VideoBlock
