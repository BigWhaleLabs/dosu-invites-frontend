import AppStore from 'stores/AppStore'
import CoinbaseWalletSDK from '@coinbase/wallet-sdk'
import WalletConnect from '@walletconnect/web3-provider'
import Web3Modal from 'web3modal'
import env from 'helpers/env'

const rpc = env.VITE_ETH_RPC
const network = env.VITE_ETH_NETWORK
const appName = env.VITE_APP_NAME
const theme = AppStore.theme

export default new Web3Modal({
  cacheProvider: true,
  theme,
  disableInjectedProvider: false,
  network,
  providerOptions: {
    walletconnect: {
      package: WalletConnect,
      options: {
        rpc: {
          5: rpc,
        },
      },
    },
    coinbasewallet: {
      package: CoinbaseWalletSDK,
      options: {
        appName,
        rpc: {
          5: rpc,
        },
        darkMode: theme === 'dark' ? true : false,
      },
    },
  },
})
