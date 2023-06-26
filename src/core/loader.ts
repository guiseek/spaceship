import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
import {noop} from '../utilities'

export class Loader {
  static #loader = new GLTFLoader()

  static loadModel(
    model: `${string}.glb`,
    onProgress: Callback<ProgressEvent<EventTarget>> = noop
  ) {
    return Loader.#loader.loadAsync(`src/models/` + model, onProgress)
  }
}
