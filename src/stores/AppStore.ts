import * as api from 'helpers/api'
import { ethers } from 'ethers'
import { proxy } from 'valtio'
import Language from 'models/Language'
import PersistableStore from 'stores/persistence/PersistableStore'
import getContractABI from 'helpers/getContractABI'

export type Theme = 'dark' | 'light'

class AppStore extends PersistableStore {
  language: Language = Language.en
  theme: Theme = 'dark'
  cookieAccepted = false
  metaMaskInstalled = false
  userAddress = ''
  userFrame: number | undefined

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
      this.handleAccountChanged(accounts)
    } else {
      this.userAddress = ''
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

  handleAccountChanged(accounts: string[]) {
    if (accounts.length === 0) {
      this.userAddress = ''
    } else if (accounts[0] !== this.userAddress) {
      this.userAddress = accounts[0]
    }
  }

  setupListeners() {
    const provider = this.getProvider()
    if (provider) {
      provider.on('error', (error: Error) => {
        console.error(error)
      })
      provider.on('accountsChanged', this.handleAccountChanged)
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
    const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS as string
    const contractAbi = getContractABI()

    if (provider) {
      const contract = new ethers.Contract(
        contractAddress,
        contractAbi,
        provider.getSigner()
      )

      return contract
    }
  }

  async checkInvite() {
    const contract = this.getContract()
    if (contract && this.userAddress) {
      const data = await contract.checkTokenId(this.userAddress)
      const frame = +data._hex
      if (frame && frame > 0) {
        this.userFrame = frame - 1
      }
    }
  }

  async mintNFT() {
    await api.mintNFT(this.userAddress)
  }
}

export default proxy(new AppStore()).makePersistent()
