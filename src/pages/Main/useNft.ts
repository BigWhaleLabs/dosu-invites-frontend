import * as api from 'helpers/api'
import { useEffect } from 'preact/hooks'
import { useSnapshot } from 'valtio'
import { useState } from 'react'
import AppStore from 'stores/AppStore'
import Invites from 'models/Invites'

export default function useNft() {
  const { userAddress, userFrame } = useSnapshot(AppStore)

  const [loading, setLoading] = useState(false)
  const [invited, setInvited] = useState(false)
  const [framesToEth, setFramesToEth] = useState<Invites>({})
  const [mintLoading, setMintLoading] = useState(false)

  const getMintedAddresses = async () => {
    setLoading(true)
    try {
      setFramesToEth(await api.getMintedAddresses())
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const mintAddress = async () => {
    if (!userFrame) {
      try {
        setMintLoading(true)
        await AppStore.mintNFT()
        await AppStore.checkInvite()
        await getMintedAddresses()
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
    void getMintedAddresses()
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
    framesToEth,
    loading,
    invited,
    getMintedAddresses,
    mintAddress,
    mintLoading,
  }
}
