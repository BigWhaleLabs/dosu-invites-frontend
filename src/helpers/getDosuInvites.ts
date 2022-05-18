import { DosuInvites__factory } from '@big-whale-labs/dosu-invites-contract/dist/typechain'
import { providers } from 'ethers'
import env from 'helpers/env'

export default function getDosuInvites(
  provider: providers.JsonRpcSigner | providers.Provider
) {
  return DosuInvites__factory.connect(
    env.VITE_DOSU_INVITES_CONTRACT_ADDRESS,
    provider
  )
}
