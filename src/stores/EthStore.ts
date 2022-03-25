import { Abi } from 'helpers/abiTypes/Abi'
import { Abi__factory } from 'helpers/abiTypes/factories/Abi__factory'
import { Web3Provider } from '@ethersproject/providers'
import { proxy } from 'valtio'
import PersistableStore from 'stores/persistence/PersistableStore'
import configuredModal from 'helpers/configuredModal'

let contract: Abi

class EthStore extends PersistableStore {
  ethAddress?: string
  userAddress = ''
  tokenId: number | undefined
  ethLoading = false
  allowListed = false

  async onConnect() {
    try {
      this.ethLoading = true

      const instance = await configuredModal.connect()
      const provider = new Web3Provider(instance)
      const accounts = await provider.listAccounts()

      contract = Abi__factory.connect(
        import.meta.env.VITE_CONTRACT_ADDRESS as string,
        provider.getSigner(0)
      )

      await this.handleAccountChanged(accounts)
      this.subscribeProvider(instance)
    } catch (error) {
      console.error(error)
    } finally {
      this.ethLoading = false
    }
  }

  private async checkUserData() {
    this.allowListed = await contract.allowlist(this.userAddress)
    const minted = +(await contract.balanceOf(this.userAddress))
    if (!this.allowListed || !minted) {
      this.tokenId = undefined
      return
    }
    await this.checkTokenId()
  }

  private async handleAccountChanged(accounts: string[]) {
    this.ethLoading = true

    if (accounts.length === 0) {
      this.userAddress = ''
      this.tokenId = undefined
    } else {
      this.userAddress = accounts[0]
      await this.checkUserData()
    }

    this.ethLoading = false
  }

  private subscribeProvider(provider: Web3Provider) {
    if (!provider.on) return

    provider.on('error', (error: Error) => {
      console.error(error)
    })
    provider.on('accountsChanged', async (accounts: string[]) => {
      await this.handleAccountChanged(accounts)
    })
    provider.on('disconnect', async (accounts: string[]) => {
      await this.handleAccountChanged(accounts)
    })
    provider.on('stop', async (accounts: string[]) => {
      await this.handleAccountChanged(accounts)
    })
  }

  private async checkTokenId() {
    try {
      this.ethLoading = true

      const { _hex } = await contract.checkTokenId(this.userAddress)
      this.tokenId = +_hex
    } catch (error) {
      console.error(error)
      this.tokenId = undefined
    } finally {
      this.ethLoading = false
    }
  }

  async mintNFT() {
    if (!contract) return
    try {
      const transaction = await contract.mint(this.userAddress)
      await transaction.wait()
      await this.checkUserData()
    } catch (error) {
      console.error(error)
    }
  }
}

export default proxy(new EthStore()).makePersistent()
