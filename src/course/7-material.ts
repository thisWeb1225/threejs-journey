import * as THREE from 'three'; 
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


const {log} = console;

/**
 * Type
 */
interface ISizes {
  width: number;
  height: number;
}

interface IParameters {
  color: number;
  spin: () => void;
}


/**
 * Textures
 */
const loadingManeger = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManeger);
const doorColorTexture = textureLoader.load('./../asstes/texture/Door_Wood_001_basecolor.jpg');
const doorOpacity = textureLoader.load('./../asstes/texture/Door_Wood_001_opacity.jpg');
const doorHeight = textureLoader.load('./../asstes/texture/Door_Wood_001_height.png')
const groundDirt = textureLoader.load('./../asstes/texture/GroundDirtRocky002_COL_2K.jpg')

doorColorTexture.generateMipmaps = false;
doorColorTexture.minFilter = THREE.NearestFilter;


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

// Metarial
// const material:THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({
  
// });
// material.map = doorColorTexture;
// material.transparent = true;
// material.alphaMap = doorOpacity;

const material = new THREE.MeshNormalMaterial();
material.wireframe = true;

const materialBack = new THREE.MeshNormalMaterial({
  side: THREE.BackSide
});

// Mesh
const sphere = new THREE.Mesh(new THREE.SphereGeometry(100, 16, 16), materialBack);

const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material);

const torus = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.2, 16, 32), material)

sphere.position.x = -1.5;
// torus.position.x = 1.5;

scene.add(sphere, torus);


// Camera
const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(75, sizes.width/sizes.height)
camera.position.set(0, 0, 3);
camera.lookAt(torus.position);

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

const clock = new THREE.Clock()

const tick:()=>void = () => {
  controls.update();

  const elapsedTime = clock.getElapsedTime();

  sphere.rotation.y = 0.1 * elapsedTime;
  plane.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;

  sphere.rotation.x = 0.1 * elapsedTime;
  plane.rotation.x = 0.1 * elapsedTime;
  torus.rotation.x = 0.1 * elapsedTime;
  
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick()