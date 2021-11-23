import {
  ClickToPlay,
  ControlGroup,
  Controls,
  CurrentTime,
  DblClickFullscreen,
  FullscreenControl,
  IconLibrary,
  LoadingScreen,
  PlaybackControl,
  Player,
  Poster,
  ScrubberControl,
  Ui,
  Video,
  VolumeControl,
} from '@vime/react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { TinyText, primaryText } from 'components/Text'
import { classnames } from 'classnames/tailwind'
import { observer } from 'mobx-react-lite'
import { useSnapshot } from 'valtio'
import { useState } from 'react'
import AppStore from 'stores/AppStore'
import Loader from 'components/Loader'

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

  const [ethAddress, setEthAddress] = useState(
    '0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7'
  )
  const [copied, setCopied] = useState(false)

  return (
    <div className={mainBox}>
      <div className={playerBox}>
        <Player theme={theme} className={playerStyles}>
          <IconLibrary
            name="dosu-invite-icons"
            resolver={(iconName) => `/icons/${iconName}.svg`}
          />

          <Video
            crossOrigin="anonymous"
            poster="https://media.vimejs.com/poster.png"
          >
            <source
              data-src="https://media.vimejs.com/720p.mp4"
              type="video/mp4"
            />
          </Video>

          <Ui>
            <ClickToPlay />
            <DblClickFullscreen />
            <Poster fit="fill" />

            <Controls fullWidth>
              <ControlGroup>
                <PlaybackControl
                  icons="dosu-invite-icons"
                  pauseIcon="pause"
                  playIcon="play"
                  hideTooltip
                />
                <ScrubberControl />
                <CurrentTime className={primaryText} />
                <VolumeControl
                  hideTooltip
                  icons="dosu-invite-icons"
                  highVolumeIcon="highvolume"
                  lowVolumeIcon="highvolume"
                  mutedIcon="highvolume"
                />
                <FullscreenControl
                  icons="dosu-invite-icons"
                  enterIcon="enterfullscreen"
                  exitIcon="enterfullscreen"
                  hideTooltip
                />
              </ControlGroup>
            </Controls>

            <LoadingScreen hideDots>
              <Loader />
            </LoadingScreen>
          </Ui>
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
