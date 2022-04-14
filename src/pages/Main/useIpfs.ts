import * as api from 'helpers/api'
import { handleError } from 'helpers/handleError'
import { useEffect } from 'preact/hooks'
import { useSnapshot } from 'valtio'
import { useState } from 'react'
import EthStore from 'stores/EthStore'

export default function useNft() {
  const { tokenId } = useSnapshot(EthStore)

  const [ipfsLink, setIpfsLink] = useState<string>()
  const [ipfsLoading, setIpfsLoading] = useState(false)

  useEffect(() => {
    async function checkTokenURI() {
      try {
        setIpfsLoading(true)

        if (EthStore.tokenId === undefined) return

        const tokenURI = await api.getIpfsLink(EthStore.tokenId)

        if (tokenURI) setIpfsLink(tokenURI)
      } catch (error) {
        handleError(error)
      } finally {
        setIpfsLoading(false)
      }
    }

    void checkTokenURI()
  }, [tokenId])

  return {
    ipfsLink,
    ipfsLoading,
  }
}
