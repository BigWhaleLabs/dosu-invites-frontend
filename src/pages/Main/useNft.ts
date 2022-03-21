import * as api from 'helpers/api'
import { useEffect } from 'preact/hooks'
import { useSnapshot } from 'valtio'
import { useState } from 'react'
import EthStore from 'stores/EthStore'
import Invites from 'models/Invites'

export default function useNft() {
  const { tokenId } = useSnapshot(EthStore)

  const [loading, setLoading] = useState(false)
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
      await EthStore.mintNFT()
      await EthStore.checkTokenId()
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
      await EthStore.checkTokenId()
      setMintLoading(false)
    }

    void checkInvite()
    void getMintedAddresses()
  }, [])

  return {
    framesToEth,
    loading,
    getMintedAddresses,
    mintAddress,
    mintLoading,
  }
}
