import { ErrorList, handleError } from 'helpers/handleError'
import { LinkText, SubheaderText } from 'components/Text'
import { Suspense } from 'react'
import { useEffect, useState } from 'preact/hooks'
import { useNavigate } from 'react-router-dom'
import { useSnapshot } from 'valtio'
import ErrorBoundary from 'components/ErrorBoundary'
import IpfsStore from 'stores/IpfsStore'
import Loader from 'components/Loader'
import LoadingImage from 'components/LoadingImage'
import classnames, { borderRadius, display, height } from 'classnames/tailwind'
import env from 'helpers/env'
import useSafeId from 'helpers/useSafeId'
import truncateMiddle from 'helpers/truncateMiddle'
import useBreakpoints from 'helpers/useBreakpoints'

const image = (isHidden: boolean) =>
  classnames(
    display(isHidden ? 'hidden' : 'block'),
    height('h-fit'),
    borderRadius('rounded-3xl')
  )

function OwnerBlock() {
  const { ownerAddress } = useSnapshot(IpfsStore)
  const { md } = useBreakpoints()

  return (
    <>
      {!!ownerAddress && (
        <SubheaderText>
          Owner:{' '}
          <LinkText
            href={`https://ropsten.etherscan.io/address/${ownerAddress}`}
          >
            {md ? ownerAddress : truncateMiddle(ownerAddress)}
          </LinkText>
        </SubheaderText>
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
    function initialize() {
      if (totalFrames <= 0) return
      if (safeId > totalFrames) navigate('/not-found')
      if (safeId <= totalFrames) IpfsStore.requestOwnerAddress(safeId)
    }

    void initialize()
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
              : ErrorList.ipfsImage
          )
        }}
      />
      <Suspense fallback={<Loader />}>
        <OwnerBlock />
      </Suspense>
    </>
  )
}

export default function NFTPicture() {
  return (
    <>
      <ErrorBoundary fallbackText="Something went wrong, please, try again later!">
        <Suspense fallback={<LoadingImage />}>
          <NFTFragment />
        </Suspense>
      </ErrorBoundary>
    </>
  )
}
