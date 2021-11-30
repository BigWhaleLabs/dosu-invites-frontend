import { CopyToClipboard } from 'react-copy-to-clipboard'
import { DefaultUi, LoadingScreen, Player, Poster, Video } from '@vime/react'
import { TinyText } from 'components/Text'
import { classnames } from 'classnames/tailwind'
import { observer } from 'mobx-react-lite'
import { useEffect } from 'preact/hooks'
import { useSnapshot } from 'valtio'
import { useState } from 'react'
import AppStore from 'stores/AppStore'
import Draggable from 'react-draggable'
import Loader from 'components/Loader'
import useMain from 'pages/Main/useMain'

const backend =
  (import.meta.env.BACKEND as string) || 'https://backend.invites.dosu.io'

const mainBox = classnames('flex', 'flex-col', 'content-center', 'items-center')

const playerBox = classnames('flex', 'items-center', 'w-full', 'rounded-3xl')
const playerStyles = classnames('w-full')

const draggableBox = classnames(
  'flex',
  'flex-col',
  'relative',
  'w-full',
  'overflow-hidden',
  'rounded-3xl',
  'border-2',
  'border-border',
  'mt-12',
  'p-6'
)
const draggableText = classnames(
  'w-full',
  'cursor-move',
  'items-center',
  'flex',
  'flex-row',
  'text-primary',
  'lg:ml-100',
  'ml-46'
)
const draggableSymbol = classnames(
  'w-8',
  'text-center',
  'overflow-clip',
  'overflow-hidden',
  'whitespace-nowrap'
)
const draggableSymbolBox = classnames('block')
const indicator = classnames(
  'absolute',
  'bottom-0',
  'left-1/2',
  'w-1',
  'h-6',
  'bg-border',
  'rounded-md'
)

const ethAddressBox = classnames(
  'flex',
  'flex-col',
  'w-full',
  'rounded-3xl',
  'border-2',
  'border-border',
  'mx-auto',
  'mt-12',
  'p-6'
)

const ethText = (copied?: boolean) =>
  classnames(
    copied ? 'text-success' : 'text-primary',
    'md:text-lg',
    'text-sm',
    'select-text',
    'truncate'
  )

function Main() {
  const { theme } = useSnapshot(AppStore)

  const { framesToEthMap } = useMain()

  const [frame, setFrame] = useState(0)
  const [dragFrame, setDragFrame] = useState(0)
  const [ethAddress, setEthAddress] = useState('0x')
  const [copied, setCopied] = useState(false)

  const videoLink = `${backend}/video`
  const video = window.document.getElementsByTagName('video')[0]

  useEffect(() => {
    if (video) {
      video.addEventListener('timeupdate', () => {
        setFrame(Math.round((Math.round(video.currentTime * 100) / 100) * 24))
      })
    }
  }, [video])

  const draggableGrid = 16

  useEffect(() => {
    setEthAddress(framesToEthMap[frame])
    setCopied(false)
  }, [frame, framesToEthMap])

  useEffect(() => {
    if (video) {
      video.currentTime = Math.round((dragFrame / 24) * 100) / 100
    }
  }, [dragFrame, video])

  return (
    <div className={mainBox}>
      <div className={playerBox}>
        <Player theme={theme} className={playerStyles}>
          <Video poster="img/poster">
            <source data-src={videoLink} type="video/mp4" />
          </Video>
          <Poster fit="fill" />

          <DefaultUi noCaptions noLoadingScreen noSettings noSpinner>
            <LoadingScreen hideDots>
              <Loader />
            </LoadingScreen>
          </DefaultUi>
        </Player>
      </div>

      <div className={draggableBox}>
        <TinyText>DRAGGABLE FRAMES</TinyText>
        {!framesToEthMap ? (
          <Loader size="small" />
        ) : (
          <>
            <Draggable
              bounds={{ left: -draggableGrid * 1000, right: 0 }}
              grid={[draggableGrid, draggableGrid]}
              position={{ x: -frame * draggableGrid * 2, y: 0 }}
              axis="x"
              onDrag={(_e, data) => {
                setDragFrame(frame + -data.deltaX / draggableGrid)
              }}
            >
              <div className={draggableText}>
                {Object.keys(framesToEthMap).map((frame) => (
                  <div className={draggableSymbolBox}>
                    <p className={draggableSymbol}>{frame}</p>
                  </div>
                ))}
              </div>
            </Draggable>
            <div className={indicator} />
          </>
        )}
      </div>

      <div className={ethAddressBox}>
        <TinyText>ETH ADDRESS</TinyText>

        <CopyToClipboard text={ethAddress} onCopy={() => setCopied(true)}>
          <span className={ethText(copied)}>{ethAddress}</span>
        </CopyToClipboard>
      </div>
    </div>
  )
}

export default observer(Main)
