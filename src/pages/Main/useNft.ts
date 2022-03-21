import * as api from 'helpers/api'
import { useEffect } from 'preact/hooks'
import { useSnapshot } from 'valtio'
import { useState } from 'react'
import AppStore from 'stores/AppStore'
import SuspenseState from 'stores/SuspenseStore'

export default function useNft() {
  const { userAddress, userFrame } = useSnapshot(AppStore)

  const [invited, setInvited] = useState(false)
  const [mintLoading, setMintLoading] = useState(false)

  const mintAddress = async () => {
    if (!userFrame) {
      try {
        setMintLoading(true)
        await AppStore.mintNFT()
        await AppStore.checkInvite()
        SuspenseState.requestFrames()
        setMintLoading(false)
      } catch (error) {
        setMintLoading(false)
        console.error(error)
      }
    }
  }

  useEffect(() => {
    async function checkInvite() {
      setMintLoading(true)
      await AppStore.checkInvite()
      setMintLoading(false)
    }

    void checkInvite()
  }, [])

  useEffect(() => {
    const checkUserInvite = async () => {
      if (AppStore.userAddress) {
        setInvited(await api.checkInvite(AppStore.userAddress))
      }
    }

    void checkUserInvite()
  }, [userAddress])

  return {
    invited,
    mintAddress,
    mintLoading,
  }
}
