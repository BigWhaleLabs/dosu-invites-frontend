import { ErrorList } from '@big-whale-labs/frontend-utils'
import { MerkleTree } from 'merkletreejs'
import { utils } from 'ethers'
import getAllowlist from 'helpers/getAllowlist'

export default async function (ethAddress: string) {
  const addresses = await getAllowlist()

  const leaf = utils.keccak256(ethAddress)
  const leafNodes = addresses.map((address: string) => utils.keccak256(address))
  const merkleTree = new MerkleTree(leafNodes, utils.keccak256, {
    sortPairs: true,
  })

  const claimingIndex = leafNodes.findIndex((address) => address === leaf)

  if (claimingIndex < 0) throw new Error(ErrorList.invalidProof)

  const claimingAddress = leafNodes[claimingIndex]
  const hexProof = merkleTree.getHexProof(claimingAddress)

  return hexProof
}
