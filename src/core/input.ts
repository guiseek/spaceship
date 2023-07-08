import {Euler, Quaternion} from 'three'
import {create, isMobile} from '../utilities'

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

  #button = {
    Space: create(
      'button',
      {ariaLabel: 'brake'},
      create('img', {src: 'brake.svg'})
    ),
    ShiftLeft: create(
      'button',
      {ariaLabel: 'speed up'},
      create('img', {src: 'speed.svg'})
    ),
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

      this.#button.Space.ontouchstart = () => {
        this.#onKeyDownFn(
          new KeyboardEvent('keydown', {
            code: 'Space',
            key: ' ',
          })
        )
      }
      this.#button.ShiftLeft.ontouchstart = () => {
        this.#onKeyDownFn(
          new KeyboardEvent('keydown', {
            code: 'ShiftLeft',
            key: 'Shift',
          })
        )
      }
      this.#button.Space.ontouchend = () => {
        this.#onKeyUpFn(
          new KeyboardEvent('keyup', {
            code: 'Space',
            key: ' ',
          })
        )
      }
      this.#button.ShiftLeft.ontouchend = () => {
        this.#onKeyUpFn(
          new KeyboardEvent('keyup', {
            code: 'ShiftLeft',
            key: 'Shift',
          })
        )
      }

      document.body.append(
        create('nav', {}, this.#button.Space, this.#button.ShiftLeft)
      )
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
