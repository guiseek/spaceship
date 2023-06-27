import {Euler, Quaternion} from 'three'
import {isMobile} from '../utilities'

type Action = 'w' | 'a' | 's' | 'd' | 'shiftLeft' | 'space'
type Key = Capitalize<Action>

export class Input {
  readonly key: Record<Key, boolean> = {
    W: false,
    A: false,
    S: false,
    D: false,
    Space: false,
    ShiftLeft: false,
  }

  readonly deviceRotation = new Quaternion()

  #onRotation: Callback<Quaternion>[] = []
  set onRotation(fn: Callback<Quaternion>) {
    this.#onRotation.push(fn)
  }

  #onKeyUp: VoidFunction[] = []
  set onKeyUp(fn: VoidFunction) {
    this.#onKeyUp.push(fn)
  }

  #onKeyDown: VoidFunction[] = []
  set onKeyDown(fn: VoidFunction) {
    this.#onKeyDown.push(fn)
  }

  constructor() {
    onkeyup = ({code}) => {
      if (this.#validateKey(code)) {
        this.#setKey(code, false)
        for (const fn of this.#onKeyUp) fn()
      }
    }

    onkeydown = ({code}) => {
      if (this.#validateKey(code)) {
        this.#setKey(code, true)
        for (const fn of this.#onKeyDown) fn()
      }
    }

    if (isMobile() && DeviceOrientationEvent) {
      const scale = 0.04
      const euler = new Euler()

      ondeviceorientation = ({beta: x, alpha: z, gamma: y}) => {
        if (y && x && z) {
          euler.set(x * scale, y * scale, z * scale, 'XYZ')

          this.deviceRotation.setFromEuler(euler)

          for (const cb of this.#onRotation) {
            cb(this.deviceRotation)
          }
        }
      }
    }
  }

  #validateKey(code: string) {
    return Object.keys(this.key).includes(code.replace('Key', ''))
  }

  #setKey(action: string, value: boolean) {
    const key = action.replace('Key', '') as Key
    this.key[key] = value
  }
}
