import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import {PerspectiveCamera, Scene, WebGLRenderer} from 'three'
import {World} from './entities'

const scene = new Scene()

const camera = new PerspectiveCamera(45, innerWidth / innerHeight, 10, 10000000)
const renderer = new WebGLRenderer({antialias: true})
renderer.setPixelRatio(devicePixelRatio)
renderer.setClearColor(0x000006, 1)

const controls = new OrbitControls(camera, renderer.domElement)

const world = new World(camera, controls)

controls.update()

scene.add(world)

const animate = () => {
  world.update()
  controls.update()
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}

animate()

const resizeHandler = () => {
  const {innerHeight, innerWidth} = window
  renderer.setSize(innerWidth, innerHeight)
  camera.aspect = innerWidth / innerHeight
  camera.updateProjectionMatrix()
}

resizeHandler()
onresize = resizeHandler

document.body.appendChild(renderer.domElement)
document.body.style.margin = '0'
