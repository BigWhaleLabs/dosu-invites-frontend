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
      this.setupListeners()
    } else {
      this.userAddress = ''
    }
  }

  async connectMetaMask() {
    const provider = this.getProvider()

    if (!provider) return

    await provider.send('eth_requestAccounts', [])
    const signer = provider.getSigner()
    this.userAddress = await signer.getAddress()
  }

  handleAccountChanged(accounts: string[]) {
    if (accounts.length === 0) {
      this.userAddress = ''
    } else if (accounts[0] !== this.userAddress) {
      this.userAddress = accounts[0]
    }
  }

  setupListeners() {
    window.ethereum.on('error', (error: Error) => {
      console.error(error)
    })
    window.ethereum.on('accountsChanged', async (accounts: string[]) => {
      this.handleAccountChanged(accounts)
      await this.checkInvite()
    })
  }

  getProvider() {
    if (!window.ethereum) {
      this.metaMaskInstalled = false
      return
    }

    const provider = new ethers.providers.Web3Provider(
      window.ethereum,
      import.meta.env.VITE_ETH_NETWORK as string
    )
    this.metaMaskInstalled = true
    return provider
  }

  getContract() {
    const provider = this.getProvider()
    if (!provider) return

    const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS as string
    const contractAbi = getContractABI()

    const contract = new ethers.Contract(
      contractAddress,
      contractAbi,
      provider.getSigner()
    )

    return contract
  }

  async checkInvite() {
    await this.isMetaMaskConnected()
    const contract = this.getContract()
    if (!contract || !this.userAddress) return

    const { _hex } = await contract.checkTokenId(this.userAddress)
    const frame = +_hex
    if (frame >= 0) {
      this.userFrame = frame
    } else {
      this.userFrame = undefined
    }
  }

  async mintNFT() {
    const contract = this.getContract()
    if (!contract) return

    const transaction = await contract.mint(this.userAddress)
    await transaction.wait()
  }
}

export default proxy(new AppStore()).makePersistent()
