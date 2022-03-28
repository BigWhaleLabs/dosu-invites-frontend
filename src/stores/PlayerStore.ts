import { proxy } from 'valtio'

class PlayerStore {
  dragFrame = 0
  frame = 0
  pause = true

  updateDragFrame(frame: number) {
    this.dragFrame = frame
  }
  updateFrame(frame: number) {
    this.frame = frame
  }
  updatePause(state: boolean) {
    this.pause = state
  }
}

export default proxy(new PlayerStore())
