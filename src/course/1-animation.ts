import * as THREE from 'three';
import gsap from 'gsap';

// canvas
const canvas = document.querySelector('canvas')!

// Scene
const scene = new THREE.Scene();

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({
  color: 0xff0000
})
const cube = new THREE.Mesh(
  geometry,
  material
)
scene.add(cube);

// Camera
const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight)
camera.position.set(2, 2, 2);
camera.lookAt(cube.position)

// Renderer
const renderer = new THREE.WebGLRenderer({canvas})
renderer.setSize(canvas.clientWidth, canvas.clientHeight)

// Clock
const clock = new THREE.Clock()

// Animation
const tick = () => {
  
  // Clock
  const elapsedTime = clock.getElapsedTime();
  camera.position.y = Math.sin(elapsedTime);
  camera.position.x = Math.cos(elapsedTime)
  camera.lookAt(cube.position)

  cube.rotation.y = Math.sin(elapsedTime);

  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
}

tick()