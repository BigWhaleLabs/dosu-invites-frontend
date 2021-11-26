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
import Loader from 'components/Loader'
import useMain from 'pages/Main/useMain'

const mainBox = classnames('flex', 'flex-col', 'content-center', 'items-center')

const playerBox = classnames('flex', 'items-center', 'w-full', 'rounded-3xl')

const playerStyles = classnames('w-full')

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
  const [frame, setFrame] = useState(1)

  const { framesToEthMap } = useMain()

  const videoLink = `http://localhost:1337/video`

  const [ethAddress, setEthAddress] = useState('')
  const [copied, setCopied] = useState(false)

  const video = window.document.getElementsByTagName('video')[0]
  if (video) {
    video.addEventListener('timeupdate', function () {
      const seconds = video.currentTime * 24
      const frame = Math.floor(seconds)
      setFrame(frame)
    })
  }

  useEffect(() => {
    setEthAddress(framesToEthMap[frame])
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
