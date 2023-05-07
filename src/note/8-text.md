# 字體
Three.js 內置了 FontLoader 來載入 json 格式字體。也可以使用 facetype.js 在線轉換 json 字體。

## 加載字體
```ts
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
...
// Load font
const fontLoader = new FontLoader()
fontLoader.load(
  '../assets/fonts/Fira Code Medium_Regular.json',
  // onLoad回调
  (font) => {
    console.log('loaded', font)
  },
)
```

接下來我們需要在成功回調里繼續完成程式碼，創建文字的幾何圖形。

```ts
// Load font
const fontLoader = new FontLoader()
fontLoader.load(
  '../assets/fonts/Fira Code Medium_Regular.json',
  // onLoad回调
  (font) => {
    console.log('loaded', font)
    const textGeometry = new TextGeometry("Joe CS's three.js world!", {
      font,
      size: 0.5,
      height: 0.2,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelOffset: 0,
      bevelSegments: 5,
    })

    const textMaterial = new THREE.MeshBasicMaterial()
    const text = new THREE.Mesh(textGeometry, textMaterial)
    scene.add(text)
  },
)
```

但可以看到文字並沒有在中間位置，我們需要居中展示

### 使文字居中
居中的方式是計算幾何體的立方體邊界，再進行位移。

使用 BoxHelper 可以觀察 bounding box:
```js
const box = new THREE.BoxHelper(text, 0xffff00)
scene.add(box)
```

於是我們使用 獲取 box 的尺寸，再進行位移，代碼如下computeBoundingBox:
```ts
textGeometry.computeBoundingBox() // 计算 box 邊界
if (textGeometry.boundingBox) {
  textGeometry.translate(
    -textGeometry.boundingBox.max.x * 0.5, // Subtract bevel size
    -textGeometry.boundingBox.max.y * 0.5, // Subtract bevel size
    -textGeometry.boundingBox.max.z * 0.5, // Subtract bevel thickness
  )
}
```

可以看到完成了居中展示

不過可以直接使用 `textGeometry.center()` 來更快去居中字體。

完整的程式碼如下:

```ts
import * as THREE from 'three'
import './style.css'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import stats from '../common/stats'
import { listenResize, dbClkfullScreen } from '../common/utils'

// Canvas
const canvas = document.querySelector('#mainCanvas') as HTMLCanvasElement

// Scene
const scene = new THREE.Scene()

// Load font
const fontLoader = new FontLoader()
fontLoader.load(
  '../assets/fonts/Fira Code Medium_Regular.json',
  // onLoad 回调
  (font) => {
    console.log('loaded', font)
    const textGeometry = new TextGeometry("Joe CS's world!", {
      font,
      size: 0.5,
      height: 0.2,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelOffset: 0,
      bevelSegments: 5,
    })

    const textMaterial = new THREE.MeshBasicMaterial()
    textMaterial.wireframe = true

    textGeometry.center() // 居中

    const text = new THREE.Mesh(textGeometry, textMaterial)
    scene.add(text)

    const box = new THREE.BoxHelper(text, 0xffff00)
    scene.add(box)
  },
)

// Size
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(1, 2, 3)

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

dbClkfullScreen(canvas)
listenResize(sizes, camera, renderer)

// Animations
const tick = () => {
  stats.begin()

  controls.update()
  // Render
  renderer.render(scene, camera)
  stats.end()
  requestAnimationFrame(tick)
}

tick()
```

## 添加 matcap 材質
可以在 github.com/nidorx/matc... 這裡找到需要的紋理素材，如果商用，要記得先確保版權。 

不需要特別高解析度，256*256 足矣。

```js
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('../assets/textures/matcaps/1.png')

const textMaterial = new THREE.MeshMatcapMaterial()
textMaterial.matcap = matcapTexture
```

### 添加物件

我們在添加一些幾何體懸浮在周圍。 可以在 for 循環中創建各種幾何體。

```ts
const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45)
const boxGeometry = new THREE.BoxGeometry(0.6, 0.6, 0.6)

for (let i = 0; i < 100; i += 1) {
  let mesh
  if (i % 10 <= 2) {
    mesh = new THREE.Mesh(boxGeometry, material)
  } else {
    mesh = new THREE.Mesh(donutGeometry, material)
  }
  mesh.position.set(
    (Math.random() - 0.5) * 10,
    (Math.random() - 0.5) * 10,
    (Math.random() - 0.5) * 10
  )
  mesh.setRotationFromEuler(
    new THREE.Euler(Math.PI * Math.random(), Math.PI * Math.random(), Math.PI * Math.random())
  )
  const radomeScale = Math.random() * 0.5 + 0.5
  mesh.scale.set(radomeScale, radomeScale, radomeScale)
  scene.add(mesh)
}
```

## 動畫
可以直接使用 `OrbitControls` 進行旋轉:

```ts
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// 添加以下程式碼
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.autoRotate = true
controls.autoRotateSpeed = 0.4

// ...

// 別忘了在 tick 更新 controls
// Animations
const tick = () => {
  stats.begin()

  controls.update()

  // Render
  renderer.render(scene, camera)
  stats.end()
  requestAnimationFrame(tick)
}

tick()
```
