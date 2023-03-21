import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment';
const canvas = document.querySelector('canvas.webgl')

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
const scene = new THREE.Scene()
let model;
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height,1, 100 )
camera.position.set( 5, 2, 8 );
camera.position.z = 2
scene.add(camera)

const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('draco/')

const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

// var spotLight = new THREE.SpotLight( 0xffffff )
// spotLight.position.set(-40,60,-10)
// scene.add(spotLight)

gltfLoader.load(
    'free_1975_porsche_911_930_turbo.glb',
    (gltf) =>
    {
      model=gltf.scene;
        scene.add(gltf.scene)
    },
    (progressEvent) => {
       console.log(progressEvent)
    }
)



const cursor ={x:0, y:0}
window.addEventListener('mousemove', (event) =>
{
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = -( event.clientY / sizes.width - 0.5)
})


const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.outputEncoding = THREE.sRGBEncoding;
const controls = new OrbitControls(camera, canvas)
controls.target.set( 0, 0.5, 0 );
const pmremGenerator = new THREE.PMREMGenerator( renderer );
scene.environment = pmremGenerator.fromScene( new RoomEnvironment(), 0.04 ).texture;
scene.background = new THREE.Color( 0x90EE90 );
controls.enableDamping = true;
window.addEventListener('dblclick',() =>
{
    if(!document.fullscreenElement)
    {
        canvas.requestFullscreen()
    }
    else
    {
        document.exitFullscreen()
    }
})


window.addEventListener('resize', () => 
{
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()    

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
})
const animate = () =>
{
    if(model){
        model.rotation.y += 0.01;
    }
    renderer.render(scene, camera)
    controls.update()

    window.requestAnimationFrame(animate)
}

animate()