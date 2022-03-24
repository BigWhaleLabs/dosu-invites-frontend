import { DefaultUi, Player, Poster, Video } from '@vime/react'
import {
  alignItems,
  backgroundColor,
  borderColor,
  borderRadius,
  borderWidth,
  classnames,
  cursor,
  display,
  flexDirection,
  height,
  inset,
  margin,
  overflow,
  padding,
  position,
  textAlign,
  textColor,
  userSelect,
  whitespace,
  width,
} from 'classnames/tailwind'
import { useEffect } from 'preact/hooks'
import { useSnapshot } from 'valtio'
import AppStore from 'stores/AppStore'
import Draggable from 'react-draggable'
import FramesStore from 'stores/FramesStore'
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
const draggableBox = classnames(
  display('flex'),
  flexDirection('flex-col'),
  position('relative'),
  width('w-full'),
  overflow('overflow-hidden'),
  borderRadius('rounded-3xl'),
  borderWidth('border-2'),
  borderColor('border-border'),
  margin('my-12'),
  padding('p-6')
)
const draggableText = classnames(
  width('w-full'),
  cursor('cursor-move'),
  alignItems('items-center'),
  display('flex'),
  flexDirection('flex-row'),
  textColor('text-primary')
)
const draggableSymbol = classnames(
  width('w-8'),
  textAlign('text-center'),
  userSelect('select-none'),
  overflow('overflow-clip', 'overflow-hidden'),
  whitespace('whitespace-nowrap')
)
const draggableSymbolBox = classnames(display('block'))
const indicator = classnames(
  position('absolute'),
  inset('bottom-0', 'left-1/2'),
  width('w-1'),
  height('h-6'),
  backgroundColor('bg-border'),
  borderRadius('rounded-md')
)

function VideoBlock() {
  const { theme } = useSnapshot(AppStore)
  const { framesToEth } = useSnapshot(FramesStore)
  const {
    onTimeUpdate,
    setDragPause,
    dragFrame,
    setDragFrame,
    draggableGrid,
    multiplier,
    frame,
    videoRef,
    doSetVideo,
  } = useVideo()
  const { md } = useBreakpoints()

  useEffect(() => {
    if (framesToEth[frame]) {
      FramesStore.ethAddress = framesToEth[frame]
    }
  }, [frame, framesToEth])

  const framesToEthLength = Object.keys(framesToEth).length

  const videoLink = `${backend}/video`

  return (
    <>
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
              className="h-fit rounded-3xl"
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

      <div className={draggableBox}>
        <Draggable
          bounds={{
            left: -draggableGrid * framesToEthLength * multiplier,
            right: 0,
          }}
          grid={[draggableGrid, draggableGrid]}
          positionOffset={{
            x: `calc(50% - 0.85rem)`,
            y: 0,
          }}
          position={{ x: -frame * draggableGrid * multiplier, y: 0 }}
          axis="x"
          onDrag={(_e, data) => {
            setDragPause(true)
            setDragFrame(frame + -data.deltaX / draggableGrid)
          }}
          onStop={() => setDragPause(false)}
        >
          <div className={draggableText}>
            {Object.keys(framesToEth).map((tokenId) => (
              <div className={draggableSymbolBox}>
                <p className={draggableSymbol}>{+tokenId}</p>
              </div>
            ))}
          </div>
        </Draggable>
        <div className={indicator} />
      </div>
    </>
  )
}

export default VideoBlock
