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

  toggleDark() {
    this.theme = this.theme === 'dark' ? 'light' : 'dark'
  }

  acceptCookie() {
    this.cookieAccepted = true
  }

  setEthAddress(userAddress: string) {
    this.userAddress = userAddress
  }

  isMetaMaskInstalled() {
    if (typeof window.ethereum === 'undefined') {
      this.metaMaskInstalled = false
      return false
    }
    this.metaMaskInstalled = true
    return true
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

      provider.on('disonnect', () => {
        this.userAddress = ''
      })
    }
  }

  getProvider() {
    const provider = new ethers.providers.Web3Provider(
      window.ethereum,
      'rinkeby'
    )
    return provider
  }

  async connectMetaMask() {
    if (this.isMetaMaskInstalled()) {
      const provider = this.getProvider()

      await provider.send('eth_requestAccounts', [])

      const signer = provider.getSigner()
      this.setEthAddress(await signer.getAddress())
    }
  }
}

export default proxy(new AppStore()).makePersistent()
