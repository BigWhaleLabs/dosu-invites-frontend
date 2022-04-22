import { ErrorList, handleError } from 'helpers/handleError'
import { FC, Suspense } from 'react'
import { LinkText, SubheaderText } from 'components/Text'
import { useEffect, useState } from 'preact/hooks'
import { useNavigate } from 'react-router-dom'
import { useSnapshot } from 'valtio'
import ErrorBoundary from 'components/ErrorBoundary'
import IpfsStore from 'stores/IpfsStore'
import LoadingImage from 'components/LoadingImage'
import classnames, { borderRadius, height } from 'classnames/tailwind'
import dosuInvites from 'helpers/dosuInvites'
import env from 'helpers/env'
import useLocation from 'components/useLocation'

interface ComponentWithID {
  id: number
}
const image = classnames(height('h-fit'), borderRadius('rounded-3xl'))

const OwnerBlock: FC<ComponentWithID> = ({ id }) => {
  const [ownerAddress, setOwnerAddress] = useState<string>()

  useEffect(() => {
    async function requestOwner() {
      try {
        const owner = await dosuInvites.ownerOf(id)
        setOwnerAddress(owner)
      } catch (error) {
        handleError(`There is no owner with tokenId ${id}`)
      }
    }

    void requestOwner()
  }, [id])

  return (
    <SubheaderText>
      Owner:{' '}
      <LinkText href={`https://ropsten.etherscan.io/address/${ownerAddress}`}>
        {ownerAddress}
      </LinkText>
    </SubheaderText>
  )
}

function NFTFragment({ id }: ComponentWithID) {
  const { totalMinted } = useSnapshot(IpfsStore)
  const [imageLoading, setImageLoading] = useState<boolean>()
  const navigate = useNavigate()
  const total = totalMinted.toNumber()

  useEffect(() => {
    function initialize() {
      if (total <= 0) return
      if (id > total) {
        return navigate('/not-found')
      }
    }

    void initialize()
  }, [id, navigate, total])

  return !total ? (
    <SubheaderText>
      No invites minted yet, be the first one to mint!
    </SubheaderText>
  ) : (
    <>
      {imageLoading && <LoadingImage />}
      <img
        src={`${env.VITE_IPFS_ENDPOINT}/${id || 1}.png`}
        className={image}
        onLoad={() => setImageLoading(false)}
        onLoadStart={() => setImageLoading(true)}
        onError={() => {
          setImageLoading(false)
          handleError(
            id > total ? ErrorList.notExistIpfsImage(id) : ErrorList.ipfsImage
          )
        }}
      />
      <OwnerBlock id={id} />
    </>
  )
}

export default function NFTPicture() {
  const { id } = useLocation()
  const safeId = Number(id || 1)

  useEffect(() => {
    void IpfsStore.requestTotalMinted()
  }, [])

  return (
    <>
      <ErrorBoundary fallbackText="Something went wrong, please, try again later!">
        <Suspense fallback={<LoadingImage />}>
          <NFTFragment id={safeId} />
        </Suspense>
      </ErrorBoundary>
    </>
  )
}
