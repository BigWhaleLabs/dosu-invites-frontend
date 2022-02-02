import { Abi__factory } from 'helpers/abiTypes/factories/Abi__factory'
import { ethers } from 'ethers'
import { proxy } from 'valtio'
import PersistableStore from 'stores/persistence/PersistableStore'

export type Theme = 'dark' | 'light'

const provider = new ethers.providers.Web3Provider(
  window.ethereum,
  import.meta.env.VITE_ETH_NETWORK as string
)

export const contract = Abi__factory.connect(
  import.meta.env.VITE_CONTRACT_ADDRESS as string,
  provider.getSigner()
)

class NftStore extends PersistableStore {
  metaMaskInstalled = false
  userAddress = ''
  userFrame: number | undefined

  async isMetaMaskConnected() {
    if (!provider) this.userAddress = ''

    const accounts = await provider.listAccounts()
    this.handleAccountChanged(accounts)
    this.setupListeners()
  }

  async connectMetaMask() {
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

  checkProvider() {
    if (!provider) {
      this.metaMaskInstalled = false
      return
    }

    this.metaMaskInstalled = true
    return provider
  }

  getContract() {
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

export default proxy(new NftStore()).makePersistent()
