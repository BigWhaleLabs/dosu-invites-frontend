import { providers } from 'ethers'

export default new providers.InfuraProvider(import.meta.env.VITE_ETH_NETWORK, {
  projectId: import.meta.env.VITE_INFURA_ID,
})
