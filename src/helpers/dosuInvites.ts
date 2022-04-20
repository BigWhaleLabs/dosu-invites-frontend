import { DosuInvites__factory } from '@big-whale-labs/dosu-invites-contract/dist/typechain'
import { providers } from 'ethers'

const provider = new providers.InfuraProvider(
  import.meta.env.VITE_ETH_NETWORK,
  {
    projectId: import.meta.env.VITE_INFURA_ID,
  }
)

export default function dosuInvites(
  provide?: providers.JsonRpcSigner | providers.Provider
) {
  return DosuInvites__factory.connect(
    import.meta.env.VITE_CONTRACT_ADDRESS,
    provide || provider
  )
}
