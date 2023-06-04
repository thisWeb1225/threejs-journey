import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper';


// canvas
const canvas = document.querySelector('canvas') as HTMLCanvasElement;
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Scene
const scene: THREE.Scene = new THREE.Scene();
// scene.background = new THREE.Color('pink');

/**
 * Object
 */
// circle count
const circleCount = 19;
const circleArr: any[] = [];

for (let i = 1; i < circleCount + 1; i++) {
  const radius = i < circleCount / 2 ? i : circleCount - i;
  const r = Math.floor(Math.random() * 50 + 40);
  const g = Math.floor(Math.random() * 50 + 70);
  const b = Math.floor(Math.random() * 50 + 150);

  const circle = new THREE.Mesh(
    new THREE.CircleGeometry(1),
    new THREE.MeshStandardMaterial({
      color: `rgb(${r}, ${g}, ${b})`,
      side: THREE.DoubleSide,
    })
  );
  const positionZ = i - circleCount / 2;
  circle.position.set(0, 0, positionZ);
  circleArr.push(circle);
  scene.add(circle);
}

/**
 * Light
 */

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
// ambientLight.color = new THREE.Color(0xffffff);
// ambientLight.intensity = 0.5
scene.add(ambientLight);

const rectAreaLight = new THREE.RectAreaLight(0xffffff, 20, 5, 5);
rectAreaLight.position.set(0, 10, 10);
rectAreaLight.lookAt(new THREE.Vector3());
scene.add(rectAreaLight);

const rectAreaLight2 = new THREE.RectAreaLight(0xffffff, 20, 5, 5);
rectAreaLight2.position.set(0, -10, -10);
rectAreaLight2.lookAt(new THREE.Vector3());
scene.add(rectAreaLight2);

// Camera
const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height
);
camera.position.set(0, 0, 40);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Renderer
const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);

// size
window.addEventListener('resize', () => {
  // Update size
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // update camera
  camera.aspect = sizes.width / sizes.height;

  // update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

const clock = new THREE.Clock;

// Animation
const tick: () => void = () => {
  controls.update();

  let elapseTime = clock.getElapsedTime()

  circleArr.forEach((circle, i) => {
    circle.position.z += 0.02;
    let size = Math.cos(circle.position.z / (circleCount / 2) * (Math.PI / 2)) * circleCount / 2;
    circle.scale.set(size,size,size);
    if (circle.position.z > circleCount / 2) circle.position.z = -(circleCount / 2);
  })

  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
