import * as THREE from 'three'; 
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// canvas
interface ISize {
  width: number;
  height: number;
}
const canvas = document.querySelector('canvas') as HTMLCanvasElement;
const size:ISize = {
  width: canvas.clientWidth,
  height: canvas.clientHeight,
};

/**
 * Cursor
 */
interface ICursor {
  x: number;
  y: number;
}
const cursor:ICursor = {
  x: 0,
  y: 0
}
window.addEventListener('mousemove', (e:MouseEvent) => {
  cursor.x = e.clientX / size.width - 0.5;
  cursor.y = -(e.clientY / size.height - 0.5);
})

/**
 * Base
 */
// Scene
const scene = new THREE.Scene();

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({
  color: 0xff0000,
});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Camera
const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(75, size.width/size.height)
camera.position.set(0, 0, 3);
camera.lookAt(cube.position);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(canvas.clientWidth, canvas.clientHeight);

// Clock
const clock = new THREE.Clock();

// Animation
const tick = () => {
  // Clock
  const elapsedTime = clock.getElapsedTime();
  controls.update()

  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick()