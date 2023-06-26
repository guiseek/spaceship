import {Group, Vector3, Quaternion} from 'three'
import {AudioControl, Input, Loader} from '../core'
import {onProgress} from '../utilities'

export class Spaceship extends Group {
  #input = new Input()

  #speed = 2
  #maxSpeed = 6
  #minSpeed = 1
  #acceleration = 0.2

  #rotationAngle = 0.04
  #yaw = new Vector3(0, 1, 0)
  #currentRotation = new Quaternion()

  #audio = new AudioControl('spaceship.mp3')

  constructor(position?: Vector3) {
    super()

    Loader.loadModel('spaceship.glb', onProgress('Spaceship')).then(
      ({scene}) => {
        this.add(scene)
        this.#audio.play()
      }
    )

    if (position) {
      this.position.copy(position)
    }
  }

  update(deltaTime: number): void {
    const alpha = Math.min(4 * deltaTime, 1)

    this.handleInput()

    this.rotateSmoothly(alpha)

    this.toForward(this.#speed)

    this.#audio.update()
  }

  handleInput(): void {
    if (this.#input.key.A) {
      this.toLeft(this.#rotationAngle)
    }

    if (this.#input.key.D) {
      this.toRight(this.#rotationAngle)
    }

    if (this.#input.key.W) {
      this.toDown(this.#rotationAngle)
    }

    if (this.#input.key.S) {
      this.toUp(this.#rotationAngle)
    }

    if (this.#input.key.ShiftLeft) {
      this.toForward(this.#speed)
      this.#audio.setVolume(1)
      console.log('shift');
      
    }

    if (this.#input.key.Space) {
      this.toBrake(this.#speed)
      this.#audio.setVolume(0.1)
    } else {
      this.#audio.setVolume(0.5)
    }
  }

  toUp(angle: number) {
    this.rotateX(-angle)
  }

  toDown(angle: number) {
    this.rotateX(angle)
  }

  toLeft(angle: number): void {
    const quaternion = new Quaternion().setFromAxisAngle(this.#yaw, angle)
    this.#currentRotation.multiply(quaternion)
    this.rotateZ(-angle)
  }

  toRight(angle: number): void {
    const quaternion = new Quaternion().setFromAxisAngle(this.#yaw, -angle)
    this.#currentRotation.multiply(quaternion)
    this.rotateZ(angle)
  }

  rotateSmoothly(alpha: number): void {
    const quaternion = new Quaternion()
    quaternion.slerpQuaternions(this.quaternion, this.#currentRotation, alpha)
    this.quaternion.copy(quaternion)
  }

  toForward(speed = 0): void {
    const currentSpeed = Math.min(speed + this.#acceleration, this.#maxSpeed)
    const direction = new Vector3(0, 0, -1).applyQuaternion(this.quaternion)
    this.position.addScaledVector(direction, -currentSpeed)
  }

  toBrake(speed = 0) {
    const currentSpeed = Math.max(speed - this.#acceleration, this.#minSpeed)
    const direction = new Vector3(0, 0, -1).applyQuaternion(this.quaternion)
    this.position.addScaledVector(direction, currentSpeed)
  }
}
