# shadow 陰影
在 three.js 中，創造陰影不難，難的是優化。

首先要在 renderer 中開啟投影 shadowMap

```ts
const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.shadowMap.enabled = true;
```
並在幾何體上開啟發射投影和接受投影

```ts
cube.castShadow = true;
plane.receiveShadow = true;
```
最後在光照上增加發射的投影的屬性

```ts
directionalLight.castShadow = true;
```
## 支持投影的燈光
只有三種燈光支持 shadow
- PointLight
- DirectionalLight
- SpotLight

## 調整投影的細緻度
在燈光上使用 shadow.mapSize 可以讓投影更清晰
```ts
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
```

### Near and far
可以使用 Helper 來更清楚看到投影的效果
```ts
const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
scene.add(directionalLightCameraHelper);
```
並設定投影的距離
```ts
directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.far = 6
```

### shadow camera 尺寸
可以設置平行光陰影的尺寸

```ts
directionalLight.shadow.camera.top = 2
directionalLight.shadow.camera.right = 2
directionalLight.shadow.camera.bottom = - 2
directionalLight.shadow.camera.left = - 2
```