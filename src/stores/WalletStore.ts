import { ErrorList, handleError } from '@big-whale-labs/frontend-utils'
import { Web3Provider } from '@ethersproject/providers'
import { proxy } from 'valtio'
import dosuInvites from 'helpers/dosuInvites'
import env from 'helpers/env'
import generateMerkleProof from 'helpers/generateMerkleProof'
import getDosuInvites from 'helpers/getDosuInvites'
import networkChainIdToName from 'models/networkChainIdToName'
import web3Modal from 'helpers/web3Modal'

let provider: Web3Provider
class WalletStore {
  loading = false

  userAddress?: string
  networkName?: string
  tokenId?: number

  get isCorrectNetwork() {
    return this.networkName === env.VITE_ETH_NETWORK
  }

  get cachedProvider() {
    return web3Modal.cachedProvider
  }

  async connect() {
    this.loading = true
    try {
      const instance = await web3Modal.connect()
      provider = new Web3Provider(instance, env.VITE_ETH_NETWORK)
      this.addProviderHandlers(instance)
      await this.setAndCheckNetworkName()
      this.userAddress = (await provider.listAccounts())[0]
      await this.fetchTokenId()
    } catch (error) {
      if (error !== 'Modal closed by user') handleError(error)
      this.clearData()
    } finally {
      this.loading = false
    }
  }

  private addProviderHandlers(provider: Web3Provider) {
    if (!provider) return
    provider.on('error', (error: Error) => {
      handleError(error)
    })
    provider.on('accountsChanged', (accounts: string[]) => {
      this.userAddress = accounts[0]
      void this.fetchTokenId()
    })
    provider.on('disconnect', (accounts: string[]) => {
      if (this.userAddress && !accounts.includes(this.userAddress)) return
      if (provider) {
        provider.removeAllListeners()
      }
      this.clearData(true)
    })
    provider.on('chainChanged', async (chainId: string) => {
      await this.setAndCheckNetworkName(chainId)
      await this.fetchTokenId()
    })
  }

  private clearData(clearProvider = false) {
    if (clearProvider) web3Modal.clearCachedProvider()
    this.userAddress = undefined
    this.networkName = undefined
    this.tokenId = undefined
  }

  private async setAndCheckNetworkName(chainId?: string) {
    if (!provider) return

    try {
      this.networkName =
        (chainId && networkChainIdToName[chainId]) ||
        (await provider.getNetwork()).name
      this.checkNetworkName()
    } catch (error) {
      handleError(ErrorList.wrongNetwork('a wrong', env.VITE_ETH_NETWORK))
    }
  }

  private checkNetworkName() {
    if (!this.networkName || this.isCorrectNetwork) return

    handleError(ErrorList.wrongNetwork(this.networkName, env.VITE_ETH_NETWORK))
  }

  async changeNetworkToDefault() {
    if (!provider) return
    const network = env.VITE_ETH_NETWORK
    const index = Object.values(networkChainIdToName).findIndex(
      (name) => name === network
    )

    await provider.jsonRpcFetchFunc('wallet_switchEthereumChain', [
      { chainId: Object.keys(networkChainIdToName)[index] },
    ])
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
    if (!this.userAddress || !provider)
      return handleError(ErrorList.pleaseReconnect)
    try {
      this.loading = true
      const dosuInvitesWithSigner = getDosuInvites(provider.getSigner(0))
      const proof = await generateMerkleProof(this.userAddress)

      const transaction = await dosuInvitesWithSigner.mint(proof)
      await transaction.wait()
      await this.fetchTokenId()
    } catch (error) {
      handleError(error)
    } finally {
      this.loading = false
    }
  }
}

const walletStore = proxy(new WalletStore())

if (walletStore.cachedProvider) void walletStore.connect()

export default walletStore
