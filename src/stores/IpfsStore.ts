import { proxy } from 'valtio'
import getAllowlist from 'helpers/getAllowlist'

const IpfsStore = proxy({
  allowlist: Promise.resolve(['']),
  requestAllowlist: () => {
    IpfsStore.allowlist = getAllowlist()
  },
})

export default IpfsStore
