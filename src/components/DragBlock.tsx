/* eslint-disable valtio/state-snapshot-rule */
import { BodyText, LinkText } from 'components/Text'
import {
  alignItems,
  backgroundColor,
  borderColor,
  borderRadius,
  borderWidth,
  classnames,
  cursor,
  display,
  flex,
  flexDirection,
  fontSize,
  height,
  inset,
  margin,
  overflow,
  padding,
  position,
  textAlign,
  textColor,
  textOverflow,
  userSelect,
  whitespace,
  width,
} from 'classnames/tailwind'
import { useEffect } from 'preact/hooks'
import { useSnapshot } from 'valtio'
import Draggable from 'react-draggable'
import FramesStore from 'stores/FramesStore'
import PlayerStore from 'stores/PlayerStore'

const marginBottom = classnames(margin('mb-6'))

const draggableWrapper = classnames(
  display('flex'),
  flex('flex-auto'),
  flexDirection('flex-col'),
  width('w-full'),
  margin(marginBottom)
)

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

const ethAddressBox = classnames(
  flex('flex-auto'),
  flexDirection('flex-col'),
  width('w-full'),
  borderRadius('rounded-3xl'),
  borderWidth('border-2'),
  borderColor('border-border'),
  margin('mx-auto'),
  padding('p-6')
)

const ethText = classnames(
  textColor('text-primary'),
  fontSize('text-sm', 'md:text-lg'),
  userSelect('select-all'),
  textOverflow('truncate')
)

function DragBlock() {
  const { framesToEth, framesToEthLength, displayedAddress } =
    useSnapshot(FramesStore)
  const { frame, draggableGrid, multiplier } = useSnapshot(PlayerStore)

  useEffect(() => {
    if (!framesToEth) return
    FramesStore.framesToEthLength = Object.keys(framesToEth).length
  }, [framesToEth])

  useEffect(() => {
    if (framesToEth && framesToEth[frame]) {
      FramesStore.updateDisplayedAddress(framesToEth[frame])
    }
  }, [frame, framesToEth])

  return (
    <div className={draggableWrapper}>
      {framesToEthLength && (
        <>
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
              position={{ x: -(frame - 1) * draggableGrid * multiplier, y: 0 }}
              axis="x"
              onDrag={(_e, data) => {
                PlayerStore.updateFrame(
                  frame + -data.deltaX / draggableGrid > framesToEthLength
                    ? framesToEthLength
                    : frame + -data.deltaX / draggableGrid
                )
              }}
            >
              <div className={draggableText}>
                {framesToEth &&
                  Object.keys(framesToEth).map((frameId) => (
                    <div className={draggableSymbolBox}>
                      <p className={draggableSymbol}>{+frameId}</p>
                    </div>
                  ))}
              </div>
            </Draggable>
            <div className={indicator} />
          </div>

          <div className={ethAddressBox}>
            <BodyText>ETH ADDRESS</BodyText>
            {displayedAddress && (
              <LinkText>
                <a
                  href={`https://etherscan.io/address/${displayedAddress}`}
                  target="_blank"
                  className={ethText}
                >
                  {displayedAddress}
                </a>
              </LinkText>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default DragBlock
