import { handleError } from 'helpers/handleError'
import { useSnapshot } from 'valtio'
import { useState } from 'react'
import FramesStore from 'stores/FramesStore'
import WalletStore from 'stores/WalletStore'

export default function useNft() {
  const { tokenId } = useSnapshot(WalletStore)

  const [mintLoading, setMintLoading] = useState(false)

  async function mintAddress() {
    if (tokenId !== undefined) return
    try {
      setMintLoading(true)
      await WalletStore.mintNFT()
      FramesStore.requestFrames()
      setMintLoading(false)
    } catch (error) {
      setMintLoading(false)
      handleError(error)
    }
  }

  return {
    mintAddress,
    mintLoading,
  }
}
