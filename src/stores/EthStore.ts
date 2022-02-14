import { Abi } from 'helpers/abiTypes/Abi'
import { Abi__factory } from 'helpers/abiTypes/factories/Abi__factory'
import { Web3Provider } from '@ethersproject/providers'
import { proxy } from 'valtio'
import PersistableStore from 'stores/persistence/PersistableStore'
import Torus from '@toruslabs/torus-embed'
import WalletConnect from '@walletconnect/web3-provider'
import Web3Modal from 'web3modal'

let provider: Web3Provider
let contract: Abi

const infuraId = process.env.VITE_INFURA_ID

if (window.ethereum) {
  const providerOptions = {
    binancechainwallet: {
      package: true,
    },
    walletconnect: {
      package: WalletConnect,
      options: {
        infuraId,
      },
    },
    torus: {
      package: Torus,
    },
  }

  const web3Modal = new Web3Modal({
    cacheProvider: true,
    providerOptions,
  })

  provider = new Web3Provider(await web3Modal.connect())

  contract = Abi__factory.connect(
    import.meta.env.VITE_CONTRACT_ADDRESS as string,
    provider.getSigner()
  )
}

class EthStore extends PersistableStore {
  userAddress = ''
  tokenId: number | undefined

  getProvider() {
    if (!provider) return undefined

    return provider
  }

  async checkMetaMask() {
    if (!provider) {
      this.userAddress = ''
      return
    }

    await this.handleAccountChanged(await provider.listAccounts())
    this.setupListeners()
  }

  async connectProvider() {
    if (!provider) return

    await provider.send('eth_requestAccounts', [])
    this.userAddress = await provider.getSigner().getAddress()
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
