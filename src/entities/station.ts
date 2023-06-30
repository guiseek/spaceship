import {onProgress} from '../utilities'
import {Loader} from '../core'
import {Group} from 'three'

export class Station extends Group {
  name = 'station'

  constructor() {
    super()

    const onLoad = onProgress(this.name)

    Loader.load(`${this.name}.glb`, onLoad).then(({scene}) => {
      this.add(scene)
    })

    this.position.y = 0
    this.position.z = 0
    this.position.x = 0
  }
}
