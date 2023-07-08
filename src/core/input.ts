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

  #touched = false
  #onTouched: VoidFunction[] = []
  set onTouched(fn: VoidFunction) {
    this.#onTouched.push(fn)
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
    onkeyup = this.#onKeyUpFn
    onkeydown = this.#onKeyDownFn

    if (isMobile() && DeviceOrientationEvent) {
      const scale = 0.04
      const euler = new Euler()

      ondeviceorientation = this.#onDeviceOrientationFn(euler, scale)
    }
  }

  #onDeviceOrientationFn = (euler: Euler, scale: number) => {
    return ({beta: x, alpha: z, gamma: y}: DeviceOrientationEvent) => {
      if (y && x && z) {
        euler.set(x * scale, y * scale, z * scale, 'XYZ')

        this.deviceRotation.setFromEuler(euler)

        for (const cb of this.#onRotation) {
          cb(this.deviceRotation)
        }

        if (!this.#touched) {
          console.log('touched')

          for (const fn of this.#onTouched) {
            this.#touched = true
            fn()
          }
        }
      }
    }
  }

  #onKeyUpFn = ({code}: KeyboardEvent) => {
    if (this.#validateKey(code)) {
      this.#setKey(code, false)
      for (const fn of this.#onKeyUp) fn()
    }
  }

  #onKeyDownFn = ({code}: KeyboardEvent) => {
    if (this.#validateKey(code)) {
      if (!this.#touched) {
        this.#touched = true
        for (const fn of this.#onTouched) fn()
      }

      this.#setKey(code, true)
      for (const fn of this.#onKeyDown) fn()
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
