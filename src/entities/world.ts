import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import {
  Clock,
  Group,
  SpotLight,
  DirectionalLight,
  PerspectiveCamera,
  HemisphereLight,
} from 'three'
import {Spaceship} from './spaceship'
import {Station} from './station'

export class World extends Group {
  clock = new Clock()
  #station = new Station()
  #spaceship = new Spaceship()
  #sunLight = new DirectionalLight(0xffffff, 1)
  #dirLight = new SpotLight(0xffffff, 0.8, 7, 0.8, 1, 1)
  #hemiLight = new HemisphereLight(0x404040, 0x404040, 0.9)

  constructor(
    readonly camera: PerspectiveCamera,
    readonly controls: OrbitControls
  ) {
    super()

    this.controls.maxDistance = 50
    this.controls.minDistance = 40

    this.#sunLight.position.set(0, 100, 0)

    this.add(this.#sunLight, this.#hemiLight, this.#dirLight, this.#station, this.#spaceship)
  }

  update() {
    const delta = this.clock.getDelta()
    this.#spaceship.update(delta)
    this.controls.target = this.#spaceship.position
  }
}
