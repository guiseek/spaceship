type AudioFilePath = `${string}.${'mp3' | 'ogg' | 'wav'}`

export class AudioControl {
  #target
  #audioGain
  #audioContext
  #audioSource?: AudioBufferSourceNode

  constructor() {
    this.#target = 1
    this.#audioContext = new AudioContext()
    this.#audioGain = this.#audioContext.createGain()
  }

  connect(src: AudioFilePath) {
    this.#fetchBuffer(src)
      .then(this.#decodeSource)
      .then((source) => {
        this.#audioSource = source
        this.#audioSource.loop = true
        this.#audioSource.connect(this.#audioGain)
        this.#audioGain.connect(this.#audioContext.destination)
        this.#audioSource.start()
      })
  }

  setGain(value: number) {
    this.#target = value
  }

  update() {
    if (this.#audioGain.gain.value <= this.#target) {
      this.#audioGain.gain.value += 0.02
    }

    if (this.#audioGain.gain.value >= this.#target) {
      this.#audioGain.gain.value -= 0.02
    }

    if (this.#audioSource) {
      this.#audioSource.playbackRate.value = this.#audioGain.gain.value * 2
    }
  }

  destroy() {
    if (this.#audioSource) {
      this.#audioSource.stop()
      this.#audioSource.disconnect()
    }
    this.#audioContext.close()
  }

  #decodeSource = async (buffer: ArrayBuffer) => {
    return this.#audioContext.decodeAudioData(buffer).then((audioBuffer) => {
      const audioSource = this.#audioContext.createBufferSource()
      audioSource.buffer = audioBuffer
      return audioSource
    })
  }

  #fetchBuffer = async (url: string) => {
    return fetch(url).then((response) => response.arrayBuffer())
  }
}
