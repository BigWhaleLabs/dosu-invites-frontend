import * as api from 'helpers/api'
import { useEffect } from 'preact/hooks'
import { useSnapshot } from 'valtio'
import { useState } from 'react'
import AppStore from 'stores/AppStore'

export default function useNft() {
  const { userFrame } = useSnapshot(AppStore)

  const [ipfsLink, setIpfsLink] = useState<string>()

  useEffect(() => {
    async function checkTokenURI() {
      if (AppStore.userFrame === undefined) return

      const tokenURI = await api.getIpfsLink(AppStore.userFrame)
      if (tokenURI) {
        setIpfsLink(tokenURI)
      }
    }

    void checkTokenURI()
  }, [userFrame])

  return {
    ipfsLink,
  }
}
