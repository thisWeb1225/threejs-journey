import * as THREE from 'three'; 
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

/**
 * TypeScript
 */
interface ISizes {
  width: number;
  height: number;
}

// canvas
const canvas = document.querySelector('canvas') as HTMLCanvasElement;
const sizes:ISizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

/**
 * Base
 */
// Scene
const scene:THREE.Scene = new THREE.Scene();

// Object
const geometry:THREE.BufferGeometry = new THREE.BufferGeometry()

const triangleVertics = []
for (let i = 0; i < 600; i++) {
  triangleVertics.push((Math.random() - 0.5) * 10)
}

// Typed array
const vertices = new Float32Array(triangleVertics)

geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))

const material:THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  wireframe: true
});
const triangle:THREE.Mesh = new THREE.Mesh(geometry, material);
scene.add(triangle);

// Camera
const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(75, sizes.width/sizes.height)
camera.position.set(0, 0, 3);
camera.lookAt(triangle.position);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Renderer
const renderer:THREE.WebGLRenderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height)

// size
window.addEventListener('resize', () => {
  // Update size
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  
  // update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// double click to fullscreen
window.addEventListener('dblclick', () => {
  if (!document.fullscreenElement) {
    canvas.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
})

// Animation
const tick:()=>void = () => {
  controls.update()
  
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick()