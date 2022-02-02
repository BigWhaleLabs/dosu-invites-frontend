import * as api from 'helpers/api'
import { useEffect } from 'preact/hooks'
import { useSnapshot } from 'valtio'
import { useState } from 'react'
import NftStore from 'stores/NftStore'

export default function useNft() {
  const { userFrame } = useSnapshot(NftStore)

  const [ipfsLink, setIpfsLink] = useState<string>()

  useEffect(() => {
    async function checkTokenURI() {
      if (NftStore.userFrame === undefined) return

      const tokenURI = await api.getIpfsLink(NftStore.userFrame)

      if (tokenURI) setIpfsLink(tokenURI)
    }

    void checkTokenURI()
  }, [userFrame])

  return {
    ipfsLink,
  }
}
