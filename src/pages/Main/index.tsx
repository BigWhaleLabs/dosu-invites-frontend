import { BodyText, LinkText } from 'components/Text'
import { Button } from 'components/Button'
import { DefaultUi, Player, Poster, Video } from '@vime/react'
import { Link } from 'react-router-dom'
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
  justifyContent,
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
  zIndex,
} from 'classnames/tailwind'
import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'preact/hooks'
import { useSnapshot } from 'valtio'
import AppStore from 'stores/AppStore'
import Draggable from 'react-draggable'
import Footer from 'components/Footer'
import Loader from 'components/Loader'
import truncateMiddle from 'helpers/truncateMiddle'
import useBreakpoints from 'helpers/useBreakpoints'
import useIpfs from 'pages/Main/useIpfs'
import useNft from 'pages/Main/useNft'
import useVideo from 'pages/Main/useVideo'

const backend = import.meta.env.VITE_BACKEND as string

const mainBox = classnames(
  display('flex'),
  flexDirection('flex-col'),
  justifyContent('justify-center'),
  alignItems('items-center'),
  zIndex('z-10')
)
const marginBottom = classnames(margin('mb-12'))

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

const ethAddressBox = classnames(
  flex('flex-auto'),
  flexDirection('flex-col'),
  width('w-full'),
  borderRadius('rounded-3xl'),
  borderWidth('border-2'),
  borderColor('border-border'),
  margin('mx-auto', marginBottom),
  padding('p-6')
)

const ethText = classnames(
  textColor('text-primary'),
  fontSize('text-sm', 'md:text-lg'),
  userSelect('select-all'),
  textOverflow('truncate')
)

const inviteText = classnames(
  display('flex'),
  flexDirection('flex-col'),
  justifyContent('justify-center'),
  alignItems('items-center')
)

function Main() {
  const { theme, userAddress, userFrame } = useSnapshot(AppStore)
  const { framesToEth, loading, invited, mintAddress, mintLoading } = useNft()
  const { ipfsLink } = useIpfs()
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

      {userAddress && userFrame === undefined && (
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

      {userAddress && userFrame !== undefined && (
        <div className={marginBottom}>
          {mintLoading ? (
            <Loader size="small" />
          ) : (
            <div className={inviteText}>
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
              {ipfsLink ? (
                <LinkText>
                  <a href={ipfsLink} target="_blank">
                    Look at Your frame at the InterPlanetary File System
                  </a>
                </LinkText>
              ) : undefined}
            </div>
          )}
        </div>
      )}
      <Footer />
    </div>
  )
}

export default observer(Main)
