# 3. geometry
## threejs 內建幾何體
threejs 有內建幾種幾何體，可以直接去他們的官網查看  
[連結](https://threejs.org/docs/index.html#api/zh/geometries/BoxGeometry)

## 創建自己的幾何體
使用 `bufferGeometry` 和 `bufferAttribute` 描述頂點的位置，可以創建自己的幾何體

下面我們來創建自己的三角形

```ts
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

const vertices = new Float32Array([
  0, 0, 0,
  1, 0, 0,
  0, 1, 0,
])

geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))

const material:THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  wireframe: true
});
const triangle = new THREE.Mesh(geometry, material);
scene.add(triangle);

// Camera
const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(75, sizes.width/sizes.height)
camera.position.set(0, 0, 3);
camera.lookAt(triangle.position);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas });
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
const tick = () => {
  
  controls.update()
  
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick()
```

## 隨機放上多個三角形
我們也可以使用隨機函數創造非常多的頂點來繪製多個三角形

```ts
const geometry:THREE.BufferGeometry = new THREE.BufferGeometry()

const triangleVertics = []
for (let i = 0; i < 600; i++) {
  triangleVertics.push((Math.random() - 0.5) * 10)
}

// need a typed array
const vertices = new Float32Array(triangleVertics)

geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
```