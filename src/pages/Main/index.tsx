import { BodyText, LinkText } from 'components/Text'
import { Button } from 'components/Button'
import { Suspense, useEffect } from 'react'
import {
  alignItems,
  borderRadius,
  classnames,
  display,
  flexDirection,
  height,
  justifyContent,
  margin,
  maxHeight,
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
import truncateMiddle from 'helpers/truncateMiddle'
import useIpfs from 'pages/Main/useIpfs'
import useNft from 'pages/Main/useNft'

const mainBox = classnames(
  display('flex'),
  flexDirection('flex-col'),
  justifyContent('justify-center'),
  alignItems('items-center'),
  zIndex('z-10')
)
const marginBottom = classnames(margin('mb-6'))
const altImg = classnames(
  height('h-fit'),
  maxHeight('max-h-max'),
  borderRadius('rounded-3xl')
)

const inviteText = classnames(
  display('flex'),
  flexDirection('flex-col'),
  justifyContent('justify-center'),
  alignItems('items-center')
)

const marginWrapper = classnames(margin('my-12'))

function Main() {
  const { userAddress, ethLoading } = useSnapshot(EthStore)
  const { framesToEthLength } = useSnapshot(FramesStore)
  const { dragFrame } = useSnapshot(PlayerStore)
  const { mintAddress, mintLoading } = useNft()
  const { ipfsLink, ipfsLoading } = useIpfs()

  useEffect(() => {
    FramesStore.requestFrames()
  }, [])

  const hasTokenId = EthStore.tokenId !== undefined

  return (
    <div className={mainBox}>
      {!framesToEthLength || dragFrame > framesToEthLength ? (
        <img
          className={altImg}
          src={!framesToEthLength ? 'img/blurInvite.png' : 'img/noInvite.png'}
        />
      ) : (
        <img className={altImg} src={ipfsLink} />
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

      {userAddress && EthStore.tokenId === undefined && (
        <div className={marginBottom}>
          {ethLoading ? (
            <Loader />
          ) : (
            <Button
              onClick={async () => {
                await mintAddress()
                setTimeout(() => FramesStore.requestFrames(), 10000)
              }}
              loading={mintLoading}
            >
              Mint my Dosu Invite for {truncateMiddle(userAddress)}
            </Button>
          )}
        </div>
      )}

      {userAddress && hasTokenId && (
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
                      if (EthStore.tokenId !== undefined)
                        PlayerStore.updateDragFrame(EthStore.tokenId)
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

      <Footer />
    </div>
  )
}

export default observer(Main)
