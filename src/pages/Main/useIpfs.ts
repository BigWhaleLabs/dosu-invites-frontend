import { handleError } from 'helpers/handleError'
import { useEffect } from 'preact/hooks'
import { useSnapshot } from 'valtio'
import { useState } from 'react'
import EthStore from 'stores/EthStore'
import FramesStore from 'stores/FramesStore'
import PlayerStore from 'stores/PlayerStore'

export default function useNft() {
  const { tokenId } = useSnapshot(EthStore)
  const { frame } = useSnapshot(PlayerStore)
  const { displayedAddress } = useSnapshot(FramesStore)

  const baseIPFN =
    'https://ipfs.io/ipfs/bafybeib6lg74yzlelypw7zyvlzqnyccw7zuxzp3mefzbrzjuqbuvb5w6dy'

  const [ipfsLink, setIpfsLink] = useState<string>()
  const [ipfsLoading, setIpfsLoading] = useState(false)

  useEffect(() => {
    function checkTokenURI() {
      try {
        setIpfsLoading(true)

        if (!FramesStore.displayedAddress) return
        const ipfnFrame = `${baseIPFN}?filename=${frame}.png`

        if (ipfnFrame) setIpfsLink(ipfnFrame)
      } catch (error) {
        handleError(error)
      } finally {
        setIpfsLoading(false)
      }
    }

    void checkTokenURI()
  }, [tokenId, frame, displayedAddress])

  return {
    ipfsLink,
    ipfsLoading,
  }
}
