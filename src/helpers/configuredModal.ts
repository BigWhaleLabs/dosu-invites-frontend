import { Bitski } from 'bitski'
import Fortmatic from 'fortmatic'
import WalletConnect from '@walletconnect/web3-provider'
import WalletLink from 'walletlink'
import Web3Modal from 'web3modal'
import usePreferredTheme from 'helpers/usePreferredTheme'

const infuraId = import.meta.env.VITE_INFURA_ID as string
const fortmaticNetwork = {
  rpcUrl: 'https://rpc-mainnet.maticvigil.com',
  chainId: 137,
}

const configuredModal = new Web3Modal({
  cacheProvider: true,
  theme: 'dark',
  disableInjectedProvider: false,
  providerOptions: {
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
    walletlink: {
      package: WalletLink,
      options: {
        appName: 'Dosu-Invites',
        infuraId,
        darkMode: usePreferredTheme() === 'dark' ? true : false,
      },
    },
    bitski: {
      package: Bitski,
      options: {
        clientId: import.meta.env.VITE_BITSKI_CLIENT_ID,
        callbackUrl: `${window.location.origin}/callback.html`,
      },
    },
    binancechainwallet: {
      package: true,
    },
  },
})

export default configuredModal
