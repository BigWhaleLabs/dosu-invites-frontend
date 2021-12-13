import { Button } from 'components/Button'
import { DefaultUi, LoadingScreen, Player, Poster, Video } from '@vime/react'
import { Link, useHistory } from 'react-router-dom'
import { TinyText } from 'components/Text'
import { classnames } from 'classnames/tailwind'
import { ethers } from 'ethers'
import { observer } from 'mobx-react-lite'
import { useEffect, useRef } from 'preact/hooks'
import { useSnapshot } from 'valtio'
import { useState } from 'react'
import AppStore from 'stores/AppStore'
import Draggable from 'react-draggable'
import Loader from 'components/Loader'
import contractAbi from 'pages/Main/contractAbi.json'
import truncateMiddle from 'helpers/truncateMiddle'
import useBreakpoints from 'helpers/useBreakpoints'
import useMain from 'pages/Main/useMain'

const backend =
  (import.meta.env.VITE_BACKEND as string) || 'https://backend.invites.dosu.io'

const contractAddress =
  (import.meta.env.CONTRACT_ADDRESS as string) ||
  '0xcb9e9375ed92570e87d61d6989f1485793820bb1'

const mainBox = classnames('flex', 'flex-col', 'content-center', 'items-center')

const playerBox = classnames('flex', 'items-center', 'w-full', 'rounded-3xl')
const playerStyles = classnames('w-full')

const marginBottom = classnames('mb-12')

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
  'flex',
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
  const { theme, userAddress, minted } = useSnapshot(AppStore)

  const { framesToEth, invited } = useMain()

  const history = useHistory()

  const [frame, setFrame] = useState(0)
  const [dragFrame, setDragFrame] = useState(0)
  const [pause, setPause] = useState(true)
  const [ethAddress, setEthAddress] = useState('0x')
  const [mintLoading, setMintLoading] = useState(false)

  const size = useBreakpoints()

  const videoLink = `${backend}/video`
  const player = useRef<HTMLVmPlayerElement>(null)
  const video = document.querySelector('video')

  const draggableGrid = 16
  const framesToEthLength = framesToEth.length

  useEffect(() => {
    if (video) {
      video.playbackRate = 16.0
    }
  }, [video])

  useEffect(() => {
    if (framesToEth[frame]) {
      setEthAddress(framesToEth[frame].ethAddress)
    }
  }, [frame, framesToEth])

  useEffect(() => {
    if (player.current) {
      player.current.currentTime = dragFrame
      player.current.paused = false
    }
  }, [dragFrame])

  useEffect(() => {
    if (player.current && player.current.ready) {
      history.push(frame.toString())
    }
  }, [history, frame])

  useEffect(() => {
    const locationFrame = +location.pathname.split('/')[1]
    if (player.current) {
      setDragFrame(locationFrame)
    }
  }, [])

  const onTimeUpdate = (time: number) => {
    if (pause) {
      video?.pause()
    }
    setFrame(Math.floor(time))
  }

  const mintAddress = async () => {
    const provider = AppStore.getProvider()
    if (provider) {
      try {
        const contract = new ethers.Contract(
          contractAddress,
          contractAbi,
          provider.getSigner()
        )
        setMintLoading(true)
        const transaction = await contract.mint(userAddress)
        await transaction.wait()
        setMintLoading(false)
        AppStore.minted = true
      } catch (error) {
        setMintLoading(false)
        console.error(error)
      }
    }
  }

  return (
    <div className={mainBox}>
      <div className={playerBox}>
        <Player
          ref={player}
          theme={theme}
          className={playerStyles}
          aspectRatio={size.md ? '16:9' : '1:1'}
          onVmCurrentTimeChange={(currentTime) =>
            onTimeUpdate(currentTime.detail)
          }
          autoplay={true}
          onVmPlayingChange={() => setPause(false)}
        >
          <Video poster="img/poster" crossOrigin="anonymous">
            <source data-src={videoLink} type="video/mp4" />
          </Video>
          <Poster fit="fill" />
          {dragFrame > framesToEthLength ? (
            <img
              className="h-fit"
              src={size.md ? 'img/noInvite169.png' : 'img/noInvite11.png'}
            />
          ) : (
            <DefaultUi noCaptions noLoadingScreen noSettings noSpinner>
              <LoadingScreen hideDots>
                <Loader />
              </LoadingScreen>
            </DefaultUi>
          )}
        </Player>
      </div>

      <div className={draggableBox}>
        {!framesToEth ? (
          <Loader size="small" />
        ) : (
          <>
            <Draggable
              bounds={{
                left: -draggableGrid * framesToEthLength * 1.8,
                right: 0,
              }}
              grid={[draggableGrid, draggableGrid]}
              positionOffset={{
                x: `calc(50% - 0.85rem)`,
                y: 0,
              }}
              position={{ x: -frame * draggableGrid * 2, y: 0 }}
              axis="x"
              onDrag={(_e, data) => {
                setPause(true)
                setDragFrame(frame + -data.deltaX / draggableGrid)
              }}
              onStop={() => setPause(false)}
            >
              <div className={draggableText}>
                {framesToEth.map((data) => (
                  <div className={draggableSymbolBox}>
                    <p className={draggableSymbol}>{data.frame}</p>
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

        <Link
          to={{ pathname: `https://etherscan.io/address/${ethAddress}` }}
          target="_blank"
        >
          <p className={ethText}>{ethAddress}</p>
        </Link>
      </div>

      {userAddress && !minted && (
        <div className={marginBottom}>
          {invited ? (
            <Button
              onClick={async () => await mintAddress()}
              loading={mintLoading}
            >
              Mint my Dosu Invite for {truncateMiddle(userAddress)}
            </Button>
          ) : (
            <TinyText>
              Your Ethereum address wasn't whitelisted for Dosu Invite NFTs. Try
              another one?
            </TinyText>
          )}
        </div>
      )}

      {userAddress && minted && (
        <div className={marginBottom}>
          <TinyText>Your NFT was minted!</TinyText>
        </div>
      )}
    </div>
  )
}

export default observer(Main)
