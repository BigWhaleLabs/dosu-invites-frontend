import { ErrorList } from 'helpers/handleError'
import { Web3Provider } from '@ethersproject/providers'
import { handleError } from 'helpers/handleError'
import { proxy } from 'valtio'
import dosuInvites from 'helpers/dosuInvites'
import env from 'helpers/env'
import generateMerkleProof from 'helpers/generateMerkleProof'
import getDosuInvites from 'helpers/getDosuInvites'
import web3Modal from 'helpers/web3Modal'

class WalletStore {
  loading = false

  _provider?: Web3Provider
  get provider() {
    return this._provider
  }
  set provider(provider: Web3Provider | undefined) {
    this._provider = provider
    if (!provider) return

    this.addProviderHandlers(provider)
  }

  userAddress?: string
  networkName?: string
  tokenId?: number

  get isCorrectNetwork() {
    return this.networkName === env.VITE_ETH_NETWORK
  }

  async connect() {
    try {
      this.loading = true

      const instance = await web3Modal.connect()
      this.provider = new Web3Provider(instance)
      this.networkName = (await this.provider.getNetwork()).name
      this.checkNetworkName()
      this.userAddress = (await this.provider.listAccounts())[0]
      await this.fetchTokenId()
    } catch (error) {
      if (error !== 'Modal closed by user') handleError(error)
      this.userAddress = undefined
      this.networkName = undefined
      this.tokenId = undefined
    } finally {
      this.loading = false
    }
  }

  checkTokenIdOwner(tokenId: number) {
    return dosuInvites.ownerOf(tokenId)
  }

  private addProviderHandlers(provider: Web3Provider) {
    provider.on('error', (error: Error) => handleError(error))
    provider.on('accountsChanged', (accounts: string[]) => {
      this.userAddress = accounts[0]
      void this.fetchTokenId()
    })
    provider.on('disconnect', (accounts: string[]) => {
      if (this.userAddress && !accounts.includes(this.userAddress)) return

      provider.removeAllListeners()
      this.provider = undefined
      this.userAddress = undefined
      this.networkName = undefined
      this.tokenId = undefined
    })
    provider.on('chainChanged', async () => {
      if (!this.provider) return

      this.networkName = (await this.provider.getNetwork()).name
      this.checkNetworkName()
      void this.fetchTokenId()
    })
  }

  private checkNetworkName() {
    if (!this.networkName || this.isCorrectNetwork) return

    handleError(ErrorList.wrongNetwork(this.networkName, env.VITE_ETH_NETWORK))
  }

  private async fetchTokenId() {
    this.tokenId = undefined
    if (!this.isCorrectNetwork || !this.userAddress) return

    this.loading = true
    try {
      const transferFilter = dosuInvites.filters.Transfer(
        undefined,
        this.userAddress
      )
      const transferEvents = await dosuInvites.queryFilter(transferFilter)
      this.tokenId = transferEvents
        .find((event) => event.args.to === this.userAddress)
        ?.args.tokenId.toNumber()
    } catch (error) {
      handleError(error)
    } finally {
      this.loading = false
    }
  }

  async mint() {
    if (!this.userAddress || !this.provider) return // TODO: should throw an error?
    const dosuInvitesWithSigner = getDosuInvites(this.provider?.getSigner(0))
    try {
      const proof = await generateMerkleProof(this.userAddress)

      const transaction = await dosuInvitesWithSigner.mint(proof)
      await transaction.wait()
      await this.fetchTokenId()
    } catch (error) {
      handleError(error)
    }
  }
}

export default proxy(new WalletStore())
