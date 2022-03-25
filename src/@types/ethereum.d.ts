import { CoinbaseWalletProvider } from '@coinbase/wallet-sdk'

declare global {
  interface Window {
    ethereum: CoinbaseWalletProvider
  }
}
