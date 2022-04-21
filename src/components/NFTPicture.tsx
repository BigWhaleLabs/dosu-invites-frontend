import { ErrorList, handleError } from 'helpers/handleError'
import { SubheaderText } from 'components/Text'
import { useEffect, useState } from 'preact/hooks'
import Loader from 'components/Loader'
import WalletStore from 'stores/WalletStore'
import classnames, { borderRadius, height } from 'classnames/tailwind'
import env from 'helpers/env'
import useLocation from 'components/useLocation'

const image = classnames(height('h-fit'), borderRadius('rounded-3xl'))

export default function NFTPicture() {
  const [tokenId, setTokenId] = useState<number>()
  const [owner, setOwner] = useState<string>()
  const [imgLoading, setImgLoading] = useState(true)
  const { id } = useLocation()

  useEffect(() => {
    async function checkOwner() {
      setTokenId(id)
      setOwner(await WalletStore.checkTokenIdOwner(tokenId ? tokenId : 0))
    }

    void checkOwner()
  }, [id, tokenId])

  return (
    <>
      {owner ? (
        <>
          <img
            src={`${env.VITE_IPFS_ENDPOINT}/${tokenId}.png`}
            className={image}
            onLoad={() => setImgLoading(false)}
            onError={() => {
              setImgLoading(false)
              handleError(ErrorList.ipfsImage)
            }}
          />

          {imgLoading && <Loader />}
          <SubheaderText>{owner}</SubheaderText>
        </>
      ) : (
        <SubheaderText>No invites minted yet</SubheaderText>
      )}
    </>
  )
}
