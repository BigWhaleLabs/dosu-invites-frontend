import { Abi__factory } from 'helpers/abiTypes/factories/Abi__factory'
import { ethers } from 'ethers'
import { proxy } from 'valtio'
import PersistableStore from 'stores/persistence/PersistableStore'

const provider = new ethers.providers.Web3Provider(
  window.ethereum,
  import.meta.env.VITE_ETH_NETWORK as string
)

const signer = provider.getSigner()

const contract = Abi__factory.connect(
  import.meta.env.VITE_CONTRACT_ADDRESS as string,
  signer
)

class NftStore extends PersistableStore {
  metaMaskInstalled = false
  userAddress = ''
  tokenId: number | undefined

  async isMetaMaskConnected() {
    if (!provider) this.userAddress = ''

    const accounts = await provider.listAccounts()
    this.handleAccountChanged(accounts)
    this.setupListeners()
  }

  async connectMetaMask() {
    await provider.send('eth_requestAccounts', [])
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
      await this.checkTokenId()
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

  async checkTokenId() {
    if (!contract || !this.userAddress) return

    const { _hex } = await contract.checkTokenId(this.userAddress)
    const tokenId = +_hex
    if (tokenId >= 0) {
      this.tokenId = tokenId
    } else {
      this.tokenId = undefined
    }
  }

  async mintNFT() {
    const transaction = await contract.mint(this.userAddress)
    await transaction.wait()
  }
}

export default proxy(new NftStore()).makePersistent()
