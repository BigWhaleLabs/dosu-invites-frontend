import { BodyText, LinkText } from 'components/Text'
import { Button } from 'components/Button'
import { DefaultUi, Player, Poster, Video } from '@vime/react'
import { Link } from 'react-router-dom'
import { classnames } from 'classnames/tailwind'
import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'preact/hooks'
import { useSnapshot } from 'valtio'
import AppStore from 'stores/AppStore'
import Draggable from 'react-draggable'
import Loader from 'components/Loader'
import truncateMiddle from 'helpers/truncateMiddle'
import useBreakpoints from 'helpers/useBreakpoints'
import useNft from 'pages/Main/useNft'
import useVideo from './useVideo'

const backend = import.meta.env.VITE_BACKEND as string

const mainBox = classnames(
  'flex',
  'flex-col',
  'content-center',
  'items-center',
  'z-10'
)
const marginBottom = classnames('mb-12')

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
  'my-12',
  'p-6'
)
const draggableText = classnames(
  'w-full',
  'cursor-move',
  'items-center',
  'flex',
  'flex-row',
  'text-primary'
)
const draggableSymbol = classnames(
  'w-8',
  'text-center',
  'select-none',
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
  'flex-auto',
  'flex-col',
  'w-full',
  'rounded-3xl',
  'border-2',
  'border-border',
  'mx-auto',
  marginBottom,
  'p-6'
)

const ethText = classnames(
  'text-primary',
  'md:text-lg',
  'text-sm',
  'select-all',
  'truncate'
)

function Main() {
  const { theme, userAddress, userFrame } = useSnapshot(AppStore)
  const { framesToEth, loading, invited, mintAddress, mintLoading } = useNft()
  const {
    onTimeUpdate,
    setDragPause,
    dragFrame,
    setDragFrame,
    draggableGrid,
    multiplier,
    frame,
    reloadVideo,
    videoRef,
    doSetVideo,
  } = useVideo()
  const { md } = useBreakpoints()

  const [ethAddress, setEthAddress] = useState('0x')

  useEffect(() => {
    if (framesToEth[frame]) {
      setEthAddress(framesToEth[frame])
    }
  }, [frame, framesToEth])

  const framesToEthLength = Object.keys(framesToEth).length
  const videoLink = `${backend}/video`

  return (
    <div className={mainBox}>
      <div className={playerBox}>
        <Player
          theme={theme}
          className={playerStyles}
          aspectRatio={md ? '16:9' : '1:1'}
          onVmCurrentTimeChange={(currentTime) =>
            onTimeUpdate(currentTime.detail)
          }
          onVmPlayingChange={() => setDragPause(false)}
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
        {!framesToEth || loading ? (
          <Loader size="small" />
        ) : (
          <>
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
          </>
        )}
      </div>

      <div className={ethAddressBox}>
        <BodyText>ETH ADDRESS</BodyText>

        <Link
          to={{ pathname: `https://etherscan.io/address/${ethAddress}` }}
          target="_blank"
        >
          <p className={ethText}>{ethAddress}</p>
        </Link>
      </div>

      {userAddress && !userFrame && (
        <div className={marginBottom}>
          {invited ? (
            <Button
              onClick={async () => {
                await mintAddress()
                setTimeout(() => reloadVideo(AppStore.userFrame), 3000)
              }}
              loading={mintLoading}
            >
              Mint my Dosu Invite for {truncateMiddle(userAddress)}
            </Button>
          ) : (
            <BodyText>
              Your Ethereum address wasn't whitelisted for Dosu Invite NFTs. Try
              another one?
            </BodyText>
          )}
        </div>
      )}

      {userAddress && userFrame && (
        <div className={marginBottom}>
          {mintLoading ? (
            <Loader />
          ) : (
            <BodyText>
              Your invite is #{userFrame},{' '}
              <LinkText>
                <button
                  onClick={() => {
                    if (AppStore.userFrame) {
                      setDragFrame(AppStore.userFrame)
                    }
                  }}
                >
                  go check it out
                </button>
              </LinkText>
            </BodyText>
          )}
        </div>
      )}
    </div>
  )
}

export default observer(Main)
