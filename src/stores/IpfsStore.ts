import { BigNumber } from 'ethers'
import { proxy } from 'valtio'
import dosuInvites from 'helpers/dosuInvites'
import getAllowlist from 'helpers/getAllowlist'

type IpfsStoreType = {
  allowlist: Promise<string[]>
  totalMinted: Promise<BigNumber>
  ownerAddress: Promise<string | undefined>

  requestAllowlist: () => void
  requestTotalMinted: () => void
  requestOwnerAddress: (id: number) => void
}

const IpfsStore = proxy<IpfsStoreType>({
  allowlist: getAllowlist(),
  totalMinted: dosuInvites.totalSupply(),
  ownerAddress: Promise.resolve<string | undefined>(undefined),

  requestAllowlist: () => {
    IpfsStore.allowlist = getAllowlist()
  },
  requestTotalMinted: () => {
    IpfsStore.totalMinted = dosuInvites.totalSupply()
  },
  requestOwnerAddress: async (id: number) => {
    IpfsStore.ownerAddress = Promise.resolve(await dosuInvites.ownerOf(id))
  },
})

export default IpfsStore
