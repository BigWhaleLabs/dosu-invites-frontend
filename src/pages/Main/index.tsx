import { BodyText, LinkText } from 'components/Text'
import { Button } from 'components/Button'
import { Suspense } from 'react'
import {
  alignItems,
  borderColor,
  borderRadius,
  borderWidth,
  classnames,
  display,
  flex,
  flexDirection,
  fontSize,
  height,
  justifyContent,
  margin,
  padding,
  textColor,
  textOverflow,
  userSelect,
  width,
  zIndex,
} from 'classnames/tailwind'
import { observer } from 'mobx-react-lite'
import { useSnapshot } from 'valtio'
import DragBlock from 'components/DragBlock'
import EthStore from 'stores/EthStore'
import Footer from 'components/Footer'
import FramesStore from 'stores/FramesStore'
import Loader from 'components/Loader'
import PlayerStore from 'stores/PlayerStore'
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

const marginWrapper = classnames(margin('my-12'))

function Main() {
  const { userAddress, allowListed, ethLoading } = useSnapshot(EthStore)
  const { framesToEthLength } = useSnapshot(FramesStore)
  const { dragFrame } = useSnapshot(PlayerStore)
  const { mintAddress, mintLoading } = useNft()
  const { ipfsLink, ipfsLoading } = useIpfs()
  const { merkleVerified } = useMerkleTree()
  const { reloadVideo, videoRef, setupVideo, videoJsOptions, onTimeUpdate } =
    useVideo()
  const { md } = useBreakpoints()

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

      <Suspense
        fallback={
          <div className={marginWrapper}>
            <Loader size="small" />
          </div>
        }
      >
        <DragBlock />
      </Suspense>

      <div className={ethAddressBox}>
        <BodyText>ETH ADDRESS</BodyText>
        {EthStore.ethAddress && framesToEthLength > 0 && (
          <LinkText>
            <a
              href={`https://etherscan.io/address/${EthStore.ethAddress}`}
              target="_blank"
              className={ethText}
            >
              {EthStore.ethAddress}
            </a>
          </LinkText>
        )}
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
                        PlayerStore.updateDragFrame(EthStore.tokenId)
                      }
                    }}
                  >
                    go check it out
                  </button>
                </LinkText>
              </BodyText>
              {ipfsLoading ? (
                <Loader size="small" />
              ) : ipfsLink ? (
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
