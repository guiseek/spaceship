import {timeOut} from '../utilities'
import {
  Mesh,
  Group,
  Vector3,
  Object3D,
  TorusGeometry,
  MeshBasicMaterial,
  SphereGeometry,
} from 'three'

export class Weapon extends Group {
  #projectiles: Object3D[] = []
  #cooldownTime = 0.2
  #aim?: Mesh

  #isReady = true

  shoot() {
    if (!this.#isReady) return

    if (this.parent) {
      if (!this.#aim) {
        this.#aim = new Mesh(
          new TorusGeometry(0.4, 0.05, 2, 20),
          new MeshBasicMaterial({color: 0x00ff00})
        )
        this.parent.add(this.#aim)
      }

      const projectile = new Mesh(
        new SphereGeometry(0.3, 3, 3),
        new MeshBasicMaterial({color: 0x00ff26})
      )
      this.#projectiles.push(projectile)
      this.parent.add(projectile)
    }

    this.#isReady = false

    timeOut(() => (this.#isReady = true), this.#cooldownTime)
  }

  update(delta: number) {
    const speed = 1000
    const maxDistance = 200

    if (this.#aim) {
      this.#aim.position.set(0, 0, 10)
    }

    
    for (let i = this.#projectiles.length - 1; i >= 0; i--) {
      const projectile = this.#projectiles[i]
      
      const distance = speed * delta
      const direction = new Vector3(0, 0, 1).applyQuaternion(
        projectile.quaternion
      )
      projectile.position.addScaledVector(direction, distance)

      // projectile.position.add(direction)

      if (projectile.position.z > maxDistance) {
        if (this.parent) this.parent.remove(projectile)
        this.#projectiles.splice(i, 1)
      }
    }
  }
}
