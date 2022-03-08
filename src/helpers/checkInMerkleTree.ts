import * as api from 'helpers/api'
import { MerkleTree } from 'merkletreejs'
import keecak256 from 'keccak256'

export default async function checkInMerkleTree(claimingAddress: string) {
  const addresses = await api.getMintedAddresses()

  const leafNodes = Object.values(addresses).map((address) =>
    keecak256(address)
  )
  const merkleTree = new MerkleTree(leafNodes, keecak256, { sortPairs: true })
  const rootHash = merkleTree.getRoot()

  const hexProof = merkleTree.getHexProof(claimingAddress)
  console.log(hexProof)

  const result = merkleTree.verify(hexProof, claimingAddress, rootHash)
  console.log(result)
  return result
}
