import { proxy } from 'valtio'
import Invites from 'models/Invites'
import dosuInvites from 'helpers/dosuInvites'

interface FrameState {
  displayedAddress?: string
  framesToEthLength?: number
  framesToEth: Promise<Invites | undefined>
  requestFrames: () => void
  updateDisplayedAddress: (address: string) => void
  getMintedAddresses: () => Promise<Invites>
}

const dosuContract = dosuInvites()

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
    if (!dosuContract) return Promise.resolve({})
    const lastId = +(await dosuContract.mintedTokensCount())._hex
    const tokenToAddressMap: Invites = {}
    for (let id = 1; id <= lastId; id++) {
      const address = await dosuContract.ownerOf(id)
      tokenToAddressMap[id] = address.toLocaleLowerCase()
    }
    return tokenToAddressMap
  },
})

export default FramesStore
