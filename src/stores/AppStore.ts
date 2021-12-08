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
  provider: ethers.providers.Web3Provider | undefined

  toggleDark() {
    this.theme = this.theme === 'dark' ? 'light' : 'dark'
  }

  acceptCookie() {
    this.cookieAccepted = true
  }

  setEthAddress(userAddress: string) {
    this.userAddress = userAddress
  }

  setProvider(provider: ethers.providers.Web3Provider) {
    this.provider = provider
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
    if (this.provider) {
      const accounts = await this.provider.listAccounts()
      if (accounts.length === 0) {
        this.userAddress = ''
      }
    } else {
      this.userAddress = ''
    }
  }

  setupListeners() {
    if (this.provider) {
      this.provider.on('error', (error: Error) => {
        console.error(error)
      })
    }
  }

  async connectMetaMask() {
    if (this.isMetaMaskInstalled()) {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        'rinkeby'
      )

      await provider.send('eth_requestAccounts', [])

      const signer = provider.getSigner()
      this.setEthAddress(await signer.getAddress())
    }
  }
}

export default proxy(new AppStore()).makePersistent()
