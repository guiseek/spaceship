import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import {PerspectiveCamera, Scene, WebGLRenderer} from 'three'
import {timeOut} from './utilities'
import {dialog} from './elements'
import {World} from './entities'
import './style.scss'

const scene = new Scene()

const camera = new PerspectiveCamera(45, innerWidth / innerHeight, 10, 10000000)
const renderer = new WebGLRenderer({antialias: true})
renderer.setPixelRatio(devicePixelRatio)
// renderer.setClearColor(0xffffff, 1)

const controls = new OrbitControls(camera, renderer.domElement)

const world = new World(camera, controls)

controls.update()

scene.add(world)

const animate = (timeStep: number) => {
  world.update(timeStep)
  controls.update()
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}

const resizeHandler = () => {
  const {innerHeight, innerWidth} = window
  renderer.setSize(innerWidth, innerHeight)
  camera.aspect = innerWidth / innerHeight
  camera.updateProjectionMatrix()
}

resizeHandler()
onresize = resizeHandler

document.body.append(renderer.domElement, dialog)

dialog.onclose = () => {
  timeOut(() => {
    dialog.remove()
    animate(1)
  }, 0.5)
}
