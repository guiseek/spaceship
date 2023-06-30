import {Octree} from 'three/examples/jsm/math/Octree.js'
import {onProgress} from '../utilities'
import {Loader} from '../core'
import {Group} from 'three'

export class Station extends Group {
  name = 'station'

  constructor(octree: Octree) {
    super()

    const onLoad = onProgress(this.name)

    Loader.load(`${this.name}.glb`, onLoad).then(({scene}) => {
      octree.fromGraphNode(scene)
      scene.traverse((child: any) => {
        if (child.isMesh) {
          child.castShadow = true
          if (child.material.map) {
            child.material.map.anisotropy = 4
          }
          
        }
      })
      this.add(scene)
    })

    this.position.y = 0
    this.position.z = 0
    this.position.x = 0
  }
}
