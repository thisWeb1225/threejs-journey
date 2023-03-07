# 1. Animation
在 Three.js 中，想要讓物體動起來，有幾種方式
## 1. 基於時間間隔
為了避免在某些高更新率螢幕動畫速度變快，我們需要把動畫播放與時間相關，而不是和幀數  
可以使用 requestAnimationFrame 和 Data.now 還獲取時間差，螢幕更新越快，時間差會越小

```js
import * as THREE from 'three';

// canvas
const canvas = document.querySelector('canvas')

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

// Time
let time = Date.now();

// Animation
const tick = () => {
  
  // Time
  const currentTime = Date.now();
  const deltaTime = currentTime - time;
  time = currentTime;

  cube.rotation.y = Math.sin(elapsedTime);

  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
}

tick()
```

## 2. THREE.js 內建的 Clock
我們也可以利用 `THREE.Clock.getElapsedTime()` 來獲得經過的時間，會從 0 開始

除了移動物體以外，我們也可以移動相機的位置，效果是一樣的  
還可以加上 `camera.lookAt(cube.position)` 讓 camera 永遠看著物體

```js
import * as THREE from 'three';

// canvas
const canvas = document.querySelector('canvas')

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

// Time
let time = Date.now();

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
```

## 3. 使用 gsap
當然我們也可以搭配很有名的動畫庫 gsap
```js
import * as THREE from 'three';
import gsap from 'gsap';

// canvas
const canvas = document.querySelector('canvas')

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

gsap.to(cube.position, {
  duration:1,
  delay: 1,
  x: 2
})
gsap.to(cube.position, {
  duration:1,
  delay: 2,
  x: 0
})

// Animation
const tick = () => {
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
}

tick()
```