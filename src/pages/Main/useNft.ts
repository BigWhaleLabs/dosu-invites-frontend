import * as api from 'helpers/api'
import { useEffect } from 'preact/hooks'
import { useSnapshot } from 'valtio'
import { useState } from 'react'
import Invites from 'models/Invites'
import NftStore from 'stores/NftStore'

export default function useNft() {
  const { tokenId, userAddress } = useSnapshot(NftStore)

  const [loading, setLoading] = useState(false)
  const [invited, setInvited] = useState(false)
  const [framesToEth, setFramesToEth] = useState<Invites>({})
  const [mintLoading, setMintLoading] = useState(false)

  const getMintedAddresses = async () => {
    try {
      setLoading(true)
      setFramesToEth(await api.getMintedAddresses())
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const mintAddress = async () => {
    if (tokenId && tokenId >= 0) return

    try {
      setMintLoading(true)
      await NftStore.mintNFT()
      await NftStore.checkTokenId()
      await getMintedAddresses()
      setMintLoading(false)
    } catch (error) {
      setMintLoading(false)
      console.error(error)
    }
  }

  useEffect(() => {
    async function checkInvite() {
      setMintLoading(true)
      await NftStore.checkTokenId()
      setMintLoading(false)
    }

    void checkInvite()
    void getMintedAddresses()
  }, [])

  useEffect(() => {
    const checkUserInvite = async () => {
      if (NftStore.userAddress)
        setInvited(await api.checkInvite(NftStore.userAddress))
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
