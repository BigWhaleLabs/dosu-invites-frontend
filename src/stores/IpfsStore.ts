import { BigNumber } from 'ethers'
import { proxy } from 'valtio'
import dosuInvites from 'helpers/dosuInvites'
import getAllowlist from 'helpers/getAllowlist'

type IpfsStoreType = {
  allowlist: Promise<string[]>
  totalMinted: Promise<BigNumber>

  requestAllowlist: () => void
  requestTotalMinted: () => void
}

const IpfsStore = proxy<IpfsStoreType>({
  allowlist: Promise.resolve([]),
  totalMinted: Promise.resolve(BigNumber.from(0)),

  requestAllowlist: () => {
    IpfsStore.allowlist = getAllowlist()
  },
  requestTotalMinted: () => {
    IpfsStore.totalMinted = dosuInvites.totalSupply()
  },
})

export default IpfsStore
