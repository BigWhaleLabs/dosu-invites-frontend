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
import abi from 'pages/Main/abi.json'
import useBreakpoints from 'helpers/useBreakpoints'
import useMain from 'pages/Main/useMain'

const backend =
  (import.meta.env.VITE_BACKEND as string) || 'https://backend.invites.dosu.io'

const contractAddress = '0x0d0a4686dfB7a4f4Fe87fB478fe08953b9ed216d'

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
  const { theme, userAddress } = useSnapshot(AppStore)

  const [minted, setMinted] = useState(false)

  const { framesToEthMap, invited } = useMain()

  const history = useHistory()

  const [frame, setFrame] = useState(0)
  const [dragFrame, setDragFrame] = useState(0)
  const [pause, setPause] = useState(true)
  const [ethAddress, setEthAddress] = useState('0x')

  const size = useBreakpoints()

  const videoLink = `${backend}/video`
  const player = useRef<HTMLVmPlayerElement>(null)
  const video = document.querySelector('video')

  const draggableGrid = 16
  const framesToEthMapKeys = Object.keys(framesToEthMap)
  const framesToEthMapLength = framesToEthMapKeys.length

  useEffect(() => {
    if (video) {
      video.playbackRate = 16.0
    }
  }, [video])

  useEffect(() => {
    setEthAddress(framesToEthMap[frame])
  }, [frame, framesToEthMap])

  useEffect(() => {
    if (player && player.current) {
      player.current.currentTime = dragFrame
      player.current.paused = false
    }
  }, [dragFrame, player])

  useEffect(() => {
    if (player.current && player.current.ready) {
      history.push(frame.toString())
    }
  }, [history, frame])

  useEffect(() => {
    const locationFrame = +location.pathname.split('/')[1]
    if (player.current) {
      setDragFrame(
        locationFrame > framesToEthMapLength - 1
          ? framesToEthMapLength - 1
          : locationFrame
      )
    }
  }, [framesToEthMapLength])

  const onTimeUpdate = (time: number) => {
    if (pause) {
      video?.pause()
    }
    setFrame(Math.floor(time))
  }

  const mintAddress = async () => {
    const provider = AppStore.getProvider()
    if (import.meta.env.VITE_CONTRACT_PRIVATE_KEY && provider) {
      try {
        const contract = new ethers.Contract(
          contractAddress,
          abi,
          provider.getSigner()
        )

        contract.mint(userAddress)
        await contract.mint(userAddress)
        setMinted(true)
      } catch (error) {
        console.error(error)
        setMinted(false)
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

          <DefaultUi noCaptions noLoadingScreen noSettings noSpinner>
            <LoadingScreen hideDots>
              <Loader />
            </LoadingScreen>
          </DefaultUi>
        </Player>
      </div>

      <div className={draggableBox}>
        {!framesToEthMap ? (
          <Loader size="small" />
        ) : (
          <>
            <Draggable
              bounds={{
                left: -draggableGrid * framesToEthMapLength * 1.8,
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
                {framesToEthMapKeys.map((frame) => (
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
            <Button onClick={async () => await mintAddress()}>
              Mint my Dosu Invite for {userAddress.substring(0, 7)}...
              {userAddress.slice(-3)}
            </Button>
          ) : (
            <TinyText>
              Your Ethereum address wasn't whitelisted for Dosu Invite NFTs. Try
              another one?
            </TinyText>
          )}
        </div>
      )}
    </div>
  )
}

export default observer(Main)
