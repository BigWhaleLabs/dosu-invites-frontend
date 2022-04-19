import { proxy } from 'valtio'
import EthStore from 'stores/EthStore'
import Invites from 'models/Invites'

interface FrameState {
  framesToEth: Promise<Invites | undefined>
  requestFrames: () => void
  framesToEthLength?: number
}

const FramesStore = proxy<FrameState>({
  framesToEth: EthStore.getMintedAddresses(),
  requestFrames: () => {
    FramesStore.framesToEth = EthStore.getMintedAddresses()
  },
  framesToEthLength: undefined,
})

export default FramesStore
