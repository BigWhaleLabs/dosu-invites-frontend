import * as api from 'helpers/api'
import { proxy } from 'valtio'

const FramesStore = proxy({
  framesToEth: api.getMintedAddresses(),
  requestFrames: () => {
    FramesStore.framesToEth = api.getMintedAddresses()
  },
  framesToEthLength: 0,
})

export default FramesStore
