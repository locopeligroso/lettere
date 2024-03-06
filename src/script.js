import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { SMAAPass } from 'three/addons/postprocessing/SMAAPass.js'
import { gsap } from "gsap";
import GUI from 'lil-gui'




/* Vars & Function */
let cursorX = 0
let cursorY = 0

window.addEventListener('mousemove', (event) => {
    // per avere cursorX da -1 a 1
    cursorX = ((event.clientX / sizes.width) - 0.5) * 2
    cursorY = ((event.clientY / sizes.height) - 0.5) * -2

    pointLight.position.x = cursorX * 3
    pointLight.position.y = cursorY * 3

    cameraCtrl.rotation.x = cursorY * Math.PI * 0.1
    cameraCtrl.rotation.y = -cursorX * Math.PI * 0.1
})
console.log(cursorX)

/**
 * Base
 */
// Debug
const gui = new GUI({ width: 400 })


// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()



/**
 * Fonts
*/
const fontLoader = new FontLoader()

const params = {
    size: 1.2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: .04,
    bevelOffset: 0,
    bevelSegments: 12
}

/* group */
const letters = new THREE.Group()
letters.position.y = -0.6
scene.add(letters)

// Material
const material = new THREE.MeshLambertMaterial({ color: '#0047FF', side: THREE.DoubleSide })


const defaultHeight = 0.5
const spessore = defaultHeight / 2



fontLoader.load(
    '/fonts/Overpass ExtraBold_Regular.json',
    (font) => {

        const generateLetter = (letterString, position, height) => {
            const letter = letterString.toUpperCase()

            const letterGeometry = new TextGeometry(letter, {
                font: font,
                size: params.size,
                height: height,
                curveSegments: params.curveSegments,
                bevelEnabled: params.bevelEnabled,
                bevelThickness: params.bevelThickness,
                bevelSize: params.bevelSize,
                bevelOffset: params.bevelOffset,
                bevelSegments: params.bevelSegments
            });

            letterGeometry.computeBoundingBox();
            const letterBoundingBox = letterGeometry.boundingBox;
      

            const letterMesh = new THREE.Mesh(
                letterGeometry,
                material
            );

            letterMesh.position.copy(position);
            letterMesh.castShadow = true,
            letters.add(letterMesh);
        };

        // stringa, posizione x, y, z, spessore
        generateLetter('e', new THREE.Vector3(-1, 0.5, 0), spessore * 2)
        generateLetter('p', new THREE.Vector3(-1.05, 0.1, 0), spessore * 0.5)
        generateLetter('i', new THREE.Vector3(-0.28, -0.2, 0), spessore  * 0.5)
        generateLetter('c', new THREE.Vector3(-0.32, 0.5, 0), spessore)
        generateLetter('o', new THREE.Vector3(0.4, -0.4, 0), spessore * 2)
    }

)


/* OBJ */
const geometryPlane = new THREE.PlaneGeometry(20, 20)
const meshPlane = new THREE.Mesh(geometryPlane, material)
meshPlane.receiveShadow = true
scene.add(meshPlane)

/* Lights */
const pointLight = new THREE.PointLight(0xffffff, 16, 7)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
pointLight.position.set(2, 2, 2)
pointLight.decay = 1.5

pointLight.castShadow = true
pointLight.shadow.camera.near = 0.1
pointLight.shadow.camera.far = 6
pointLight.shadow.mapSize.width = 2048 * 2
pointLight.shadow.mapSize.height = 2048 * 2
scene.add(pointLight, ambientLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(20, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 10

// metto la camera in un gruppo che potrò ruotare per dare un certo effetto
const cameraCtrl = new THREE.Group()
cameraCtrl.add(camera)
scene.add(cameraCtrl)

// Controls
/*
*/
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
// renderer.shadowMap.type = THREE.PCFSoftShadowMap

/**
 * DEBUG
 */
const matCntrl = gui.addFolder('Materiali')
matCntrl.add(material, "wireframe")

const geometryCntrl = gui.addFolder('Geometrie')


/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()


    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()