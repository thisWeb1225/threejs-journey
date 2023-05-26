import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';

// canvas
const canvas = document.querySelector('canvas') as HTMLCanvasElement;
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Scene
const scene: THREE.Scene = new THREE.Scene();

/**
 * Particles
 */
// const sphereGeometry = new THREE.SphereGeometry(2, 32, 32);
const pointMaterial = new THREE.PointsMaterial({
  size: 0.01,
  sizeAttenuation: true,
  color: '#2ecce0',
  alphaTest: 0.001,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
});

// geometry
const particlesGeometry = new THREE.BufferGeometry();
const count = 200000;
const position = new Float32Array(count * 3);
for (let i = 0; i < count * 3; i++) {
  position[i / 2] = (Math.random() - 0.5) * 50;
  position[i / 2 + 1] = (Math.random() - 0.5) * 50;
  position[i / 2 + 2] = (Math.random() - 0.5) * 50;
}
particlesGeometry.setAttribute(
  'position',
  new THREE.BufferAttribute(position, 3)
);

const particles = new THREE.Points(particlesGeometry, pointMaterial);
scene.add(particles);

/**
 * Base
 */

// Camera
const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height
);
camera.position.set(0, 0, 40);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.4;

// Renderer
const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);

renderer.setClearColor('#23232b');

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;

// size
window.addEventListener('resize', () => {
  // Update size
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Animation
 */
const clock = new THREE.Clock();

const tick: () => void = () => {
  controls.update();

  const elapsedTime = clock.getElapsedTime();
  for (let i = 0; i < count; i += 1) {
    //@ts-ignore
    const x = particlesGeometry.attributes.position.getX(i);
    //@ts-ignore
    const z = particlesGeometry.attributes.position.getZ(i);
    //@ts-ignore
    const y = particlesGeometry.attributes.position.getY(i);
    //@ts-ignore
    particlesGeometry.attributes.position.setY(i, Math.tan(elapsedTime + x / 2) * Math.sin(elapsedTime + z / 2));
    //@ts-ignore
    particlesGeometry.attributes.position.setZ(i, Math.tan(elapsedTime + y/ 2));
  }
  particlesGeometry.attributes.position.needsUpdate = true;

  controls.update();

  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();

/**
 * Debug
 */
const gui = new dat.GUI();

// gui.add(controls, 'autoRotate')
// gui.add(controls, 'autoRotateSpeed', 0.1, 10, 0.01)
// gui.add(pointMaterial, 'size', 0.01, 0.1, 0.001)
// gui.add(pointMaterial, 'sizeAttenuation')
