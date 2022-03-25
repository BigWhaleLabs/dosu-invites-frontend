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
import Draggable from 'react-draggable'
import EthStore from 'stores/EthStore'
import FramesStore from 'stores/FramesStore'
import PlayerStore from 'stores/PlayerStore'
import useVideo from 'pages/Main/useVideo'

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
  const { framesToEth, framesToEthLength } = useSnapshot(FramesStore)
  const { frame } = useSnapshot(PlayerStore)
  const { draggableGrid, multiplier } = useVideo()

  useEffect(() => {
    FramesStore.framesToEthLength = Object.keys(framesToEth).length
  }, [])

  useEffect(() => {
    if (framesToEth[frame]) {
      EthStore.ethAddress = framesToEth[frame]
    }
  }, [frame, framesToEth])

  return (
    <div className={draggableBox}>
      <Draggable
        bounds={{
          left: -draggableGrid * framesToEthLength * multiplier,
          right: 0,
        }}
        grid={[draggableGrid, draggableGrid]}
        positionOffset={{
          x: 'calc(50% - 0.85rem)',
          y: 0,
        }}
        position={{ x: -frame * draggableGrid * multiplier, y: 0 }}
        axis="x"
        onDrag={(_e, data) => {
          PlayerStore.updatePause(true)
          PlayerStore.updateDragFrame(frame + -data.deltaX / draggableGrid)
        }}
        onStop={() => PlayerStore.updatePause(false)}
      >
        <div className={draggableText}>
          {Object.keys(framesToEth).map((frameId) => (
            <div className={draggableSymbolBox}>
              <p className={draggableSymbol}>{+frameId}</p>
            </div>
          ))}
        </div>
      </Draggable>
      <div className={indicator} />
    </div>
  )
}

export default VideoBlock
