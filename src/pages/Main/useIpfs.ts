import * as api from 'helpers/api'
import { useEffect } from 'preact/hooks'
import { useSnapshot } from 'valtio'
import { useState } from 'react'
import NftStore from 'stores/NftStore'

export default function useNft() {
  const { tokenId } = useSnapshot(NftStore)

  const [ipfsLink, setIpfsLink] = useState<string>()

  useEffect(() => {
    async function checkTokenURI() {
      if (NftStore.tokenId === undefined) return

      const tokenURI = await api.getIpfsLink(NftStore.tokenId)

      if (tokenURI) setIpfsLink(tokenURI)
    }

    void checkTokenURI()
  }, [tokenId])

  return {
    ipfsLink,
  }
}
