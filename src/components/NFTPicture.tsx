/* eslint-disable valtio/state-snapshot-rule */
import { ErrorList, handleError } from 'helpers/handleError'
import { FC, Suspense } from 'react'
import { LinkText, SubheaderText } from 'components/Text'
import { useEffect, useState } from 'preact/hooks'
import { useNavigate } from 'react-router-dom'
import { useSnapshot } from 'valtio'
import ErrorBoundary from 'components/ErrorBoundary'
import IpfsStore from 'stores/IpfsStore'
import Loader from 'components/Loader'
import classnames, { borderRadius, height } from 'classnames/tailwind'
import dosuInvites from 'helpers/dosuInvites'
import env from 'helpers/env'
import useLocation from 'components/useLocation'

const image = classnames(height('h-fit'), borderRadius('rounded-3xl'))

const OwnerBlock: FC<{ id: number }> = ({ id }) => {
  const [ownerAddress, setOwnerAddress] = useState('')

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

const NFTFragment: FC<{ id: number }> = ({ id }) => {
  const { totalFrame } = useSnapshot(IpfsStore)
  const [imageLoading, setImageLoading] = useState(true)
  const navigate = useNavigate()
  const total = totalFrame.toNumber()

  useEffect(() => {
    function initialize() {
      if (total <= 0) {
        return
      }
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
      {imageLoading && <SubheaderText>Loading image</SubheaderText>}
      <img
        src={`${env.VITE_IPFS_ENDPOINT}/${id || 1}.png`}
        className={image}
        onLoad={() => setImageLoading(false)}
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
  IpfsStore.requestTotalFrames()

  return (
    <>
      <ErrorBoundary fallbackText="Something went wrong, please, try again later!">
        <Suspense fallback={<Loader />}>
          <NFTFragment id={safeId} />
        </Suspense>
      </ErrorBoundary>
    </>
  )
}
