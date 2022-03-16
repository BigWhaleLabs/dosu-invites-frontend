import { BodyText, LinkText } from 'components/Text'
import { Button } from 'components/Button'
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
import Draggable from 'react-draggable'
import EthStore from 'stores/EthStore'
import Footer from 'components/Footer'
import Loader from 'components/Loader'
import VideoJS from 'components/VideoJS'
import truncateMiddle from 'helpers/truncateMiddle'
import useBreakpoints from 'helpers/useBreakpoints'
import useIpfs from 'pages/Main/useIpfs'
import useMerkleTree from 'pages/Main/useMerkleTree'
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
const marginBottom = classnames(margin('mb-6'))

const altImg = classnames(height('h-fit'), borderRadius('rounded-3xl'))

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
  const { userAddress, ethLoading, allowListed } = useSnapshot(EthStore)
  const { framesToEth, loading, mintAddress, mintLoading } = useNft()
  const {
    draggableGrid,
    setDragPause,
    dragFrame,
    frame,
    setDragFrame,
    multiplier,
    reloadVideo,
    videoRef,
    setupVideo,
    videoJsOptions,
    onTimeUpdate,
  } = useVideo()
  const { ipfsLink } = useIpfs()
  const { merkleVerified } = useMerkleTree()
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
      {dragFrame > framesToEthLength ? (
        <img
          className={altImg}
          src={md ? 'img/noInvite169.png' : 'img/noInvite11.png'}
        />
      ) : (
        <VideoJS
          options={videoJsOptions}
          onReady={() => setupVideo()}
          videoRef={videoRef}
          videoLink={videoLink}
          onTimeUpdate={onTimeUpdate}
        />
      )}

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
                x: 'calc(50% - 0.85rem)',
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
                {Object.keys(framesToEth).map((frameId) => (
                  <div className={draggableSymbolBox}>
                    <p className={draggableSymbol}>{+frameId}</p>
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

        <LinkText>
          <a
            href={`https://etherscan.io/address/${ethAddress}`}
            target="_blank"
            className={ethText}
          >
            {ethAddress}
          </a>
        </LinkText>
      </div>

      {userAddress && EthStore.tokenId === undefined && (
        <div className={marginBottom}>
          {ethLoading ? (
            <Loader />
          ) : allowListed ? (
            <Button
              onClick={async () => {
                await mintAddress()
                setTimeout(() => reloadVideo(EthStore.tokenId), 10000)
              }}
              loading={mintLoading}
            >
              Mint my Dosu Invite for {truncateMiddle(userAddress)}
            </Button>
          ) : (
            <BodyText>
              Your Ethereum address wasn't allowlisted for Dosu Invite NFTs. Try
              another one?
            </BodyText>
          )}
        </div>
      )}

      {userAddress && EthStore.tokenId !== undefined && (
        <div className={marginBottom}>
          {ethLoading ? (
            <Loader size="small" />
          ) : (
            <div className={inviteText}>
              <BodyText>
                Your invite is #{EthStore.tokenId},{' '}
                <LinkText>
                  <button
                    onClick={() => {
                      if (EthStore.tokenId !== undefined) {
                        setDragFrame(EthStore.tokenId)
                      }
                    }}
                  >
                    go check it out
                  </button>
                </LinkText>
              </BodyText>
              {ipfsLink ? (
                <LinkText centered>
                  <a href={ipfsLink} target="_blank">
                    Look at Your frame at the InterPlanetary File System (IPFS)
                  </a>
                </LinkText>
              ) : undefined}
            </div>
          )}
        </div>
      )}

      <div className={marginBottom}>
        <BodyText>Merkle Verified: {merkleVerified ? '✔️' : '❌'}</BodyText>
      </div>

      <Footer />
    </div>
  )
}

export default observer(Main)
