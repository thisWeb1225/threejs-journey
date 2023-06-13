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
```js
// floor
const floorShape = new CANNON.Plane();
const floorBody = new CANNON.Body({
  mass: 0, // means that don't drop
  shape: floorShape,
})
// 添加旋轉讓他變地板
floorBody.quaternion.setFromAxisAngle(
  new CANNON.Vec3(-1, 0, 0),
  Math.PI / 2
)
world.addBody(floorBody);
```

### 碰撞材質
Cannonjs 裡面有很多碰撞材質可以使用，橡膠、水泥等等，不過在大部分情況下，使用預設就很夠用了
```ts
// Materials
const defaultMaterial = new CANNON.Material('defalut');

const defaultContactMaterial = new CANNON.ContactMaterial(
  defaultMaterial,
  defaultMaterial, {
    friction: 0.1,
    restitution: 0.7,
  }
)
world.addContactMaterial(defaultContactMaterial);
```

要記得將賦予物體材質
```ts
const sphereBody = new CANNON.Body({
  mass: 1,
  position: new CANNON.Vec3(0, 3, 0),
  shape: sphereShape,
  material: defaultMaterial,
})

const floorBody = new CANNON.Body({
  mass: 0, // means that don't drop
  shape: floorShape,
  material: defaultMaterial
})
```

## Cannon-es

cannon-es 是使用 ts 製作的 cannon，文檔也更清楚，我們來替換 cannon

```bash
npm i -S cannon-es
```

```ts
import * as CANNON from 'cannon-es'
```

## 施加外力 Apply Forces
- applyForce 施加作用力。可以用作風吹動樹葉，或推倒多米諾骨牌或憤怒的小鳥的受力
- applyImpulse 施加衝量。這個衝量是瞬間的，例如射出去的子彈。
- applyLocalForce 同 applyForce，不過是在物體的內部施力，對剛體的局部點施力。
- applyLocalImpulse 同 applyImpulse，不過是在物體的內部施加衝量，對剛體的局部點施加衝量。

我們增加以下程式碼，就可以看到小球飛出去
```ts
sphereBody.applyForce(new CANNON.Vec3(100, 0, 0), new CANNON.Vec3(0, 0, 0))
```

## 創建多個 body

```ts

// create sphere body
const objectsToUpdate: Array<{
  mesh: THREE.Mesh,
  body: CANNON.Body
}> = [];


const createSphere = (radius: number, position: THREE.Vector3)=> {
  // THREE.js mesh
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(radius, 32, 32),
    new THREE.MeshStandardMaterial(),
  );
  mesh.castShadow = true;
  mesh.position.copy(position);

  scene.add(mesh);

  // Cannon body
  const shape = new CANNON.Sphere(radius);
  const body = new CANNON.Body({
    mass: 1,
    shape,
    material: defaultMaterial,
  });

  body.position.copy(position as any);
  world.addBody(body);

  objectsToUpdate.push({
    mesh,
    body
  });
}

createSphere(1, new THREE.Vector3(0, 5, 0));

// Boxes
const createBoxes = (width: number, height: number, depth: number, position: THREE.Vector3) => {
  // Three.js mesh
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(), 
    new THREE.MeshStandardMaterial()
    )
  mesh.castShadow = true
  mesh.scale.set(width, height, depth)
  mesh.position.copy(position)
  scene.add(mesh)

  // Cannon body
  const shape = new CANNON.Box(new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5))
  const body = new CANNON.Body({
    mass: 1,
    shape,
    material: defaultMaterial,
  })

  body.position.copy(position as any)
  world.addBody(body)
  objectsToUpdate.push({
    mesh,
    body,
  })
}
```

要記得在 `tick()` 裡更新
```ts
// let the three.js object's position is same as world step
objectsToUpdate.forEach(obj => {
  obj.mesh.position.copy(obj.body.position as any);
  obj.mesh.quaternion.copy(obj.body.quaternion as any);
})
```

## 性能優化
檢測物體之間碰撞，每次每個物體互相檢查是一個非常消耗性能的場景。這就需要寬相（Broadphase）了，它通過負責的算法在檢測碰撞之前，將物體分類，如果2個物體相距太遠，根本不會發生碰撞，它們可能就不在同一個分類裡，計算機也不需要進行碰撞計算檢測。

- NaiveBroadphase Cannon 默認的算法。檢測物體碰撞時，一個基礎的方式是檢測每個物體是否與其他每個物體發生了碰撞
- GridBroadphase 網格檢測。軸對齊的均勻網格 Broadphase。將空間劃分為網格，網格內進行檢測。
- SAPBroadphase(Sweep-and-Prune) 掃描-剪枝算法，性能最好。背後算法太過複雜，後續如果我有時間和精力，會單獨寫一篇關於碰撞檢測的專題文章。
默認為 NaiveBroadphase，建議替換為 SAPBroadphase

```ts
world.broadphase = new CANNON.SAPBroadphase(world);
```

### Sleep
雖然我們使用了 Broadphase 算法來優化了物體的碰撞檢測，但是仍然是對所有物體進行了檢測。我們可以使用一個特性叫 sleep。當物體的速度非常非常滿的時候，肉眼已經無法察覺其在運動，那麼就可以讓這個物體 sleep，不參與碰撞檢測，直到它被外力擊中或其他物體碰撞到它。

```
world.allowSleep = true
```


## 事件
我們可以監聽 Body 上的事件。如果需要在碰撞時發出聲音這將非常有用。可以監聽的事件有 'collide', 'sleep' or 'wakeup' 等

我們首先增加音頻

```ts
/**
 * Sounds
 */
const hitSound = new Audio('../assets/sounds/hit.mp3');

const playHitSound = (collision: { contact: CANNON.ContactEquation }) => {
  const impactStrength = collision.contact.getImpactVelocityAlongNormal();
  if (impactStrength > 1.5) {
    hitSound.volume = Math.random();
    hitSound.currentTime = 0;
    hitSound.play();
  }
}
```

並在創建 body 的地方添加事件
```js
body.addEventListener('collide', playHitSound)
```

## 移除 body

```ts
guiObj.reset = () => {
  objectsToUpdate.forEach((object) => {
    // Remove body
    object.body.removeEventListener('collide', playHitSound);
    world.removeBody(object.body);
    // Remove mesh
    scene.remove(object.mesh);
  })
  objectsToUpdate.splice(0, objectsToUpdate.length);
}

// ...

gui.add(guiObj, 'reset');
```