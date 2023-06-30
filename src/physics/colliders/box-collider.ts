import {Body, Box, Material, Vec3} from 'cannon-es'
import {Collider} from '../../core'
import {Vector3} from 'three'

interface BoxColliderOptions {
  position: Vector3 | Vec3
  size: Vector3 | Vec3
  friction: number
  mass: number
}

export class BoxCollider implements Collider {
  body

  constructor(options: BoxColliderOptions) {
    options.position = new Vec3(
      options.position.x,
      options.position.y,
      options.position.z
    )
    options.size = new Vec3(options.size.x, options.size.y, options.size.z)

    const mat = new Material('boxMat')
    mat.friction = options.friction

    const shape = new Box(options.size)

    this.body = new Body({
      position: options.position,
      mass: options.mass,
      shape,
    })

    this.body.material = mat
  }
}
