import { proxy } from 'valtio'
import getAllowlist from 'helpers/getAllowlist'

type IpfsStoreType = {
  allowlist: Promise<string[]>
  requestAllowlist: () => void
}

const IpfsStore = proxy<IpfsStoreType>({
  allowlist: Promise.resolve([]),
  requestAllowlist: () => {
    IpfsStore.allowlist = getAllowlist()
  },
})

export default IpfsStore
