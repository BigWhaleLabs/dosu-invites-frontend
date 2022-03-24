import * as api from 'helpers/api'
import { useEffect } from 'preact/hooks'
import { useSnapshot } from 'valtio'
import { useState } from 'react'
import EthStore from 'stores/EthStore'

export default function useNft() {
  const { tokenId } = useSnapshot(EthStore)

  const [ipfsLink, setIpfsLink] = useState<string>()

  useEffect(() => {
    async function checkTokenURI() {
      if (EthStore.tokenId === undefined) return

      const tokenURI = await api.getIpfsLink(EthStore.tokenId)

      if (tokenURI) setIpfsLink(tokenURI)
    }

    void checkTokenURI()
  }, [tokenId])

  return {
    ipfsLink,
  }
}
