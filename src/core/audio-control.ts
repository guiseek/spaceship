export class AudioControl {
  #audio

  #target

  get #volume() {
    return this.#audio.volume
  }

  set #volume(value: number) {
    this.#audio.volume = value
  }

  #action: 'play' | 'pause' | null = null

  constructor(src: string) {
    this.#audio = new Audio(src)
    this.#target = this.#audio.volume
		this.#audio.loop = true
  }

  play() {
    return this.#audio.play()
  }

  setVolume(value: number) {
    this.#target = value
  }

  update() {
    if (this.#volume < this.#target) {
      this.#volume += 0.03
    }

    if (this.#volume > this.#target) {
      this.#volume -= 0.03
    }

    if (!this.#audio.paused && this.#action === 'pause') {
      this.#target = 0
    }

    if (this.#audio.paused && this.#action === 'play') {
      this.#volume = 0
      this.#target = 1
      this.play()
			this.#action = null
    }
    if (
      this.#action === 'pause' &&
      this.#volume === this.#target &&
      !this.#audio.paused
    ) {
      this.#audio.pause()
			this.#action = null
    }
  }
}
