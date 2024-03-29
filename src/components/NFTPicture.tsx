import { ErrorList, handleError } from '@big-whale-labs/frontend-utils'
import { LinkText, SubheaderText } from 'components/Text'
import { Suspense } from 'react'
import { useEffect, useState } from 'preact/hooks'
import { useNavigate } from 'react-router-dom'
import { useSnapshot } from 'valtio'
import ErrorBoundary from 'components/ErrorBoundary'
import IpfsStore from 'stores/IpfsStore'
import Loader from 'components/Loader'
import LoadingImage from 'components/LoadingImage'
import classnames, {
  borderRadius,
  display,
  height,
  margin,
} from 'classnames/tailwind'
import env from 'helpers/env'
import truncateMiddle from 'helpers/truncateMiddle'
import useBreakpoints from 'helpers/useBreakpoints'
import useSafeId from 'helpers/useSafeId'

const image = (isHidden: boolean) =>
  classnames(
    display(isHidden ? 'hidden' : 'block'),
    height('h-fit'),
    borderRadius('rounded-3xl')
  )
const container = margin('mt-4')

function OwnerBlock() {
  const { ownerAddress } = useSnapshot(IpfsStore)
  const { md } = useBreakpoints()

  return (
    <>
      {!!ownerAddress && (
        <div className={container}>
          <SubheaderText>
            Owner:{' '}
            <LinkText
              href={`https://rinkeby.etherscan.io/address/${ownerAddress}`}
            >
              {md ? ownerAddress : truncateMiddle(ownerAddress)}
            </LinkText>
          </SubheaderText>
        </div>
      )}
    </>
  )
}

function NFTFragment() {
  const { totalMinted } = useSnapshot(IpfsStore)
  const [imageLoading, setImageLoading] = useState<boolean>()
  const navigate = useNavigate()
  const totalFrames = totalMinted.toNumber()
  const safeId = useSafeId()

  useEffect(() => {
    if (safeId > totalFrames && totalFrames > 0) {
      navigate('/not-found')
    } else if (safeId <= totalFrames) {
      IpfsStore.requestOwnerAddress(safeId)
    }
  }, [safeId, navigate, totalFrames])

  return !totalFrames ? (
    <SubheaderText>
      No invites minted yet, be the first one to mint!
    </SubheaderText>
  ) : (
    <>
      {imageLoading && <LoadingImage />}
      <img
        src={`${env.VITE_IPFS_ENDPOINT}/${safeId || 1}.png`}
        className={classnames(image(imageLoading || false))}
        onLoad={() => setImageLoading(false)}
        onLoadStart={() => setImageLoading(true)}
        onError={() => {
          setImageLoading(false)
          handleError(
            safeId > totalFrames
              ? ErrorList.notExistIpfsImage(safeId)
              : ErrorList.ipfsImageBeingLoaded
          )
        }}
      />
    </>
  )
}

export default function () {
  const safeId = useSafeId()
  return (
    <>
      {!!safeId && (
        <ErrorBoundary fallbackText="Something went wrong, please, try again later!">
          <Suspense fallback={<LoadingImage />}>
            <NFTFragment />
          </Suspense>

          <Suspense fallback={<Loader />}>
            <OwnerBlock />
          </Suspense>
        </ErrorBoundary>
      )}
    </>
  )
}
