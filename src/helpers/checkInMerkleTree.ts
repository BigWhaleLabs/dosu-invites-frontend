import * as api from 'helpers/api'
import { MerkleTree } from 'merkletreejs'
import keecak256 from 'keccak256'

export default async function checkInMerkleTree(addressFrame: number) {
  const addresses = await api.getMintedAddresses()

  const leafNodes = Object.values(addresses).map((address: string) =>
    keecak256(address)
  )
  const merkleTree = new MerkleTree(leafNodes, keecak256, {
    sortLeaves: true,
    sortPairs: true,
  })
  const rootHash = merkleTree.getRoot()

  const claimingAddress = leafNodes[addressFrame]
  const hexProof = merkleTree.getHexProof(claimingAddress)

  // Should be implemented is Solidity smart contract
  return merkleTree.verify(hexProof, claimingAddress, rootHash)
}
