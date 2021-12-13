import { ethers } from 'ethers'
import { proxy } from 'valtio'
import Language from 'models/Language'
import PersistableStore from 'stores/persistence/PersistableStore'
import contractAbi from 'pages/Main/contractAbi.json'

export type Theme = 'dark' | 'light'

const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS as string

class AppStore extends PersistableStore {
  language: Language = Language.en
  theme: Theme = 'dark'
  cookieAccepted = false
  metaMaskInstalled = false
  userAddress = ''
  minted = false

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
        import.meta.env.VITE_ETH_NETWORK as string
      )
      this.metaMaskInstalled = true
      return provider
    } else {
      this.metaMaskInstalled = false
    }
  }

  getContract() {
    const provider = this.getProvider()
    if (provider) {
      const contract = new ethers.Contract(
        contractAddress,
        contractAbi,
        provider.getSigner()
      )

      return contract
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

  async checkInvite() {
    const contract = this.getContract()
    if (contract && this.userAddress && contractAddress) {
      this.minted = !+(await contract.balanceOf(this.userAddress))
    }
  }
}

export default proxy(new AppStore()).makePersistent()
