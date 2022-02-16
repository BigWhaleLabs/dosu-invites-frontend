import Authereum from 'authereum'
import Fortmatic from 'fortmatic'
import Torus from '@toruslabs/torus-embed'
import WalletConnect from '@walletconnect/web3-provider'
import Web3Modal from 'web3modal'
import usePreferredTheme from 'helpers/usePreferredTheme'

const infuraId = import.meta.env.VITE_INFURA_ID as string
const fortmaticNetwork = {
  rpcUrl: 'https://rpc-mainnet.maticvigil.com',
  chainId: 137,
}

const configuredModal = new Web3Modal({
  cacheProvider: true,
  theme: usePreferredTheme(),
  providerOptions: {
    torus: {
      package: Torus,
      display: { name: 'Torus' },
    },
    fortmatic: {
      package: Fortmatic,
      options: {
        key: import.meta.env.VITE_FORTMATIC_KEY as string,
        network: fortmaticNetwork, // defaults to localhost:8454
      },
      display: { name: 'Fortmatic' },
    },
    authereum: {
      package: Authereum,
      display: { name: 'Authereum' },
    },
    walletconnect: {
      package: WalletConnect,
      options: {
        infuraId,
      },
      display: { name: 'Mobile' },
    },
    // bitski: {
    //   package: Bitski, // required
    //   options: {
    //     clientId: import.meta.env.VITE_BITSKI_CLIENT_ID,
    //     callbackUrl: import.meta.env.VITE_BITSKI_CALLBACK_URL,
    //   },
    // },
    binancechainwallet: {
      package: true,
      display: { name: 'Binance' },
    },
  },
})

export default configuredModal
