import { DosuInvites } from '@big-whale-labs/dosu-invites-contract/dist/typechain'
import { ErrorList } from 'helpers/handleError'
import { Web3Provider } from '@ethersproject/providers'
import { handleError } from 'helpers/handleError'
import { proxy } from 'valtio'
import PersistableStore from 'stores/persistence/PersistableStore'
import configuredModal from 'helpers/configuredModal'
import dosuInvites from 'helpers/dosuInvites'
import generateMerkleProof from 'helpers/generateMerkleProof'

const ethNetwork = import.meta.env.VITE_ETH_NETWORK as string
let dosuContract: DosuInvites

class EthStore extends PersistableStore {
  userAddress?: string
  tokenId?: number
  ethLoading = false

  async onConnect() {
    try {
      this.ethLoading = true

      const instance = await configuredModal.connect()
      const provider = new Web3Provider(instance)
      const userNetwork = (await provider.getNetwork()).name
      if (userNetwork !== ethNetwork)
        throw new Error(ErrorList.wrongNetwork(userNetwork, ethNetwork))

      const accounts = await provider.listAccounts()

      dosuContract = await dosuInvites(provider.getSigner(0))

      await this.handleAccountChanged(accounts)
      this.subscribeProvider(instance)
    } catch (error) {
      if (error !== 'Modal closed by user') handleError(error)
      this.clearData()
    } finally {
      this.ethLoading = false
    }
  }

  private clearData() {
    configuredModal.clearCachedProvider()
    this.userAddress = undefined
    this.tokenId = undefined
  }

  private async checkUserData() {
    if (!this.userAddress) return
    const minted = !(await dosuContract.balanceOf(this.userAddress)).isZero()
    if (!minted) {
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

    provider.on('error', (error: Error) => handleError(error))
    provider.on(
      'accountsChanged',
      async (accounts: string[]) => await this.handleAccountChanged(accounts)
    )
    provider.on(
      'disconnect',
      async (accounts: string[]) => await this.handleAccountChanged(accounts)
    )
    provider.on(
      'stop',
      async (accounts: string[]) => await this.handleAccountChanged(accounts)
    )
    provider.on('chainChanged', async () => {
      this.clearData()
      await this.onConnect()
    })
  }

  private async checkTokenId() {
    if (!dosuContract || !this.userAddress) return
    try {
      this.ethLoading = true
      const { _hex } = await dosuContract.mintedTokensCount() // Last token ID
      const lastId = +_hex
      for (let id = 1; id <= lastId; id++) {
        const address = await dosuContract.ownerOf(id)
        if (
          address.toLocaleLowerCase() === this.userAddress.toLocaleLowerCase()
        ) {
          this.tokenId = id
          break
        }
      }
    } catch (error) {
      handleError(error)
      this.tokenId = undefined
    } finally {
      this.ethLoading = false
    }
  }

  getMerkleRoot() {
    if (!dosuContract) return

    return Promise.resolve(dosuContract.allowlistMerkleRoot())
  }

  async mintNFT() {
    if (!dosuContract || !this.userAddress) return
    try {
      const proof = generateMerkleProof(this.userAddress)
      if (typeof proof === 'string') throw new Error(ErrorList.invalidProof)

      const transaction = await dosuContract.mint(proof)
      await transaction.wait()
      await this.checkUserData()
    } catch (error) {
      handleError(error)
    }
  }
}

export default proxy(new EthStore()).makePersistent()
