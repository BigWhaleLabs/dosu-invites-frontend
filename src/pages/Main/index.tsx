import { BodyText, LinkText } from 'components/Text'
import { Button } from 'components/Button'
import { Link } from 'react-router-dom'
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
import AppStore from 'stores/AppStore'
import Footer from 'components/Footer'
import FramesStore from 'stores/FramesStore'
import Loader from 'components/Loader'
import truncateMiddle from 'helpers/truncateMiddle'
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

function Main() {
  const { userAddress, userFrame } = useSnapshot(AppStore)
  const { invited, mintAddress, mintLoading } = useNft()
  const { setDragFrame, reloadVideo } = useVideo()

  return (
    <div className={mainBox}>
      <Suspense fallback={<Loader size="small" />}>
        <VideoBlock />
      </Suspense>

      <div className={ethAddressBox}>
        <BodyText>ETH ADDRESS</BodyText>

        <Link
          to={{
            pathname: `https://etherscan.io/address/${FramesStore.ethAddress}`,
          }}
          target="_blank"
        >
          <p className={ethText}>{FramesStore.ethAddress}</p>
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
      <Footer />
    </div>
  )
}

export default observer(Main)
