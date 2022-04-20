import { Abi } from 'helpers/abiTypes/Abi'
import { Abi__factory } from 'helpers/abiTypes/factories/Abi__factory'
import { providers } from 'ethers'
import { proxy } from 'valtio'
import Invites from 'models/Invites'

const provider = new providers.InfuraProvider(
  import.meta.env.VITE_ETH_NETWORK as string,
  import.meta.env.VITE_INFURA_ID as string
)

const contract: Abi = Abi__factory.connect(
  import.meta.env.VITE_CONTRACT_ADDRESS as string,
  provider
)
interface FrameState {
  displayedAddress?: string
  framesToEthLength?: number
  framesToEth: Promise<Invites | undefined>
  requestFrames: () => void
  updateDisplayedAddress: (address: string) => void
  getMintedAddresses: () => Promise<Invites>
}

const FramesStore = proxy<FrameState>({
  displayedAddress: undefined,
  framesToEthLength: undefined,
  framesToEth: Promise.resolve({}),
  requestFrames: () => {
    FramesStore.framesToEth = FramesStore.getMintedAddresses()
  },
  updateDisplayedAddress: (address: string) => {
    FramesStore.displayedAddress = address
  },
  getMintedAddresses: async () => {
    if (!contract) return Promise.resolve({})
    const lastId = +(await contract.mintedTokensCount())._hex
    const tokenToAddressMap: Invites = {}
    for (let id = 1; id <= lastId; id++) {
      const address = await contract.ownerOf(id)
      tokenToAddressMap[id] = address.toLocaleLowerCase()
    }
    return tokenToAddressMap
  },
})

export default FramesStore
