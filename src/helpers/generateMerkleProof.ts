import { MerkleTree } from 'merkletreejs'
import { utils } from 'ethers'
import getAllowlist from 'helpers/getAllowlist'

export default function checkInMerkleTree(ethAddress: string) {
  const addresses = getAllowlist()

  const leafNodes = Object.values(addresses).map((address: string) =>
    utils.keccak256(address)
  )
  const merkleTree = new MerkleTree(leafNodes, utils.keccak256, {
    sortLeaves: true,
  })

  const claimingIndex = addresses.findIndex((address) => address === ethAddress)
  console.log(addresses)
  console.log(ethAddress)
  console.log(claimingIndex)

  // if (!claimingIndex) return 'Looks like you dont have an invite'

  const claimingAddress = leafNodes[claimingIndex]
  const hexProof = merkleTree.getProof(utils.keccak256(ethAddress))
  console.log(claimingAddress)
  console.log(hexProof)

  return hexProof
}
