import { MetaMaskInpageProvider } from '@ethersproject/providers'

declare global {
  interface Window {
    ethereum: MetaMaskInpageProvider
    eth: MetaMaskInpageProvider
    web3: MetaMaskInpageProvider
  }
}
