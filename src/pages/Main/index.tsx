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
import EthStore from 'stores/EthStore'
import Footer from 'components/Footer'
import FramesStore from 'stores/FramesStore'
import Loader from 'components/Loader'
import truncateMiddle from 'helpers/truncateMiddle'
import useIpfs from 'pages/Main/useIpfs'
import useNft from 'pages/Main/useNft'
import useVideo from 'pages/Main/useVideo'
import VideoBlock from 'components/VideoBlock'

const mainBox = classnames(
  display('flex'),
  flexDirection('flex-col'),
  justifyContent('justify-center'),
  alignItems('items-center'),
  zIndex('z-10')
)
const marginBottom = classnames(margin('mb-12'))

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
  const { userAddress, allowListed, ethLoading } = useSnapshot(EthStore)
  const { mintAddress, mintLoading } = useNft()
  const { ipfsLink } = useIpfs()
  const { setDragFrame, reloadVideo } = useVideo()

  return (
    <div className={mainBox}>
      <Suspense fallback={<Loader size="small" />}>
        <VideoBlock />
      </Suspense>

      <div className={ethAddressBox}>
        <BodyText>ETH ADDRESS</BodyText>

        <LinkText>
          <a
            href={`https://etherscan.io/address/${FramesStore.ethAddress}`}
            target="_blank"
            className={ethText}
          >
            {FramesStore.ethAddress}
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
                <LinkText>
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
