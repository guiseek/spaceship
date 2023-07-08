import {isMobile, onProgress} from '../utilities'
import {AudioControl, Input, Loader} from '../core'
import {Weapon} from './weapon'
import {
  Group,
  Vector3,
  Quaternion,
  AnimationMixer,
  AnimationAction,
} from 'three'
import {Capsule} from 'three/examples/jsm/math/Capsule.js'
import {Octree} from 'three/examples/jsm/math/Octree.js'

export class Spaceship extends Group {
  name = 'spaceship'

  #speed = 2
  #maxSpeed = 8
  #minSpeed = 2
  #acceleration = 0.2

  #rotationAngle = 0.03
  #yaw = new Vector3(0, 1, 0)
  #currentRotation = new Quaternion()

  #collider = new Capsule(new Vector3(0, 0.35, 0), new Vector3(0, 1, 0), 0.35)
  #weapon = new Weapon()

  #input = new Input()
  #audio = new AudioControl()

  #mixer!: AnimationMixer
  #actions: AnimationAction[] = []

  constructor(position?: Vector3) {
    super()

    if (position) {
      this.position.copy(position)
    }

    this.#initialize()
  }

  async #initialize() {
    const {scene, animations} = await Loader.load(
      `${this.name}.glb`,
      onProgress(this.name)
    )

    this.add(scene, this.#weapon)

    this.#mixer = new AnimationMixer(scene)
    for (const anim of animations) {
      this.#actions.push(this.#mixer.clipAction(anim))
    }
    this.#activateActions(0.3)

    if (isMobile()) {
      this.#input.onRotation = (deviceRotation) => {
        this.#currentRotation.copy(deviceRotation)
      }
    }

    if (!this.#audio.connected) {
      this.#audio.connect(`engine-01.wav`)
    }

    onclick = () => {
      this.#weapon.shoot()
    }
  }

  explode() {
    console.log('morreu')
  }

  collision(octree: Octree) {
    const result = octree.capsuleIntersect(this.#collider)

    if (result) {
      console.log(result)
    }
  }

  update(delta: number) {
    this.#handleInput()

    if (this.#audio.connected) {
      // const alpha = getAlpha(delta)

      // this.#rotateSmoothly(alpha)

      this.#toForward(this.#speed)

      // this.#collider.translate(this.position)

      this.#weapon.update(delta)

      if (this.#mixer) {
        this.#mixer.update(delta)
      }
    }

    this.#audio.update()
  }

  #handleInput() {
    if (this.#input.key.A) {
      this.#toLeft(this.#rotationAngle)
    }

    if (this.#input.key.D) {
      this.#toRight(this.#rotationAngle)
    }

    if (this.#input.key.W) {
      this.#toDown(this.#rotationAngle)
    }

    if (this.#input.key.S) {
      this.#toUp(this.#rotationAngle)
    }

    if (this.#input.key.Space) {
      this.#onBrakeShip()
    } else if (!this.#input.key.ShiftLeft) {
      this.#onBackToForward()
    }

    if (this.#input.key.ShiftLeft) {
      this.#onFastForward(this.#speed)
    }
  }

  #onBrakeShip() {
    this.#audio.setGain(0.4)
    this.#updatePropellant(0.2)
    this.#toBrake(this.#speed)
  }

  #onBackToForward() {
    this.#updatePropellant(0.6)
    this.#audio.setGain(0.6)
  }

  #onFastForward(speed = 0) {
    this.#audio.setGain(1)
    this.#updatePropellant(1)
    this.#toForward(speed)
  }

  #updatePropellant(weight: number) {
    if (this.#mixer) {
      for (const action of this.#actions) {
        action.setEffectiveWeight(weight)
        action.setEffectiveWeight(weight)
      }
    }
  }

  #toUp(angle: number) {
    this.rotateX(-angle)
  }

  #toDown(angle: number) {
    this.rotateX(angle)
  }

  #toLeft(angle: number) {
    const quaternion = new Quaternion().setFromAxisAngle(this.#yaw, angle)
    this.#currentRotation.multiply(quaternion)
    this.rotateZ(-angle)
  }

  #toRight(angle: number) {
    const quaternion = new Quaternion().setFromAxisAngle(this.#yaw, -angle)
    this.#currentRotation.multiply(quaternion)
    this.rotateZ(angle)
  }

  // #rotateSmoothly(alpha: number) {
  //   const quaternion = new Quaternion()
  //   quaternion.slerpQuaternions(this.quaternion, this.#currentRotation, alpha)
  //   this.quaternion.copy(quaternion)
  // }

  #toForward(speed = 0) {
    const currentSpeed = Math.min(speed + this.#acceleration, this.#maxSpeed)
    const direction = new Vector3(0, 0, -1).applyQuaternion(this.quaternion)
    this.position.addScaledVector(direction, -currentSpeed)
  }

  #toBrake(speed = 0) {
    const currentSpeed = Math.max(speed - this.#acceleration, this.#minSpeed)
    const direction = new Vector3(0, 0, -1).applyQuaternion(this.quaternion)
    this.position.addScaledVector(direction, currentSpeed)
  }

  #activateActions(weight: number) {
    this.#actions.forEach((action) => {
      action.enabled = true
      action.setEffectiveWeight(1)
      action.setEffectiveWeight(weight)
      action.play()
    })
  }
}
