import { Abi } from 'helpers/abiTypes/Abi'
import { Abi__factory } from 'helpers/abiTypes/factories/Abi__factory'
// import { Bitski } from 'bitski'
import { Web3Provider } from '@ethersproject/providers'
import { proxy } from 'valtio'
import Authereum from 'authereum'
import Fortmatic from 'fortmatic'
import PersistableStore from 'stores/persistence/PersistableStore'
import Torus from '@toruslabs/torus-embed'
import WalletConnect from '@walletconnect/web3-provider'
import Web3Modal from 'web3modal'

let provider: Web3Provider
let contract: Abi
const infuraId = import.meta.env.VITE_INFURA_ID as string
const fortmaticNetwork = {
  rpcUrl: 'https://rpc-mainnet.maticvigil.com',
  chainId: 137,
}

export const web3Modal = new Web3Modal({
  cacheProvider: true,
  providerOptions: {
    torus: {
      package: Torus,
      display: { name: 'Torus' },
    },
    fortmatic: {
      package: Fortmatic,
      options: {
        key: import.meta.env.VITE_FORTMATIC_KEY as string,
        network: fortmaticNetwork, // defaults to localhost:8454
      },
      display: { name: 'Fortmatic' },
    },
    authereum: {
      package: Authereum,
      display: { name: 'Authereum' },
    },
    walletconnect: {
      package: WalletConnect,
      options: {
        infuraId,
      },
      display: { name: 'Mobile' },
    },
    // bitski: {
    //   package: Bitski, // required
    //   options: {
    //     clientId: import.meta.env.VITE_BITSKI_CLIENT_ID,
    //     callbackUrl: import.meta.env.VITE_BITSKI_CALLBACK_URL,
    //   },
    // },
    binancechainwallet: {
      package: true,
      display: { name: 'Binance' },
    },
  },
})

class EthStore extends PersistableStore {
  userAddress = ''
  tokenId: number | undefined

  async onConnect() {
    try {
      // await web3Modal.connect() && await web3Modal.enable()

      provider = new Web3Provider(await web3Modal.connect())

      this.subscribeProvider(provider)

      await this.handleAccountChanged(await provider.listAccounts())

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

  subscribeProvider(provider: Web3Provider) {
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
