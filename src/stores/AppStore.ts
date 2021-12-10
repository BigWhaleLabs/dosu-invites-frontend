import { ethers } from 'ethers'
import { proxy } from 'valtio'
import Language from 'models/Language'
import PersistableStore from 'stores/persistence/PersistableStore'

export type Theme = 'dark' | 'light'

class AppStore extends PersistableStore {
  language: Language = Language.en
  theme: Theme = 'dark'
  cookieAccepted = false
  metaMaskInstalled = false
  userAddress = ''
  minted = false
  // TODO: add link to exact frame and hang listener on contract

  toggleDark() {
    this.theme = this.theme === 'dark' ? 'light' : 'dark'
  }

  acceptCookie() {
    this.cookieAccepted = true
  }

  async isMetaMaskConnected() {
    const provider = this.getProvider()
    if (provider) {
      const accounts = await provider.listAccounts()
      if (accounts.length === 0) {
        this.userAddress = ''
      }
    } else {
      this.userAddress = ''
    }
  }

  setupListeners() {
    const provider = this.getProvider()
    if (provider) {
      provider.on('error', (error: Error) => {
        console.error(error)
      })
    }
  }

  getProvider() {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        'rinkeby'
      )
      this.metaMaskInstalled = true
      return provider
    } else {
      this.metaMaskInstalled = false
    }
  }

  async connectMetaMask() {
    const provider = this.getProvider()

    if (provider) {
      await provider.send('eth_requestAccounts', [])

      const signer = provider.getSigner()
      this.userAddress = await signer.getAddress()
    }
  }
}

export default proxy(new AppStore()).makePersistent()
