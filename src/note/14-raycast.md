# Raycast
光線投影可以用來偵測物體是否與光線相交，也可以將光線設在滑鼠上，就可以判斷滑鼠是否滑過物體

## 創建 raycast

```ts
const raycaster = new THREE.Raycaster();
const rayOrigin = new THREE.Vector3(0, 0, 10);
const rayDirector = new THREE.Vector3(0, 0, -10);
rayDirector.normalize(); // 單位向量
raycaster.set(rayOrigin, rayDirector);

// 可以判斷一個物體
const intersect = raycaster.intersectObject(object2);
console.log(intersect);

// 或判斷多個物體
const intersects = raycaster.intersectObjects([object1, object2, object3]);
console.log(intersects);
```
此時當物體經過光線就會被儲存在 intersects 裡面

## 移動物體並判斷使否與光線投影相交

```ts
const clock = new THREE.Clock();
const raycaster = new THREE.Raycaster();

const tick = () => {

  const elapsedTime = clock.getElapsedTime();
  // Animate objects
  object1.position.y = Math.sin(elapsedTime);
  object2.position.y = Math.sin(elapsedTime * 1.5) * 1.5;
  object3.position.y = Math.sin(elapsedTime * 2) * 3;

  // cast a ray
  raycaster.setFromCamera(mouse, camera);

  const rayOrigin = new THREE.Vector3(0, 0, -10);
  const rayDirector = new THREE.Vector3(0, 0, 10);
  rayDirector.normalize();

  raycaster.set(rayOrigin, rayDirector);

  const objectsToTest = [object1, object2, object3];
  const intersects = raycaster.intersectObjects(objectsToTest);

  // 沒有相交的物體變回白色
  for (const object of objectsToTest) {
    object.material.color.set('#ffffff');
  }

  // 相交的物體變藍色
  for (const intersect of intersects) {
    // console.log(intersect.object)
    const object = intersect.object as THREE.Mesh<
      THREE.SphereGeometry,
      THREE.MeshBasicMaterial
    >;
    object.material.color.set('#00aaee');
  }
  // update the controls
  controls.update();

  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
}
```

## 將光線投影設定在滑鼠位置上

```js
const mouse = new THREE.Vector2();

window.addEventListener('mousemove', (e) => {
  mouse.x = (e.clientX / sizes.width) * 2 - 1;
  mouse.y = -(e.clientY / sizes.height) * 2 + 1;
});

const raycaster = new THREE.Raycaster();

const tick = () => {

  const elapsedTime = clock.getElapsedTime();
  // Animate objects
  object1.position.y = Math.sin(elapsedTime);
  object2.position.y = Math.sin(elapsedTime * 1.5) * 1.5;
  object3.position.y = Math.sin(elapsedTime * 2) * 3;

  // cast a ray
  raycaster.setFromCamera(mouse, camera);

  const objectsToTest = [object1, object2, object3];
  const intersects = raycaster.intersectObjects(objectsToTest);

  for (const object of objectsToTest) {
    object.material.color.set('#ffffff');
  }

  for (const intersect of intersects) {
    // console.log(intersect.object)
    const object = intersect.object as THREE.Mesh<
      THREE.SphereGeometry,
      THREE.MeshBasicMaterial
    >;
    object.material.color.set('#00aaee');
  }

  if (intersects.length) {
    if (currentIntersect === null) {
      console.log('mouse enter');
    }
    currentIntersect = intersects[0];
  } else {
    if (currentIntersect) {
      console.log('mouse leave');
    }
    currentIntersect = null;
  }

  // update the controls
  controls.update();

  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
}
```

## 添加滑鼠點擊事件

```ts
window.addEventListener('click', () => {
  if (currentIntersect) {
    console.log ('click on a sphere');
    if (currentIntersect.object === object1) {
      console.log('click on object1')
    }
  }
})
```