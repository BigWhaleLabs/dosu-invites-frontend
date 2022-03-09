import { useEffect } from 'preact/hooks'
import { useSnapshot } from 'valtio'
import { useState } from 'react'
import EthStore from 'stores/EthStore'
import checkInMerkleTree from 'helpers/checkInMerkleTree'

export default function useMerkleTree() {
  const { tokenId } = useSnapshot(EthStore)

  const [merkleVerified, setMerkleVerified] = useState(false)

  useEffect(() => {
    async function check() {
      if (tokenId !== undefined) {
        setMerkleVerified(await checkInMerkleTree(tokenId))
      }
    }

    void check()
  }, [tokenId])

  return {
    merkleVerified,
  }
}
