import { DosuInvites__factory } from '@big-whale-labs/dosu-invites-contract/dist/typechain'
import { providers } from 'ethers'

export default function getDosuInvites(
  provider: providers.JsonRpcSigner | providers.Provider
) {
  return DosuInvites__factory.connect(
    import.meta.env.VITE_CONTRACT_ADDRESS,
    provider
  )
}
