import { handleError } from 'helpers/handleError'
import { useSnapshot } from 'valtio'
import { useState } from 'react'
import EthStore from 'stores/EthStore'
import FramesStore from 'stores/FramesStore'

export default function useNft() {
  const { tokenId } = useSnapshot(EthStore)

  const [mintLoading, setMintLoading] = useState(false)

  async function mintAddress() {
    if (tokenId !== undefined) return
    try {
      setMintLoading(true)
      await EthStore.mintNFT()
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
