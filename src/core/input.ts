type Action = 'r' | 'f' | 'q' | 'w' | 'e' | 's' | 'a' | 'd' | 'shiftLeft' | 'space'
type Direction = 'up' | 'right' | 'down' | 'left'
type Arrow = Capitalize<Direction>
type Key = Capitalize<Action>

export class Input {
  readonly arrow: Record<Arrow, number> = {
    Up: 0,
    Right: 0,
    Down: 0,
    Left: 0,
  }
  readonly key: Record<Key, boolean> = {
    R: false,
    F: false,
    Q: false,
    W: false,
    S: false,
    E: false,
    A: false,
    D: false,
    Space: false,
    ShiftLeft: false,
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
      const isArrow = this.#validateArrow(code)
      const isKey = this.#validateKey(code)
      if (isArrow) this.#setArrow(code, 0)
      if (isKey) this.#setKey(code, false)
      if (isArrow || isKey) {
        for (const fn of this.#onKeyUp) fn()
      }
    }
    onkeydown = ({code}) => {
      const isArrow = this.#validateArrow(code)
      const isKey = this.#validateKey(code)
      if (isArrow) this.#setArrow(code, 1)
      if (isKey) this.#setKey(code, true)
      if (isArrow || isKey) {
        for (const fn of this.#onKeyDown) fn()
      }
    }
  }

  #validateKey(code: string) {
    return Object.keys(this.key).includes(code.replace('Key', ''))
  }

  #validateArrow(code: string) {
    return Object.keys(this.arrow).includes(code.replace('Arrow', ''))
  }

  #setKey(action: string, value: boolean) {
    const key = action.replace('Key', '') as Key
    this.key[key] = value
  }
  #setArrow(direction: string, value: 0 | 1) {
    const arrow = direction.replace('Arrow', '') as Arrow
    this.arrow[arrow] = value
  }
}
