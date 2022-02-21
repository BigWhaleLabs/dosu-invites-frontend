import { Abi } from 'helpers/abiTypes/Abi'
import { Abi__factory } from 'helpers/abiTypes/factories/Abi__factory'
import { Web3Provider } from '@ethersproject/providers'
import { proxy } from 'valtio'
import PersistableStore from 'stores/persistence/PersistableStore'
import configuredModal from 'helpers/configuredModal'

let provider: Web3Provider
let contract: Abi

class EthStore extends PersistableStore {
  userAddress = ''
  tokenId: number | undefined

  async onConnect() {
    try {
      const instance = await configuredModal.connect()

      provider = new Web3Provider(instance)
      this.subscribeProvider(provider)

      contract = Abi__factory.connect(
        import.meta.env.VITE_CONTRACT_ADDRESS as string,
        provider.getSigner()
      )

      await this.handleAccountChanged(await provider.listAccounts())
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

  subscribeProvider(provider: Web3Provider) {
    if (!provider.on || !window.ethereum || !window.ethereum.on) return

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
    try {
      if (
        !contract ||
        !this.userAddress ||
        !(await contract.allowlist(this.userAddress)) ||
        +(await contract.balanceOf(this.userAddress))
      ) {
        this.tokenId = undefined
        return
      }

      const { _hex } = await contract.checkTokenId(this.userAddress)
      const tokenId = +_hex

      this.tokenId = tokenId
    } catch (error) {
      console.error(error)
      this.tokenId = undefined
    }
  }

  async mintNFT() {
    try {
      if (!contract) return

      const transaction = await contract.mint(this.userAddress)
      await transaction.wait()
    } catch (error) {
      console.error(error)
    }
  }
}

export default proxy(new EthStore()).makePersistent()
