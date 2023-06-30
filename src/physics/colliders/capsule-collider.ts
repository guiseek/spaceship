import {Body, Material, Sphere, Vec3} from 'cannon-es'
import {Collider} from '../../core'

interface CapsuleColliderOptions {
  position: Vec3
  height: number
  friction: number
  segments: number
  radius: number
  mass: number
}

export class CapsuleCollider implements Collider {
  body: Body

  options

  constructor({
    mass = 0,
    position = new Vec3(),
    height = 0.5,
    radius = 0.3,
    segments = 8,
    friction = 0.3,
  }: CapsuleColliderOptions) {
    this.options = structuredClone({
      mass,
      position,
      height,
      radius,
      segments,
      friction,
    })

    const material = new Material('capsuleMat')
    material.friction = friction

    this.body = new Body({position, mass, material})

    const sphereShape = new Sphere(radius)
    this.body.addShape(sphereShape, new Vec3(0, 0, 0))
    this.body.addShape(sphereShape, new Vec3(0, height / 2, 0))
    this.body.addShape(sphereShape, new Vec3(0, -height / 2, 0))
  }
}
