import { BigNumber } from 'ethers'
import { proxy } from 'valtio'
import dosuInvites from 'helpers/dosuInvites'
import getAllowlist from 'helpers/getAllowlist'

type IpfsStoreType = {
  allowlist: Promise<string[]>
  totalMinted: Promise<BigNumber>
  ownerAddress: string | undefined

  requestAllowlist: () => void
  requestTotalMinted: () => void
  requestOwnerAddress: (id: number) => void
}

const IpfsStore = proxy<IpfsStoreType>({
  allowlist: getAllowlist(),
  totalMinted: dosuInvites.totalSupply(),
  ownerAddress: undefined,

  requestAllowlist: () => {
    IpfsStore.allowlist = getAllowlist()
  },
  requestTotalMinted: () => {
    IpfsStore.totalMinted = dosuInvites.totalSupply()
  },
  requestOwnerAddress: async (id: number) => {
    IpfsStore.ownerAddress = await dosuInvites.ownerOf(id)
  },
})

export default IpfsStore
