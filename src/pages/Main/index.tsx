import { CopyToClipboard } from 'react-copy-to-clipboard'
import {
  DefaultUi,
  IconLibrary,
  LoadingScreen,
  Player,
  Poster,
  Video,
} from '@vime/react'
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

const mainBox = classnames('flex', 'flex-col', 'content-center', 'items-center')

const playerBox = classnames('flex', 'items-center', 'w-full', 'rounded-3xl')
const playerStyles = classnames('w-full')

const draggableBox = classnames(
  'flex',
  'flex-col',
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
  'items-center',
  'flex',
  'flex-row',
  'text-primary',
  'font-mono'
)
const draggableSymbol = classnames(
  'w-8',
  'text-center',
  'overflow-clip',
  'overflow-hidden',
  'whitespace-nowrap'
)

const draggableSymbolBox = classnames('block')

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
  const [currentTime, setCurrentTime] = useState(0)
  const [ethAddress, setEthAddress] = useState('0x')
  const [copied, setCopied] = useState(false)

  const videoLink = `http://localhost:1337/video`
  const video = window.document.getElementsByTagName('video')[0]

  useEffect(() => {
    if (video) {
      video.addEventListener('timeupdate', function (event) {
        event.preventDefault()
        setCurrentTime(
          Math.round((video.currentTime + Number.EPSILON) * 100) / 100
        )
      })
    }
  }, [video])

  useEffect(() => {
    const seconds = currentTime * 24
    const frame = Math.floor(seconds)
    setFrame(frame)
  }, [currentTime])

  const draggableGrid = 16

  useEffect(() => {
    setEthAddress(framesToEthMap[frame])
    setCopied(false)
  }, [frame, framesToEthMap])

  return (
    <div className={mainBox}>
      <div className={playerBox}>
        <Player theme={theme} className={playerStyles}>
          <IconLibrary
            name="dosu-invite-icons"
            resolver={(iconName) => `/icons/${iconName}.svg`}
          />

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
        <Draggable
          bounds={{ left: -draggableGrid * 1000, right: draggableGrid * 1000 }}
          grid={[draggableGrid, draggableGrid]}
          positionOffset={{ x: -frame * draggableGrid, y: 0 }}
          axis="x"
          onDrag={(e, data) => {
            setFrame(-data.x / draggableGrid)
          }}
        >
          <div className={draggableText}>
            {framesToEthMap &&
              Object.keys(framesToEthMap).map((frame) => (
                <div className={draggableSymbolBox}>
                  <p className={draggableSymbol}>{frame}</p>
                </div>
              ))}
          </div>
        </Draggable>
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
