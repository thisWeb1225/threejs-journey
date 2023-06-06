# 物理引擎 physics
如果只是簡單物理效果，可以使用數學（三角函數）和 Raycaster 來實現，但複雜效果，還是非常建議用一個物理引擎相關的庫。

## 物理引擎庫
關於物理引擎有非常多的庫。 首先要選擇是需要一個 3d 還是 2d 的物理引擎庫。 你可能會認為既然使用了 Three.js 那一定是 3d 庫了，那你就錯了，如果你要表現的物理場景只需要在二維平面上展示（例如3d場景中有個電視在播放一些物理效果，或者你需要開發檯球遊戲），那麼當然是選擇 2d 的物理引擎，其性能會遠好於 3d 引擎。
接下來就介紹幾個物理引擎。

### 3d 物理引擎

|        | Ammo.js  | Cannon.js  |  Oimo.js  |
|  ----  | -------- | ---------- | --------- |
| docs   | none     | yes      |  yes    |
| light or heavy  | A little heavy | Lighter than Ammo.js | Lighter than Ammo.js |
| maintain  | Still updated by a community | Mostly maintained by one developer | Mostly maintained by one developer |

### 2d 物理引擎

|        | Matters.js  | p2.js  |  Planck.js  | Box2d.js |
|  ----  | -------- | ---------- | --------- | --- |
| docs   | yes     | yes      |  yes    | yes |
| maintain  | Mostly maintained by one developer | Mostly maintained by one developer | Mostly maintained by one developer | Mostly maintained by one developer |
| update | Still kind of updated | Hasn't been update for 2 years | Still updated nowadays | Still updated nowadays | 

## 引入物理引擎庫
這裡用 Cannon.js 學習
```bash
npm i -S cannon
nom i -D @types/cannon
```

```js
import CANNON from 'cannon'
```

## 在 three.js 裡準備一平面和小球
為了練習引擎庫，我們要先在 three.js 裡創造一個平面和小球
```ts
// canvas
const canvas = document.querySelector('#mainCanvas') as HTMLCanvasElement;

// Scene
const scene = new THREE.Scene();

// Size
const sizes = {
  width: window.innerWidth;
  height: window.innerHeight;
}

// Camera
const camera = new THREE.PerspectiveCamera(75, size.width / size.height, 0.1, 100);
camera.set(4, 4, 20);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.zoomSpeed = 0.3;

/**
 * Objest
 */
const material = new THREE.MeshStandardMaterial();

// sphere
const sphere = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 16), material)
sphere.position.setY(1)
sphere.castShadow = true
scene.add(sphere)

// plane
const plane = new THREE.Mesh(new THREE.PlaneGeometry(15, 15), material)
plane.rotateX(-Math.PI / 2)
plane.receiveShadow = true
scene.add(plane)

/**
 * Light
 */
const directionLight = new THREE.DirectionalLight()
directionLight.castShadow = true
directionLight.position.set(5, 5, 6)
const ambientLight = new THREE.AmbientLight(new THREE.Color('#ffffff'), 0.3)
scene.add(ambientLight, directionLight)

const directionLightHelper = new THREE.DirectionalLightHelper(directionLight, 2)
directionLightHelper.visible = false
scene.add(directionLightHelper)

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true

// Animations
const tick = () => {
  stats.begin()
  controls.update()

  // Render
  renderer.render(scene, camera)
  stats.end()
  requestAnimationFrame(tick)
}

tick();
```

## 創建物理世界
使用 world() 可以創建物理世界，就好像 three.js 的 scene 一樣
```js
/**
 * Physics
 */
const world = new CANNON.World();
world.gravity.set(0, -9.82, 0);
```

## 創建物理物體
在 cannon 中使用 Shape 和 body 來創造一個具有物理的物體，並添加到 world 當中

```ts
const sphereShape = new CANNON.Sphere(1) // 半徑和 three.js 創造的球一樣
const sphereBody = new CANNON.Body({
  mass: 1,
  position: new CANNON.Vec3(0, 3, 0),
  shape: sphereShape,
});
world.addBody(sphereBody);
```

## 與 three.js 的場景結合
創建好 body 之後，我們需要讓他和 three.js 的場景結合，並讓 three.js 的物體和 cannon 的 body 相同，可以使用 `position.copy`

```ts
// Animations
const clock = new THREE.Clock();
let oldElapsedTime = 0;
const tick = () => {
  controls.update();

  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - oldElapsedTime;
  oldElapsedTime = elapsedTime;

  // Update the physics world
  world.step(1 / 60, deltaTime, 3);

  // let the three.js object's position is same as world step
  sphere.position.copy(sphereBody.position as any);

  // Render
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
}

tick()
```

### 增加地板碰撞
