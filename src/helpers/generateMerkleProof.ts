import { ErrorList } from 'helpers/handleError'
import { MerkleTree } from 'merkletreejs'
import { keccak256 } from 'ethers/lib/utils'
import getAllowlist from 'helpers/getAllowlist'

export default function checkInMerkleTree(ethAddress: string) {
  const addresses = getAllowlist()

  const leafNodes = addresses.map((address: string) => keccak256(address))
  const merkleTree = new MerkleTree(leafNodes, keccak256, {
    sortPairs: true,
  })

  const claimingIndex = addresses.findIndex((address) => address === ethAddress)

  if (claimingIndex < 0) throw new Error(ErrorList.invalidProof)

  const claimingAddress = leafNodes[claimingIndex]
  const hexProof = merkleTree.getHexProof(claimingAddress)

  return hexProof
}
