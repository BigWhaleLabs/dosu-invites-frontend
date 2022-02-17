// import { Bitski } from 'bitski'
import Fortmatic from 'fortmatic'
import WalletConnect from '@walletconnect/web3-provider'
import Web3Modal from 'web3modal'
import usePreferredTheme from 'helpers/usePreferredTheme'

const infuraId = import.meta.env.VITE_INFURA_ID as string
const fortmaticNetwork = {
  rpcUrl: 'https://rpc-mainnet.maticvigil.com',
  chainId: 137,
}

const configuredModal = new Web3Modal({
  // cacheProvider: true,
  theme: usePreferredTheme(),
  providerOptions: {
    // TODO: Throws an error `https.Agent is not a constructor`
    // torus: {
    //   package: Torus,
    //   options: {
    //     networkParams: {
    //       host: 'https://localhost:8545',
    //       chainId: 1337,
    //       networkId: 1337,
    //     },
    //     config: {
    //       buildEnv: 'development',
    //     },
    //   },
    // },
    fortmatic: {
      package: Fortmatic,
      options: {
        key: import.meta.env.VITE_FORTMATIC_KEY as string,
        network: fortmaticNetwork, // defaults to localhost:8454
      },
    },
    walletconnect: {
      package: WalletConnect,
      options: {
        infuraId,
      },
    },
    // bitski: {
    //   package: Bitski,
    //   options: {
    //     clientId: import.meta.env.VITE_BITSKI_CLIENT_ID,
    //     callbackUrl: import.meta.env.VITE_BITSKI_CALLBACK_URL,
    //   },
    // },
    // TODO: Need to be configure manually, because API is different
    // binancechainwallet: {
    //   package: true,
    // },
  },
})

export default configuredModal
