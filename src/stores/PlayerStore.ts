import { proxy } from 'valtio'
class PlayerStore {
  dragFrame = 1
  frame = 1
  draggableGrid = 16
  multiplier = 2

  updateDragFrame(frame: number) {
    this.dragFrame = frame
  }
  updateFrame(frame: number) {
    this.frame = frame
  }
}

export default proxy(new PlayerStore())
