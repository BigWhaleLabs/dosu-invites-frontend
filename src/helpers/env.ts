import {
  DOSU_INVITES_CONTRACT_ADDRESS,
  ETH_NETWORK,
  ETH_RPC,
  FORTMATIC_KEY,
} from '@big-whale-labs/constants'

export default {
  VITE_DOSU_INVITES_CONTRACT_ADDRESS:
    (import.meta.env.VITE_DOSU_INVITES_CONTRACT_ADDRESS as string) ||
    DOSU_INVITES_CONTRACT_ADDRESS,
  VITE_FORTMATIC_KEY:
    (import.meta.env.VITE_FORTMATIC_KEY as string) || FORTMATIC_KEY,
  VITE_APP_NAME: import.meta.env.VITE_APP_NAME as string,
  VITE_ETH_NETWORK: (import.meta.env.VITE_ETH_NETWORK as string) || ETH_NETWORK,
  VITE_ETH_RPC: (import.meta.env.VITE_ETH_RPC as string) || ETH_RPC,
  VITE_ALLOWLIST_ENDPOINT: import.meta.env.VITE_ALLOWLIST_ENDPOINT as string,
  VITE_IPFS_ENDPOINT: import.meta.env.VITE_IPFS_ENDPOINT as string,
}
