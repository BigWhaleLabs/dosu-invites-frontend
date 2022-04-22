import { BigNumber } from 'ethers'
import { proxy } from 'valtio'
import dosuInvites from 'helpers/dosuInvites'

const IpfsStore = proxy({
  totalMinted: Promise.resolve(BigNumber.from(0)),
  owner: Promise.resolve(''),

  requestTotalMinted: () => {
    IpfsStore.totalMinted = dosuInvites.totalSupply()
  },
  requestOwnerAddress(id: number) {
    IpfsStore.owner = dosuInvites.ownerOf(id)
  },
})

export default IpfsStore
