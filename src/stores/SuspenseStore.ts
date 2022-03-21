import * as api from 'helpers/api'
import { proxy } from 'valtio'

const SuspenseStore = proxy({
  framesToEth: api.getMintedAddresses(),
  ethAddress: '0x',
  requestFrames: () => {
    SuspenseStore.framesToEth = api.getMintedAddresses()
  },
})

export default SuspenseStore
