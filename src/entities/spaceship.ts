import {getAlpha, isMobile, onProgress} from '../utilities'
import {AudioControl, Input, Loader} from '../core'
import {Weapon} from './weapon'
import {
  Group,
  Vector3,
  Quaternion,
  AnimationMixer,
  AnimationAction,
} from 'three'

export class Spaceship extends Group {
  name = 'spaceship'

  #speed = 2
  #maxSpeed = 6
  #minSpeed = 1
  #acceleration = 0.2

  #rotationAngle = 0.04
  #yaw = new Vector3(0, 1, 0)
  #currentRotation = new Quaternion()

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

    this.#audio.connect(`engine-01.wav`)

    if (isMobile()) {
      this.#input.onRotation = (deviceRotation) => {
        this.#currentRotation.copy(deviceRotation)
      }
    }

    onclick = () => this.#weapon.shoot()
  }

  explode() {
    console.log('morreu')
  }

  update(delta: number) {
    const alpha = getAlpha(delta)

    this.#handleInput()

    this.#rotateSmoothly(alpha)

    this.#toForward(this.#speed)

    this.#weapon.update(delta)

    if (this.#mixer) {
      this.#mixer.update(delta)
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
    // this.#currentRotation.z -= angle
    this.rotateZ(-angle)
  }

  #toRight(angle: number) {
    const quaternion = new Quaternion().setFromAxisAngle(this.#yaw, -angle)
    this.#currentRotation.multiply(quaternion)
    this.rotateZ(angle)
  }

  #rotateSmoothly(alpha: number) {
    const quaternion = new Quaternion()
    quaternion.slerpQuaternions(this.quaternion, this.#currentRotation, alpha)
    this.quaternion.copy(quaternion)
  }

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
