import * as api from 'helpers/api'
import { useEffect } from 'preact/hooks'
import { useState } from 'react'
import AppStore from 'stores/AppStore'

export default function useNft() {
  const [ipfsLink, setIpfsLink] = useState<string | undefined>()

  useEffect(() => {
    async function checkTokenURI() {
      if (AppStore.userFrame !== undefined) {
        const tokenURI = await api.getIpfsLink(AppStore.userFrame)
        if (tokenURI) {
          setIpfsLink(tokenURI)
        }
      }
    }

    void checkTokenURI()
  }, [])

  return {
    ipfsLink,
  }
}
