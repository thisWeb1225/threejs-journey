import * as THREE from 'three'; 
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';
import gsap from 'gsap';

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
 * Debug
 */
const gui = new dat.GUI();

const parameters: IParameters = {
  color: 0xff0000,
  spin: () => {
    gsap.to(cube.rotation, {
      duration: 1,
      y: cube.rotation.y + 10
    })
  }
}

// gui
//   .addColor(parameters, 'color')
//   .onChange(() => {
//     material.color.set(parameters.color)
//   });

// gui.add(parameters, 'spin')


/**
 * Textures
 */
const loadingManeger = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManeger);
const colorTexture = textureLoader.load('./../assets/texture/Door_Wood_001_basecolor.jpg');

colorTexture.generateMipmaps = false;
colorTexture.minFilter = THREE.NearestFilter;


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
const geometry:THREE.BoxGeometry = new THREE.BoxGeometry(1, 1, 1);

const material:THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({
  map: colorTexture,
});
const cube:THREE.Mesh = new THREE.Mesh(geometry, material);
scene.add(cube);


// Camera
const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(75, sizes.width/sizes.height)
camera.position.set(0, 0, 3);
camera.lookAt(cube.position);

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