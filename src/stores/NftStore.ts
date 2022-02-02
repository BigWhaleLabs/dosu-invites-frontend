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
  userAddress = ''
  tokenId = 0

  async checkMetaMask() {
    if (!provider) {
      this.userAddress = ''
      return
    }

    await this.handleAccountChanged(await provider.listAccounts())
    this.setupListeners()
  }

  async connectMetaMask() {
    await provider.send('eth_requestAccounts', [])
    this.userAddress = await signer.getAddress()
  }

  async handleAccountChanged(accounts: string[]) {
    if (accounts.length === 0) {
      this.userAddress = ''
    } else if (accounts[0] !== this.userAddress) {
      this.userAddress = accounts[0]
      await this.checkTokenId()
    }
  }

  setupListeners() {
    window.ethereum.on('error', (error: Error) => {
      console.error(error)
    })
    window.ethereum.on('accountsChanged', async (accounts: string[]) => {
      await this.handleAccountChanged(accounts)
    })
  }

  async checkTokenId() {
    if (!contract || !this.userAddress) return

    const { _hex } = await contract.checkTokenId(this.userAddress)
    const tokenId = +_hex

    if (tokenId) {
      this.tokenId = tokenId
      return
    }
  }

  async mintNFT() {
    const transaction = await contract.mint(this.userAddress)
    await transaction.wait()
  }
}

export default proxy(new NftStore()).makePersistent()
