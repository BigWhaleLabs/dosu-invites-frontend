import { ErrorList } from 'helpers/handleError'
import { MerkleTree } from 'merkletreejs'
import getAllowlist from 'helpers/getAllowlist'
import keccak256 from 'keccak256'

export default function generateMerkleProof(ethAddress: string) {
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
