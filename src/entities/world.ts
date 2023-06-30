import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import {
  Clock,
  Group,
  Vector3,
  SpotLight,
  DirectionalLight,
  PerspectiveCamera,
  HemisphereLight,
} from 'three'
import {SAPBroadphase, World as WorldCannon} from 'cannon-es'
import {Spaceship} from './spaceship'
import {Station} from './station'
import { Octree } from 'three/examples/jsm/math/Octree.js'

export class World extends Group {
  #clock = new Clock()
  #octree = new Octree()
  #station = new Station(this.#octree)
  #spaceship = new Spaceship(new Vector3(10, 10, 10))
  #sunLight = new DirectionalLight(0xffffff, 1)
  #dirLight = new SpotLight(0xffffff, 0.8, 7, 0.8, 1, 1)
  #hemiLight = new HemisphereLight(0x404040, 0x404040, 0.9)

  physicsWorld = new WorldCannon()
  parallelPairs: unknown[] = []
  physicsFrameRate = 60
  physicsFrameTime = 1 / this.physicsFrameRate
  physicsMaxPrediction = this.physicsFrameRate

  constructor(
    readonly camera: PerspectiveCamera,
    readonly controls: OrbitControls
  ) {
    super()

    this.physicsWorld.gravity.set(0, -9.81, 0)
    this.physicsWorld.broadphase = new SAPBroadphase(this.physicsWorld)
    this.physicsWorld.allowSleep = true

    this.#initialize()
  }

  #initialize() {
    this.controls.maxDistance = 60
    this.controls.minDistance = 30

    this.#sunLight.position.set(-36.7376, 33.1402, 6.42296)

    this.#spaceship.update(0)

    this.add(
      this.#sunLight,
      this.#hemiLight,
      this.#dirLight,
      this.#station,
      this.#spaceship
    )
  }

  updatePhysics(timeStep: number) {
    this.physicsWorld.step(this.physicsFrameTime, timeStep)
  }

  update(timeStep: number) {
    this.updatePhysics(timeStep)

    const delta = this.#clock.getDelta()
    this.#spaceship.update(delta)
    // this.#spaceship.collision(this.#octree)

    this.controls.target = this.#spaceship.position
  }
}
