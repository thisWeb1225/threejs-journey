# 3. fullscreen-and-resize
可以這樣設置來讓畫布充滿窗口，以及根據窗口 resize 調整畫布大小
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
const scene = new THREE.Scene();

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({
  color: 0xff0000,
});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Camera
const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(75, sizes.width/sizes.height)
camera.position.set(0, 0, 3);
camera.lookAt(cube.position);

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


// Animation
const tick = () => {
  
  controls.update()
  
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick()
```
使用 `setPixelRatio` 可以解決鋸齒的問題，但不需要設置太高，會影響性能  
在選擇螢幕時也要注意，我們不需要那麼高的 piexl ratio，最多到 3 就好了，因為我們也幾乎看不出差別了  
同時也要在 resize 事件中是置，因為使用者可能會拖動視窗到不同的顯示器中  

## 雙擊進入全螢幕 (fullscreen)
為了讓用戶有更好的體驗，我們可以設置雙擊進入全螢幕
```ts
// double click to fullscreen
window.addEventListener('dblclick', () => {
  if (!document.fullscreenElement) {
    canvas.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
})
```