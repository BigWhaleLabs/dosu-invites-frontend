import { Abi } from 'helpers/abiTypes/Abi'
import { Abi__factory } from 'helpers/abiTypes/factories/Abi__factory'
import { Web3Provider } from '@ethersproject/providers'
import { proxy } from 'valtio'
import PersistableStore from 'stores/persistence/PersistableStore'
import configuredModal from 'helpers/configuredModal'

const ethNetwork = import.meta.env.VITE_ETH_NETWORK
let contract: Abi

class EthStore extends PersistableStore {
  ethAddress?: string = undefined
  userAddress = ''
  tokenId: number | undefined
  ethLoading = false
  allowListed = false
  ethError = ''

  async onConnect() {
    try {
      this.ethLoading = true
      this.ethError = ''

      const instance = await configuredModal.connect()
      const provider = new Web3Provider(instance)
      const userNetwork = (await provider.getNetwork()).name
      if (userNetwork !== ethNetwork) {
        this.ethError = `Looks like you're using ${userNetwork} network, try switching to ${ethNetwork} and connect again`
        return
      }

      const accounts = await provider.listAccounts()

      contract = Abi__factory.connect(
        import.meta.env.VITE_CONTRACT_ADDRESS as string,
        provider.getSigner(0)
      )

      await this.handleAccountChanged(accounts)
      this.subscribeProvider(instance)
    } catch (error) {
      if ((error as string) === 'Modal closed by user') return
      console.error(error)
      this.clearData()
    } finally {
      this.ethLoading = false
    }
  }

  private clearData() {
    configuredModal.clearCachedProvider()
    this.userAddress = ''
    this.tokenId = undefined
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
      this.ethError = error.message
    })
    provider.on('accountsChanged', async (accounts: string[]) => {
      if (this.ethError) return
      await this.handleAccountChanged(accounts)
    })
    provider.on('disconnect', async (accounts: string[]) => {
      if (this.ethError) return
      await this.handleAccountChanged(accounts)
    })
    provider.on('stop', async (accounts: string[]) => {
      if (this.ethError) return
      await this.handleAccountChanged(accounts)
    })
    provider.on('networkChanged', async () => {
      this.clearData()
      await this.onConnect()
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
