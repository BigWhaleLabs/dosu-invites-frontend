import { ErrorList, handleError } from 'helpers/handleError'
import { LinkText, SubheaderText } from 'components/Text'
import { useEffect, useState } from 'preact/hooks'
import { useNavigate } from 'react-router-dom'
import Loader from 'components/Loader'
import classnames, { borderRadius, height } from 'classnames/tailwind'
import dosuInvites from 'helpers/dosuInvites'
import env from 'helpers/env'
import useLocation from 'components/useLocation'

const image = classnames(height('h-fit'), borderRadius('rounded-3xl'))

enum LoadingStatus {
  clear = '',
  fetchingTotalSupply = 'Fetching total token supply...',
  error = 'Something went wrong, please, try again later!',
}

export default function NFTPicture() {
  const [ownerAddress, setOwnerAddress] = useState<string>()
  const [loading, setLoading] = useState(true)
  const [imageLoading, setImageLoading] = useState(true)
  const [totalSupply, setTotalSupply] = useState<number>()
  const [loadingStatus, setLoadingStatus] = useState(LoadingStatus.clear)
  const { id } = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    async function initialize() {
      const safeId = Number(id || 1)
      setLoading(true)
      try {
        setLoadingStatus(LoadingStatus.fetchingTotalSupply)
        const totalSupplyFromBlockchain = (
          await dosuInvites.totalSupply()
        ).toNumber()
        setTotalSupply(totalSupplyFromBlockchain)
        if (totalSupplyFromBlockchain <= 0) {
          setLoading(false)
          setLoadingStatus(LoadingStatus.clear)
          return
        }
        if (safeId > totalSupplyFromBlockchain) {
          return navigate('/not-found')
        }
        const ownerAddress = await dosuInvites.ownerOf(safeId)
        setOwnerAddress(ownerAddress)
        setLoading(false)
        setLoadingStatus(LoadingStatus.clear)
      } catch (error) {
        handleError(error)
        setLoadingStatus(LoadingStatus.error)
      }
    }

    void initialize()
  }, [id, navigate])

  return (
    <>
      {loadingStatus && <SubheaderText>{loadingStatus}</SubheaderText>}
      {loading ? (
        <Loader />
      ) : !totalSupply ? (
        <SubheaderText>
          No invites minted yet, be the first one to mint!
        </SubheaderText>
      ) : (
        <>
          {imageLoading && <Loader />}
          <img
            src={`${env.VITE_IPFS_ENDPOINT}/${id || 1}.png`}
            className={image}
            onLoad={() => setImageLoading(false)}
            onError={() => {
              setImageLoading(false)
              handleError(ErrorList.ipfsImage)
            }}
          />
          {ownerAddress && (
            <SubheaderText>
              Owner:{' '}
              <LinkText
                href={`https://ropsten.etherscan.io/address/${ownerAddress}`}
              >
                {ownerAddress}
              </LinkText>
            </SubheaderText>
          )}
        </>
      )}
    </>
  )
}
