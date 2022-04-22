import { ErrorList } from 'helpers/handleError'
import { Web3Provider } from '@ethersproject/providers'
import { handleError } from 'helpers/handleError'
import { proxy } from 'valtio'
import dosuInvites from 'helpers/dosuInvites'
import env from 'helpers/env'
import generateMerkleProof from 'helpers/generateMerkleProof'
import getDosuInvites from 'helpers/getDosuInvites'
import networkChainIdToName from 'models/networkChainIdToName'
import web3Modal from 'helpers/web3Modal'

class WalletStore {
  loading = false

  provider?: Web3Provider

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
      this.provider = new Web3Provider(instance, env.VITE_ETH_NETWORK)
      this.addProviderHandlers()
      await this.setAndCheckNetworkName()
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

  private addProviderHandlers() {
    if (!this.provider) {
      return
    }
    this.provider.on('error', (error: Error) => {
      console.log('error')
      handleError(error)
    })
    this.provider.on('accountsChanged', (accounts: string[]) => {
      console.log('accountsChanged')
      this.userAddress = accounts[0]
      void this.fetchTokenId()
    })
    this.provider.on('disconnect', (accounts: string[]) => {
      console.log('disconnect')
      if (this.userAddress && !accounts.includes(this.userAddress)) return
      if (this.provider) {
        this.provider.removeAllListeners()
      }
      this.provider = undefined
      this.userAddress = undefined
      this.networkName = undefined
      this.tokenId = undefined
    })
    this.provider.on('chainChanged', async (chainId: string) => {
      console.log('chainChanged')
      await this.setAndCheckNetworkName(chainId)
      await this.fetchTokenId()
    })
  }

  private async setAndCheckNetworkName(chainId?: string) {
    if (!this.provider) return
    this.networkName =
      (chainId && networkChainIdToName[chainId]) ||
      (await this.provider.getNetwork()).name
    this.checkNetworkName()
  }

  private checkNetworkName() {
    if (!this.networkName || this.isCorrectNetwork) return

    handleError(ErrorList.wrongNetwork(this.networkName, env.VITE_ETH_NETWORK))
  }

  async changeNetworkToDefault() {
    if (!this.provider) return
    const network = env.VITE_ETH_NETWORK
    const index = Object.values(networkChainIdToName).findIndex(
      (name) => name === network
    )

    await this.provider.jsonRpcFetchFunc('wallet_switchEthereumChain', [
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
    if (!this.userAddress || !this.provider)
      return handleError(ErrorList.pleaseReconnect)
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
