# 12 Particles 粒子效果

創建粒子向創建幾何一樣簡單，使用 `PoinstMaterial` 材質即可，他不會創建整個幾何體，而是創建非常多的點。

```ts
/**
 * Particles
 */
// geometry
const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
// material
const pointMaterial = new THREE.PointsMaterial({
  size: 0.02,
  sizeAttenuation: true,
})
```
* size: Number
  設置點的大小
* sizeAttenuation: Boolean
  指定點大小是否因相機深度而衰減，僅限透視相機

之前都是使用 Mesh 網格幾何體，現在要用點 Points
```ts
const particles = new THREE.Points(sphereGeometry, pointMaterial)
scene.add(particles)
```
此時就能創建一個由點組合成的圓形了

## 自訂幾何體
除了使用 Three.js 提供的幾何體，我們也可以使用 `BufferGeometry` 並添加 position 屬性來製作自己的幾何體

```ts
// geometry
const particlesGeometry = new THREE.BufferGeometry()
const count = 5000
const positions = new Float32Array(count * 3) 
for (let i = 0; i < count * 3; i += 1) {
  positions[i] = (Math.random() - 0.5) * 5
}
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
```

##  動畫
我們可以直接控制 Points 對象來製作動畫
```js
// Animations
const clock = new THREE.Clock()
const tick = () => {
  stats.begin()

  const elapsedTime = clock.getElapsedTime()
  particles.position.x = 0.1 * Math.sin(elapsedTime)

  controls.update()
  pointMaterial.needsUpdate = true

  // Render
  renderer.render(scene, camera)
  stats.end()
  requestAnimationFrame(tick)
}
```

也可以通過修改 attributes 來製作動畫
```js
// Animations
const clock = new THREE.Clock()
const tick = () => {
  stats.begin()

  const elapsedTime = clock.getElapsedTime()
  // particles.position.x = 0.1 * Math.sin(elapsedTime)

  for (let i = 0; i < count; i += 1) {
    const x = particlesGeometry.attributes.position.getX(i)
    particlesGeometry.attributes.position.setY(i, Math.sin(elapsedTime + x))
  }
  particlesGeometry.attributes.position.needsUpdate = true

  controls.update()
  // pointMaterial.needsUpdate = true

  // Render
  renderer.render(scene, camera)
  stats.end()
  requestAnimationFrame(tick)
}

tick()
```

## 小結
儘管 particles 很酷炫，但我們還是要避免使用這個技術，因為非常佔性能，更好的方法是使用自訂義 shader 方案。
