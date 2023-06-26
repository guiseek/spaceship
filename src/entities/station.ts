import {Loader} from '../core'
import {Group} from 'three'

export class Station extends Group {
  constructor() {
    super()

    this.name = 'Station'

    Loader.loadModel('station.glb').then(({scene}) => {
      this.add(scene)
    })

    this.position.y = 0
    this.position.z = 0
    this.position.x = 0
  }
}
