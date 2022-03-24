import { useSnapshot } from 'valtio'
import { useState } from 'react'
import EthStore from 'stores/EthStore'
import FramesStore from 'stores/FramesStore'

export default function useNft() {
  const { tokenId } = useSnapshot(EthStore)

  const [mintLoading, setMintLoading] = useState(false)

  const mintAddress = async () => {
    if (tokenId !== undefined) return
    try {
      setMintLoading(true)
      await EthStore.mintNFT()
      FramesStore.requestFrames()
      setMintLoading(false)
    } catch (error) {
      setMintLoading(false)
      console.error(error)
    }
  }

  return {
    mintAddress,
    mintLoading,
  }
}
