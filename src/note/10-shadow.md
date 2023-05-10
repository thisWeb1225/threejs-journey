# shadow 陰影
在 three.js 中，創造陰影不難，難的是優化。

```ts
const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
```

```ts
cube.castShadow = true;
plane.receiveShadow = true;
```

只有三種燈光支持 shadow