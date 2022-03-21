import * as api from 'helpers/api'
import { proxy } from 'valtio'

const FramesStore = proxy({
  framesToEth: api.getMintedAddresses(),
  ethAddress: '0x',
  requestFrames: () => {
    FramesStore.framesToEth = api.getMintedAddresses()
  },
})

export default FramesStore
