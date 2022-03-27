import Invites from 'models/Invites'
import * as api from 'helpers/api'
import { proxy } from 'valtio'

interface FrameState {
  framesToEth: Promise<Invites>
  requestFrames: () => void
  framesToEthLength?: number
}

const FramesStore = proxy<FrameState>({
  framesToEth: api.getMintedAddresses(),
  requestFrames: () => {
    FramesStore.framesToEth = api.getMintedAddresses()
  },
  framesToEthLength: undefined,
})

export default FramesStore
