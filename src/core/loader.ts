import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
import {noop} from '../utilities'

export class Loader {
  static #onLoaded: Callback<VoidFunction>[] = []
  static set onLoaded(cb: Callback<VoidFunction>) {
    this.#onLoaded.push(cb)
  }

  static #loader = new GLTFLoader()

  static async loadModel(
    path: `${string}.glb`,
    onProgress: Callback<ProgressEvent<EventTarget>> = noop
  ) {
    const url = new URL(`../models/${path}`, import.meta.url)
    return await Loader.#loader.loadAsync(url.href, onProgress)
  }
}
