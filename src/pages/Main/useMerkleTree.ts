import { useEffect } from 'preact/hooks'
import { useSnapshot } from 'valtio'
import { useState } from 'react'
import EthStore from 'stores/EthStore'
import checkInMerkleTree from 'helpers/checkInMerkleTree'

export default function useMerkleTree() {
  const { userAddress } = useSnapshot(EthStore)

  const [merkleVerified, setMerkleVerified] = useState(false)

  useEffect(() => {
    async function check() {
      setMerkleVerified(await checkInMerkleTree(userAddress))
    }

    void check()
  }, [userAddress])

  return {
    merkleVerified,
  }
}
