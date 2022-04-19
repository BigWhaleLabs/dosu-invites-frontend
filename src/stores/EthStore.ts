import { Abi } from 'helpers/abiTypes/Abi'
import { Abi__factory } from 'helpers/abiTypes/factories/Abi__factory'
import { ErrorList } from 'helpers/handleError'
import { Web3Provider } from '@ethersproject/providers'
import { handleError } from 'helpers/handleError'
import { proxy } from 'valtio'
import Invites from 'models/Invites'
import PersistableStore from 'stores/persistence/PersistableStore'
import configuredModal from 'helpers/configuredModal'
import generateMerkleProof from 'helpers/generateMerkleProof'

const ethNetwork = import.meta.env.VITE_ETH_NETWORK as string
let contract: Abi

class EthStore extends PersistableStore {
  displayedAddress?: string
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

      contract = Abi__factory.connect(
        import.meta.env.VITE_CONTRACT_ADDRESS as string,
        provider.getSigner(0)
      )

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
    console.log('Checking user data...')
    if (!this.userAddress) return
    const minted = !(await contract.balanceOf(this.userAddress)).isZero()
    if (!minted) {
      this.tokenId = undefined
      return
    }
    await this.checkTokenId()
  }

  private async handleAccountChanged(accounts: string[]) {
    console.log('Accounts changed:', accounts)
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
    console.log('Checking token id...')
    if (!contract || !this.userAddress) return
    try {
      this.ethLoading = true
      const { _hex } = await contract.mintedTokensCount() // Last token ID
      const lastId = +_hex
      for (let id = 1; id <= lastId; id++) {
        console.log(`Getting address for token ${id}...`)
        const address = await contract.ownerOf(id)
        console.log(`Address: ${address} & user address: ${this.userAddress}`)
        if (address === this.userAddress) {
          this.tokenId = id
          console.log(`Token ID: ${id}`)
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
    if (!contract) return

    return Promise.resolve(contract.allowlistMerkleRoot())
  }

  async mintNFT() {
    if (!contract || !this.userAddress) return
    try {
      const proof = generateMerkleProof(this.userAddress)
      if (typeof proof === 'string') throw new Error(ErrorList.invalidProof)

      const transaction = await contract.mint(proof)
      await transaction.wait()
      await this.checkUserData()
    } catch (error) {
      handleError(error)
    }
  }

  async getMintedAddresses() {
    console.log(
      (await !contract) ? 'Contract not loaded' : 'Getting minted addresses...'
    )
    if (!contract) return
    const lastId = +(await contract.mintedTokensCount())._hex
    const tokenToAddressMap: Invites = {}
    for (let id = 0; id < lastId; id++) {
      const address = await contract.ownerOf(id)
      console.log(`Token ${id}: ${address}`)
      tokenToAddressMap[id] = address
    }
    return await tokenToAddressMap
  }
}

export default proxy(new EthStore()).makePersistent()
