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
import classnames, { borderRadius, height } from 'classnames/tailwind'
import env from 'helpers/env'
import useSafeId from 'helpers/useSafeId'

const image = classnames(height('h-fit'), borderRadius('rounded-3xl'))

function OwnerBlock() {
  const { ownerAddress } = useSnapshot(IpfsStore)

  return (
    !!ownerAddress && (
      <SubheaderText>
        Owner:{' '}
        <LinkText href={`https://ropsten.etherscan.io/address/${ownerAddress}`}>
          {ownerAddress}
        </LinkText>
      </SubheaderText>
    )
  )
}

function NFTFragment() {
  const { totalMinted } = useSnapshot(IpfsStore)
  const [imageLoading, setImageLoading] = useState<boolean>()
  const navigate = useNavigate()
  const total = totalMinted.toNumber()
  const safeId = useSafeId()

  useEffect(() => {
    function initialize() {
      if (total <= 0) return
      return safeId > total
        ? navigate('/not-found')
        : IpfsStore.requestOwnerAddress(safeId)
    }

    void initialize()
  }, [safeId, navigate, total])

  return !total ? (
    <SubheaderText>
      No invites minted yet, be the first one to mint!
    </SubheaderText>
  ) : (
    <>
      {imageLoading && <LoadingImage />}
      <img
        src={`${env.VITE_IPFS_ENDPOINT}/${safeId || 1}.png`}
        className={image}
        onLoad={() => setImageLoading(false)}
        onLoadStart={() => setImageLoading(true)}
        onError={() => {
          setImageLoading(false)
          handleError(
            safeId > total
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
