import { Abi } from 'helpers/abiTypes/Abi'
import { Abi__factory } from 'helpers/abiTypes/factories/Abi__factory'
import { Web3Provider } from '@ethersproject/providers'
import { proxy } from 'valtio'
import PersistableStore from 'stores/persistence/PersistableStore'
import Web3Modal from 'web3modal'

let provider: Web3Provider
let contract: Abi

class EthStore extends PersistableStore {
  userAddress = ''
  tokenId: number | undefined

  checkEthAvailability() {
    return !!window.ethereum
  }

  async connectBlockchain() {
    try {
      const web3Modal = await new Web3Modal({
        cacheProvider: true,
        providerOptions: {
          binancechainwallet: {
            package: true,
          },
        },
      }).connect()

      provider = new Web3Provider(web3Modal)

      await this.handleAccountChanged(await provider.listAccounts())
      this.setupListeners()

      contract = Abi__factory.connect(
        import.meta.env.VITE_CONTRACT_ADDRESS as string,
        provider.getSigner()
      )
    } catch (error) {
      console.error(error)
    }
  }

  async handleAccountChanged(accounts: string[]) {
    if (accounts.length === 0) {
      this.userAddress = ''
      this.tokenId = undefined
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
    window.ethereum.on('disconnect', async (accounts: string[]) => {
      await this.handleAccountChanged(accounts)
    })
  }

  async checkTokenId() {
    if (!contract || !this.userAddress) return

    if (!+(await contract.balanceOf(this.userAddress))) {
      this.tokenId = undefined
      return
    }

    const { _hex } = await contract.checkTokenId(this.userAddress)
    const tokenId = +_hex

    this.tokenId = tokenId
  }

  async mintNFT() {
    if (!contract) return

    const transaction = await contract.mint(this.userAddress)
    await transaction.wait()
  }
}

export default proxy(new EthStore()).makePersistent()
