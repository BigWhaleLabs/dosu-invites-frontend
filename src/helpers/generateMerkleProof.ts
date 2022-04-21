import { ErrorList } from 'helpers/handleError'
import { MerkleTree } from 'merkletreejs'
import { utils } from 'ethers'
import getAllowlist from 'helpers/getAllowlist'

export default async function checkInMerkleTree(ethAddress: string) {
  const addresses = await getAllowlist()

  const leafNodes = addresses.map((address: string) => utils.keccak256(address))
  const merkleTree = new MerkleTree(leafNodes, utils.keccak256, {
    sortPairs: true,
  })

  const claimingIndex = addresses.findIndex((address) => address === ethAddress)

  if (claimingIndex < 0) throw new Error(ErrorList.invalidProof)

  const claimingAddress = leafNodes[claimingIndex]
  const hexProof = merkleTree.getHexProof(claimingAddress)

  return hexProof
}
