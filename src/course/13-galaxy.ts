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

// Camera
const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height
);
camera.position.set(0, 0, 10);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.4;

/**
 * Galaxy
 */
const parameters = {
  count: 1000,
  size: 0.02,
  radius: 5, // 半徑
  branches: 3, // 決定分支數量
  spin: 2, // 增加旋轉角度
  randomness: 0.2, // 隨機擴散
  randomnessPower: 2,
  insideColor: '#ff6030',
  outsideColor: '#1b3984',
};

let geometry: THREE.BufferGeometry;
let material: THREE.PointsMaterial;
let points: THREE.Points<THREE.BufferGeometry, THREE.PointsMaterial>;

const generatorGalaxy = () => {
  if (points) {
    geometry.dispose();
    material.dispose();
    scene.remove(points);
  }

  // set gradinet color
  const colorInside = new THREE.Color(parameters.insideColor);
  const colorOutside = new THREE.Color(parameters.outsideColor);

  geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(parameters.count * 3);
  const colors = new Float32Array(parameters.count * 3);

  for (let i = 0; i < parameters.count; i++) {
    const i3 = i * 3;
    const radius = Math.random() * parameters.radius;
    const branchesAngle =
      ((i % parameters.branches) / parameters.branches) * Math.PI * 2;
    const spinAngle = radius * parameters.spin;

    // use clone() to avoid revising the original colorInside
    const mixedColor = colorInside.clone();
    mixedColor.lerp(colorOutside, radius / parameters.radius);

    const randomX =
      Math.random() ** parameters.randomnessPower *
      (Math.random() < 0.5 ? 1 : -1) *
      parameters.randomness *
      radius;
    const randomY =
      Math.random() ** parameters.randomnessPower *
      (Math.random() < 0.5 ? 1 : -1) *
      parameters.randomness *
      radius;
    const randomZ =
      Math.random() ** parameters.randomnessPower *
      (Math.random() < 0.5 ? 1 : -1) *
      parameters.randomness *
      radius;

    positions[i3 + 0] = Math.cos(branchesAngle + spinAngle) * radius + randomX;
    positions[i3 + 1] = randomY;
    positions[i3 + 2] = Math.sin(branchesAngle + spinAngle) * radius + randomZ;

    colors[i3] = mixedColor.r;
    colors[i3 + 1] = mixedColor.g;
    colors[i3 + 2] = mixedColor.b;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  material = new THREE.PointsMaterial({
    size: parameters.size,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true, // 將每個頂點設置顏色
  });

  points = new THREE.Points(geometry, material);
  scene.add(points);
};

generatorGalaxy();

/**
 * Base
 */

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

  controls.update();

  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();

/**
 * Debug
 */
const gui = new dat.GUI({ width: 400 });

gui.add(parameters, 'count', 100, 1000000, 100).onFinishChange(generatorGalaxy);
gui.add(parameters, 'size', 0.001, 0.1, 0.001).onFinishChange(generatorGalaxy);
gui.add(parameters, 'radius', 1, 20, 0.1).onFinishChange(generatorGalaxy);
gui.add(parameters, 'branches', 2, 20, 1).onFinishChange(generatorGalaxy);
gui.add(parameters, 'spin', 0.1, 20, 0.1).onFinishChange(generatorGalaxy);
gui.add(parameters, 'randomness', 0.1, 20, 0.1).onFinishChange(generatorGalaxy);
gui.add(parameters, 'randomnessPower', 0.1, 20, 0.1).onFinishChange(generatorGalaxy);
gui.addColor(parameters, 'insideColor').onFinishChange(generatorGalaxy);
gui.addColor(parameters, 'outsideColor').onFinishChange(generatorGalaxy);
