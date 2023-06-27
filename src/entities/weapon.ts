import {
  Mesh,
  Group,
  Vector3,
  Object3D,
  SphereGeometry,
  MeshBasicMaterial,
} from 'three'

export class Weapon extends Group {
  projectiles: Object3D[] = []
  cooldownTime = 0.2
  isReady = true

  shoot() {
    if (!this.isReady) return

    const projectile = new Mesh(
      new SphereGeometry(0.1, 3, 3),
      new MeshBasicMaterial({color: 0x00ff26})
    )

    projectile.position.copy(this.position)
    projectile.quaternion.copy(this.quaternion)

    this.projectiles.push(projectile)
    this.add(projectile)

    this.isReady = false
    setTimeout(() => {
      this.isReady = true
    }, this.cooldownTime * 1000)
  }

  update(deltaTime: number) {
    const speed = 50

    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const projectile = this.projectiles[i]

      const direction = new Vector3(0, 0, 1).applyQuaternion(
        projectile.quaternion
      )
      const distance = speed * deltaTime
      projectile.position.addScaledVector(direction, distance)

      const maxDistance = 100
      if (projectile.position.z > maxDistance) {
        this.remove(projectile)
        this.projectiles.splice(i, 1)
      }
    }
  }
}
