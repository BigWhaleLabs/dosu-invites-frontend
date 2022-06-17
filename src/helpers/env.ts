import {
  DOSU_INVITES_CONTRACT_ADDRESS,
  ETH_NETWORK,
  ETH_RPC,
} from '@big-whale-labs/constants'
import { cleanEnv, str } from 'envalid'

export default cleanEnv(import.meta.env, {
  VITE_DOSU_INVITES_CONTRACT_ADDRESS: str({
    default: DOSU_INVITES_CONTRACT_ADDRESS,
  }),
  VITE_APP_NAME: str(),
  VITE_ETH_NETWORK: str({ default: ETH_NETWORK }),
  VITE_ETH_RPC: str({ default: ETH_RPC }),
  VITE_ALLOWLIST_ENDPOINT: str(),
  VITE_IPFS_ENDPOINT: str(),
})
