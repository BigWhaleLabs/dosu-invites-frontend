import { Abi } from 'helpers/abiTypes/Abi'
import { Abi__factory } from 'helpers/abiTypes/factories/Abi__factory'
// import { Bitski } from 'bitski'
import { Web3Provider } from '@ethersproject/providers'
import { proxy } from 'valtio'
import Authereum from 'authereum'
import Fortmatic from 'fortmatic'
import PersistableStore from 'stores/persistence/PersistableStore'
import Torus from '@toruslabs/torus-embed'
import Web3Modal from 'web3modal'

const fortmaticNetwork = {
  rpcUrl: 'https://rpc-mainnet.maticvigil.com',
  chainId: 137,
}

let provider: Web3Provider
let contract: Abi

class EthStore extends PersistableStore {
  userAddress = ''
  tokenId: number | undefined

  async connectBlockchain() {
    try {
      const web3Modal = await new Web3Modal({
        cacheProvider: true,
        providerOptions: {
          torus: {
            package: Torus,
          },
          fortmatic: {
            package: Fortmatic, // required
            options: {
              key: import.meta.env.VITE_FORTMATIC_KEY, // required
              network: fortmaticNetwork, // if we don't pass it, it will default to localhost:8454
            },
          },
          authereum: {
            package: Authereum, // required
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
          },
        },
      }).connect()

      provider = new Web3Provider(web3Modal)

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

  setupListeners() {
    if (!provider || !provider.on) return

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
